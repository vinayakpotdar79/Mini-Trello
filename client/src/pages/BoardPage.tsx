import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getLists, reset as resetLists } from '../features/list/listSlice';
import { getCards, reset as resetCards, updateCard, reorderCards, reorderCardsAPI } from '../features/card/cardSlice';
import { getBoards } from '../features/board/boardSlice';
import type {
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';

import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import ListItem from '../components/list/ListItem';
import CardItem from '../components/card/CardItem';
import BoardHeader from '../components/board/BoardHeader';
import AddCardModal from '../components/board/AddCardModal';
import AddListModal from '../components/board/AddListModal';
import EditListModal from '../components/board/EditListModal';
import DeleteListModal from '../components/board/DeleteListModal';
import EditCardModal from '../components/board/EditCardModal';
import DeleteCardModal from '../components/board/DeleteCardModal';
import CardDetailModal from '../components/board/CardDetailModal';
import { useBoardOperations } from '../hooks/useBoardOperations';
import { Loader2, Plus } from 'lucide-react';

const BoardPage = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { lists, isLoading: listsLoading } = useAppSelector((state) => state.list);
  const { cards } = useAppSelector((state) => state.card);
  const { boards } = useAppSelector((state) => state.board);

  const board = boardId ? boards.find((item) => item._id === boardId) : null;

  const [activeCard, setActiveCard] = useState<any>(null);

  const boardOperations = useBoardOperations(boardId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (boardId) {
      dispatch(getBoards());
      dispatch(getLists(boardId));
    }

    return () => {
      dispatch(resetLists());
      dispatch(resetCards());
    };
  }, [user, boardId, navigate, dispatch]);

  useEffect(() => {
    if (lists.length > 0) {
      lists.forEach((list) => {
        dispatch(getCards(list._id));
      });
    }
  }, [lists, dispatch]);

  const handleDragStart = (event: any) => {
    const { active } = event;
    if (active.data?.current?.type === 'Card') {
      setActiveCard(active.data.current.card);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const overId = over.id;

    if (active.id === overId) return;

    const activeListId = active.data.current?.card.listId;
    const overListId = over.data.current?.type === 'Card'
      ? over.data.current.card.listId
      : (overId as string);

    // If dropping on a card in the same list, handle reordering
    if (active.data.current?.type === 'Card' && over.data.current?.type === 'Card' && activeListId === overListId) {
      // Reordering within the same list - for now, just allow the visual reorder
      return;
    }

    // If dropping on a different list or on a list container
    if (activeListId !== overListId) {
      // Moving between lists
      console.log('Moving card from', activeListId, 'to', overListId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const overId = over.id;

    if (active.id === overId) return;

    const activeCardData = active.data.current?.card;
    const overListId = over.data.current?.type === 'Card'
      ? over.data.current.card.listId
      : (overId as string);

    if (!activeCardData) return;

    const activeListId = activeCardData.listId;

    // If dropping on the same list, handle reordering
    if (activeListId === overListId) {
      const cardsInList = cards[activeListId] || [];
      const activeIndex = cardsInList.findIndex((card) => card._id === active.id);

      if (activeIndex !== -1) {
        const overIndex =
          over.data.current?.type === 'Card'
            ? cardsInList.findIndex((card) => card._id === overId)
            : cardsInList.length - 1;

        if (overIndex !== -1 && activeIndex !== overIndex) {
          dispatch(reorderCards({
            listId: activeListId,
            fromIndex: activeIndex,
            toIndex: overIndex,
          }));

          // Get the reordered cards and send to API
          const reorderedCards = [...cardsInList];
          const [moved] = reorderedCards.splice(activeIndex, 1);
          reorderedCards.splice(overIndex, 0, moved);
          const cardIds = reorderedCards.map(card => card._id);

          dispatch(reorderCardsAPI({
            listId: activeListId,
            cardIds,
          }));
        }
      }
    }
    // If dropping on a different list
    else if (activeListId !== overListId) {
      const targetCards = cards[overListId] || [];
      let newPosition = targetCards.length; // Default to end

      // If dropped on a specific card, insert at that position
      if (over.data.current?.type === 'Card') {
        const overIndex = targetCards.findIndex((card) => card._id === overId);
        if (overIndex !== -1) {
          newPosition = overIndex;
        }
      }

      dispatch(updateCard({
        cardId: activeCardData._id,
        cardData: { listId: overListId, position: newPosition }
      }));

      // Update positions of remaining cards in the target list
      const updatedTargetCards = [...targetCards];
      updatedTargetCards.splice(newPosition, 0, activeCardData);
      const targetCardIds = updatedTargetCards.map(card => card._id);

      dispatch(reorderCardsAPI({
        listId: overListId,
        cardIds: targetCardIds,
      }));

      // Update positions in the source list
      const sourceCards = cards[activeListId] || [];
      const filteredSourceCards = sourceCards.filter(card => card._id !== activeCardData._id);
      const sourceCardIds = filteredSourceCards.map(card => card._id);

      dispatch(reorderCardsAPI({
        listId: activeListId,
        cardIds: sourceCardIds,
      }));
    }
  };

  if (listsLoading && lists.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-white dark:bg-dark-bg transition-colors duration-300">
        <Loader2 className="animate-spin text-blue-600 dark:text-blue-400" size={40} />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <BoardHeader
        boardTitle={board?.title || 'Project Board'}
        memberCount={board?.members?.length || 1}
      />

      {/* Board Scroll Area */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-auto p-8 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-dark-bg dark:to-dark-bg custom-scrollbar transition-colors duration-300">
          <div className="flex gap-8 items-start min-w-max">
            <SortableContext items={lists.map(l => l._id)} strategy={horizontalListSortingStrategy}>
              {lists.map((list) => (
                <ListItem
                  key={list._id}
                  list={list}
                  cards={cards[list._id] || []}
                  onAddCard={boardOperations.onAddCard}
                  onUpdateList={boardOperations.onUpdateList}
                  onDeleteList={boardOperations.onDeleteList}
                  onUpdateCard={boardOperations.onUpdateCard}
                  onDeleteCard={boardOperations.onDeleteCard}
                  onViewCard={boardOperations.onViewCard}
                />
              ))}
            </SortableContext>

            {/* Add List Button */}
            <button
              onClick={() => boardOperations.setIsAddListModalOpen(true)}
              className="w-80 shrink-0 flex items-center justify-center gap-3 p-6 bg-white/80 dark:bg-dark-surface/50 border-2 border-dashed border-blue-300 dark:border-blue-900 rounded-2xl text-blue-600 dark:text-blue-400 font-bold hover:bg-white dark:hover:bg-dark-surface hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-lg transition-all group backdrop-blur-sm"
            >
              <Plus size={24} className="group-hover:scale-110 transition-transform" />
              Add another list
            </button>
          </div>
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: {
              active: {
                opacity: '0.4',
              },
            },
          }),
        }}>
          {activeCard ? (
            <CardItem
              card={activeCard}
              onUpdateCard={() => { }}
              onDeleteCard={() => { }}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modals */}
      <AddCardModal
        isOpen={boardOperations.isAddCardModalOpen}
        onClose={() => {
          boardOperations.setIsAddCardModalOpen(false);
          boardOperations.setAddingCardToList('');
          boardOperations.setNewCardTitle('');
          boardOperations.setNewCardDescription('');
          boardOperations.setNewCardPriority('Low');
        }}
        onSubmit={boardOperations.onAddCardSubmit}
        title={boardOperations.newCardTitle}
        setTitle={boardOperations.setNewCardTitle}
        description={boardOperations.newCardDescription}
        setDescription={boardOperations.setNewCardDescription}
        priority={boardOperations.newCardPriority}
        setPriority={boardOperations.setNewCardPriority}
      />

      <AddListModal
        isOpen={boardOperations.isAddListModalOpen}
        onClose={() => {
          boardOperations.setIsAddListModalOpen(false);
          boardOperations.setNewListTitle('');
        }}
        onSubmit={boardOperations.onAddList}
        title={boardOperations.newListTitle}
        setTitle={boardOperations.setNewListTitle}
      />

      <EditListModal
        isOpen={boardOperations.isEditListModalOpen}
        onClose={() => {
          boardOperations.setIsEditListModalOpen(false);
          boardOperations.setEditingList(null);
          boardOperations.setEditListTitle('');
        }}
        onSubmit={boardOperations.onEditList}
        title={boardOperations.editListTitle}
        setTitle={boardOperations.setEditListTitle}
      />

      <DeleteListModal
        isOpen={boardOperations.isDeleteListModalOpen}
        onClose={() => {
          boardOperations.setIsDeleteListModalOpen(false);
          boardOperations.setDeletingList(null);
        }}
        onConfirm={boardOperations.onConfirmDeleteList}
        listTitle={boardOperations.deletingList?.title || ''}
      />

      <EditCardModal
        isOpen={boardOperations.isEditCardModalOpen}
        onClose={() => {
          boardOperations.setIsEditCardModalOpen(false);
          boardOperations.setEditingCard(null);
          boardOperations.setEditCardTitle('');
          boardOperations.setEditCardDescription('');
          boardOperations.setEditCardPriority('Low');
        }}
        onSubmit={boardOperations.onEditCard}
        title={boardOperations.editCardTitle}
        setTitle={boardOperations.setEditCardTitle}
        description={boardOperations.editCardDescription}
        setDescription={boardOperations.setEditCardDescription}
        priority={boardOperations.editCardPriority}
        setPriority={boardOperations.setEditCardPriority}
      />

      <DeleteCardModal
        isOpen={boardOperations.isDeleteCardModalOpen}
        onClose={() => {
          boardOperations.setIsDeleteCardModalOpen(false);
          boardOperations.setDeletingCard(null);
        }}
        onConfirm={boardOperations.onConfirmDeleteCard}
        cardTitle={boardOperations.deletingCard?.title || ''}
      />

      <CardDetailModal
        card={boardOperations.viewingCard}
        isOpen={boardOperations.isCardDetailModalOpen}
        onClose={() => {
          boardOperations.setIsCardDetailModalOpen(false);
          boardOperations.setViewingCard(null);
        }}
        onEdit={() => {
          boardOperations.onUpdateCard(boardOperations.viewingCard._id, boardOperations.viewingCard.title);
          boardOperations.setIsCardDetailModalOpen(false);
        }}
        onDelete={() => {
          boardOperations.onDeleteCard(boardOperations.viewingCard._id);
          boardOperations.setIsCardDetailModalOpen(false);
        }}
      />
    </div>
  );
};

export default BoardPage;