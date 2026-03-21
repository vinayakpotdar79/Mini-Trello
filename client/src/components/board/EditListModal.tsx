import React from 'react';
import { Plus } from 'lucide-react';

interface EditListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (value: string) => void;
}

const EditListModal: React.FC<EditListModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit List</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              List Title
            </label>
            <input
              type="text"
              autoFocus
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="List Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700/50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none transition"
            >
              Update List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditListModal;