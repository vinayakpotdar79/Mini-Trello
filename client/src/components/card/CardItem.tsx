import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Card as CardType } from '../../types';
import { AlignLeft, Calendar, User } from 'lucide-react';

interface CardItemProps {
  card: CardType;
  onUpdateCard: (cardId: string, currentTitle: string) => void;
  onDeleteCard: (cardId: string) => void;
  onViewCard?: (cardId: string) => void;
}

const CardItem = ({ card, onUpdateCard, onDeleteCard, onViewCard }: CardItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { type: 'Card', card } });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    touchAction: 'none',
    zIndex: isDragging ? 999 : 'auto',
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-white border-2 border-blue-500/20 rounded-xl p-3 mb-3 opacity-70 shadow-lg"
      />
    );
  }

  const priorityColors = {
    High: 'bg-red-500',
    Medium: 'bg-yellow-500',
    Low: 'bg-green-500',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        // Prevent click when dragging
        if (isDragging) return;
        e.stopPropagation();
        onViewCard?.(card._id);
      }}
      className="bg-white dark:bg-dark-bg p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all group mb-3 cursor-pointer relative"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-gray-100 dark:bg-dark-surface hover:bg-gray-200 dark:hover:bg-dark-border rounded"
        title="Drag to move"
      >
        <span className="text-gray-400 dark:text-gray-500">⋮⋮</span>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUpdateCard(card._id, card.title);
          }}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-blue-600 transition bg-white dark:bg-dark-surface hover:bg-blue-50 dark:hover:bg-dark-border rounded shadow-sm border border-gray-200 dark:border-dark-border"
          title="Edit card"
        >
          ✎
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCard(card._id);
          }}
          className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition bg-white dark:bg-dark-surface hover:bg-red-50 dark:hover:bg-red-900/10 rounded shadow-sm border border-gray-200 dark:border-dark-border"
          title="Delete card"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-between items-start mb-3">
        <div className={`h-2 w-12 rounded-full ${priorityColors[card.priority]}`}></div>
      </div>

      <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 leading-tight pr-8">
        {card.title}
      </h4>

      {card.description && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
          {card.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {card.description && <AlignLeft size={12} className="text-gray-400 dark:text-gray-500" />}
          {card.dueDate && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-surface px-2 py-1 rounded border border-transparent dark:border-dark-border">
              <Calendar size={10} />
              {new Date(card.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>
        {card.assignedTo && (
          <div className="h-6 w-6 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 border border-white dark:border-dark-border shadow-sm">
            <User size={10} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CardItem;
