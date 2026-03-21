import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { List as ListType, Card as CardType } from '../../types';
import CardItem from '../card/CardItem';
import { Plus, MoreVertical } from 'lucide-react';

interface ListItemProps {
  list: ListType;
  cards: CardType[];
  onAddCard: (listId: string) => void;
  onUpdateList: (listId: string, currentTitle: string) => void;
  onDeleteList: (listId: string) => void;
  onUpdateCard: (cardId: string, currentTitle: string) => void;
  onDeleteCard: (cardId: string) => void;
  onViewCard?: (cardId: string) => void;
}

const ListItem = ({ list, cards, onAddCard, onUpdateList, onDeleteList, onUpdateCard, onDeleteCard, onViewCard }: ListItemProps) => {
  const { setNodeRef } = useDroppable({
    id: list._id,
  });

  return (
    <div className="w-80 shrink-0 bg-gray-50 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-2xl flex flex-col h-full shadow-sm transition-colors duration-300">
      <div className="p-4 flex items-center justify-between border-b border-gray-100 dark:border-dark-border">
        <h3 className="font-bold text-gray-800 dark:text-gray-200 truncate pr-2">{list.title}</h3>
        <div className="flex items-center gap-1">
            <button
              onClick={() => onUpdateList(list._id, list.title)}
              className="text-gray-400 hover:text-blue-600 transition p-1"
              title="Edit list"
            >
              <MoreVertical size={18} />
            </button>
            <button
              onClick={() => onDeleteList(list._id)}
              className="text-gray-400 hover:text-red-500 transition p-1"
              title="Delete list"
            >
              ✕
            </button>
          </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-transparent">
        {/* Cards Container */}
        <div
          ref={setNodeRef}
          className="flex-1 overflow-y-auto px-3 min-h-[150px] max-h-[calc(100vh-230px)] custom-scrollbar"
        >
          <SortableContext
            items={cards.map((c) => c._id)}
            strategy={verticalListSortingStrategy}
          >
            {cards.map((card) => (
              <CardItem
                key={card._id}
                card={card}
                onUpdateCard={onUpdateCard}
                onDeleteCard={onDeleteCard}
                onViewCard={onViewCard}
              />
            ))}
          </SortableContext>
        </div>

        {/* Footer */}
        <div className="p-3">
          <button
            onClick={() => onAddCard(list._id)}
            className="w-full flex items-center gap-2 p-3 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 rounded-xl transition-all group"
          >
            <Plus size={18} className="text-gray-400 dark:text-gray-500 group-hover:text-blue-500" />
            Add a card
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
