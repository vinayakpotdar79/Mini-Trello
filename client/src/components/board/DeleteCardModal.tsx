import React from 'react';
import { Plus } from 'lucide-react';

interface DeleteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cardTitle: string;
}

const DeleteCardModal: React.FC<DeleteCardModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  cardTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Delete Card?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <div className="mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-gray-200">"{cardTitle}"</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700/50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 shadow-lg shadow-red-100 dark:shadow-none transition"
          >
            Delete Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCardModal;