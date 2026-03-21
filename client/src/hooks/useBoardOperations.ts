import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getLists, createList, updateList, deleteList } from '../features/list/listSlice';
import { createCard, updateCard, deleteCard, reset as resetCards } from '../features/card/cardSlice';

export const useBoardOperations = (boardId: string | undefined) => {
  const dispatch = useAppDispatch();
  const { lists } = useAppSelector((state) => state.list);
  const { cards } = useAppSelector((state) => state.card);

  // ===== LIST OPERATIONS =====
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');

  const [isEditListModalOpen, setIsEditListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState<any>(null);
  const [editListTitle, setEditListTitle] = useState('');

  const [isDeleteListModalOpen, setIsDeleteListModalOpen] = useState(false);
  const [deletingList, setDeletingList] = useState<any>(null);

  // ===== CARD OPERATIONS =====
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [addingCardToList, setAddingCardToList] = useState<string>('');
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardPriority, setNewCardPriority] = useState<'Low' | 'Medium' | 'High'>('Low');

  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [editCardTitle, setEditCardTitle] = useState('');
  const [editCardDescription, setEditCardDescription] = useState('');
  const [editCardPriority, setEditCardPriority] = useState<'Low' | 'Medium' | 'High'>('Low');

  const [isDeleteCardModalOpen, setIsDeleteCardModalOpen] = useState(false);
  const [deletingCard, setDeletingCard] = useState<any>(null);

  // ===== CARD DETAIL VIEW =====
  const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState(false);
  const [viewingCard, setViewingCard] = useState<any>(null);

  // ===== LIST HANDLERS =====
  const onAddList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListTitle.trim() && boardId) {
      dispatch(createList({ boardId, listData: { title: newListTitle } }));
      setIsAddListModalOpen(false);
      setNewListTitle('');
    }
  };

  const onEditList = (e: React.FormEvent) => {
    e.preventDefault();
    if (editListTitle.trim() && editingList) {
      dispatch(updateList({ listId: editingList._id, listData: { title: editListTitle } }));
      setIsEditListModalOpen(false);
      setEditingList(null);
      setEditListTitle('');
    }
  };

  const onConfirmDeleteList = async () => {
    if (deletingList) {
      await dispatch(deleteList(deletingList._id));
      if (boardId) {
        dispatch(getLists(boardId));
        setTimeout(() => dispatch(resetCards()), 0);
      }
      setIsDeleteListModalOpen(false);
      setDeletingList(null);
    }
  };

  const onUpdateList = (listId: string, currentTitle: string) => {
    const list = lists.find(l => l._id === listId);
    if (list) {
      setEditingList(list);
      setEditListTitle(currentTitle);
      setIsEditListModalOpen(true);
    }
  };

  const onDeleteList = (listId: string) => {
    const list = lists.find(l => l._id === listId);
    if (list) {
      setDeletingList(list);
      setIsDeleteListModalOpen(true);
    }
  };

  // ===== CARD HANDLERS =====
  const onAddCard = (listId: string) => {
    setAddingCardToList(listId);
    setNewCardTitle('');
    setNewCardDescription('');
    setNewCardPriority('Low');
    setIsAddCardModalOpen(true);
  };

  const onAddCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardTitle.trim() && addingCardToList) {
      dispatch(createCard({
        listId: addingCardToList,
        cardData: {
          title: newCardTitle,
          description: newCardDescription,
          priority: newCardPriority
        }
      }));
      setIsAddCardModalOpen(false);
      setAddingCardToList('');
      setNewCardTitle('');
      setNewCardDescription('');
      setNewCardPriority('Low');
    }
  };

  const onEditCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCardTitle.trim() && editingCard) {
      dispatch(updateCard({
        cardId: editingCard._id,
        cardData: {
          title: editCardTitle,
          description: editCardDescription,
          priority: editCardPriority
        }
      }));
      setIsEditCardModalOpen(false);
      setEditingCard(null);
      setEditCardTitle('');
      setEditCardDescription('');
      setEditCardPriority('Low');
    }
  };

  const onConfirmDeleteCard = () => {
    if (deletingCard) {
      dispatch(deleteCard(deletingCard._id));
      setIsDeleteCardModalOpen(false);
      setDeletingCard(null);
    }
  };

  const onUpdateCard = (cardId: string, _currentTitle: string) => {
    // Find the card across all lists
    let card: any = null;
    for (const listId in cards) {
      card = cards[listId].find((c: any) => c._id === cardId);
      if (card) break;
    }
    if (card) {
      setEditingCard(card);
      setEditCardTitle(card.title);
      setEditCardDescription(card.description || '');
      setEditCardPriority(card.priority || 'Low');
      setIsEditCardModalOpen(true);
    }
  };

  const onDeleteCard = (cardId: string) => {
    // Find the card across all lists
    let card: any = null;
    for (const listId in cards) {
      card = cards[listId].find((c: any) => c._id === cardId);
      if (card) break;
    }
    if (card) {
      setDeletingCard(card);
      setIsDeleteCardModalOpen(true);
    }
  };

  const onViewCard = (cardId: string) => {
    // Find the card across all lists
    let card: any = null;
    for (const listId in cards) {
      card = cards[listId].find((c: any) => c._id === cardId);
      if (card) break;
    }
    if (card) {
      setViewingCard(card);
      setIsCardDetailModalOpen(true);
    }
  };

  return {
    // Modal states
    isAddListModalOpen,
    setIsAddListModalOpen,
    newListTitle,
    setNewListTitle,

    isEditListModalOpen,
    setIsEditListModalOpen,
    editingList,
    setEditingList,
    editListTitle,
    setEditListTitle,

    isDeleteListModalOpen,
    setIsDeleteListModalOpen,
    deletingList,
    setDeletingList,

    isAddCardModalOpen,
    setIsAddCardModalOpen,
    addingCardToList,
    setAddingCardToList,
    newCardTitle,
    setNewCardTitle,
    newCardDescription,
    setNewCardDescription,
    newCardPriority,
    setNewCardPriority,

    isEditCardModalOpen,
    setIsEditCardModalOpen,
    editingCard,
    setEditingCard,
    editCardTitle,
    setEditCardTitle,
    editCardDescription,
    setEditCardDescription,
    editCardPriority,
    setEditCardPriority,

    isDeleteCardModalOpen,
    setIsDeleteCardModalOpen,
    deletingCard,
    setDeletingCard,

    // Card Detail Modal
    isCardDetailModalOpen,
    setIsCardDetailModalOpen,
    viewingCard,
    setViewingCard,

    // Handlers
    onAddList,
    onEditList,
    onConfirmDeleteList,
    onAddCard,
    onAddCardSubmit,
    onEditCard,
    onConfirmDeleteCard,
    onUpdateList,
    onDeleteList,
    onUpdateCard,
    onDeleteCard,
    onViewCard,
  };
};