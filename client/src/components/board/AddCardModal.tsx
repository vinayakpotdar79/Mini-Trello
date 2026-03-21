import React from 'react';
import { Plus } from 'lucide-react';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  priority: 'Low' | 'Medium' | 'High';
  setPriority: (value: 'Low' | 'Medium' | 'High') => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
          >
            <Plus size={24} className="rotate-45" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Card Title
              </label>
              <input
                type="text"
                autoFocus
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition h-24 resize-none"
                placeholder="Add more details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Priority
              </label>
              <div className="flex gap-2">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-semibold border transition ${
                      priority === p
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white dark:bg-dark-bg border-gray-200 dark:border-dark-border text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
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
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;