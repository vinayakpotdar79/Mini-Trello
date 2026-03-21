import React from 'react';
import type { Card as CardType } from '../../types';
import { AlignLeft, Calendar, User, Plus, Layout, Clock, Tag, Edit, Trash2 } from 'lucide-react';

interface CardDetailModalProps {
  card: CardType | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !card) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Low': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header/Cover */}
        <div className="h-32 bg-linear-to-r from-blue-600 to-indigo-600 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition"
          >
            <Plus size={24} className="rotate-45" />
          </button>
          <div className="absolute -bottom-6 left-8 p-4 bg-white dark:bg-dark-surface rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border">
            <Layout className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
        </div>

        <div className="pt-10 p-8 overflow-y-auto max-h-[calc(90vh-128px)]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{card.title}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                in list <span className="font-semibold text-blue-600 dark:text-blue-400">Project List</span>
              </p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getPriorityColor(card.priority)}`}>
              {card.priority} Priority
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold text-lg">
                  <AlignLeft size={20} />
                  Description
                </div>
                <div className="bg-gray-50 dark:bg-dark-bg p-6 rounded-2xl border border-gray-100 dark:border-dark-border text-gray-700 dark:text-gray-300 leading-relaxed min-h-[120px] whitespace-pre-wrap">
                  {card.description || 'No description provided.'}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-bold">
                  <Clock size={18} />
                  Created
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg px-4 py-2.5 rounded-xl border border-gray-100 dark:border-dark-border shadow-xs">
                  {new Date(card.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </div>
              </div>

              {card.dueDate && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-bold">
                    <Calendar size={18} />
                    Due Date
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg px-4 py-2.5 rounded-xl border border-gray-100 dark:border-dark-border shadow-xs">
                    {new Date(card.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </div>
                </div>
              )}

              {card.assignedTo && (
                <div>
                  <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-bold">
                    <User size={18} />
                    Assigned To
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-bg px-4 py-2.5 rounded-xl border border-gray-100 dark:border-dark-border shadow-xs">
                    {card.assignedTo}
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-bold">
                  <Tag size={18} />
                  Activities
                </div>
                <div className="space-y-2">
                  <div className="text-xs p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                    Card created
                  </div>
                  {card.updatedAt !== card.createdAt && (
                    <div className="text-xs p-3 bg-gray-50 dark:bg-gray-700/20 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-dark-border rounded-xl">
                      Last updated {new Date(card.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-dark-border mt-auto">
            <button
              onClick={onDelete}
              className="flex items-center gap-2 px-6 py-2.5 text-red-600 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition"
            >
              <Trash2 size={20} />
              Delete
            </button>
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition"
            >
              <Edit size={20} />
              Edit Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailModal;