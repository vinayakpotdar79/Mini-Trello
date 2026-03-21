import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getBoards, createBoard, reset } from '../features/board/boardSlice';
import { Plus, Layout, Loader2, Clock, Users } from 'lucide-react';

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { boards, isLoading } = useAppSelector(
    (state) => state.board
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getBoards());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, dispatch]);

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (boardTitle.trim()) {
      dispatch(createBoard({ title: boardTitle }));
      setBoardTitle('');
      setIsModalOpen(false);
    }
  };

  if (isLoading && boards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Boards</h1>
          <p className="text-gray-500 mt-1">Manage and track your project progress</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition duration-200"
        >
          <Plus size={20} />
          New Board
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {boards.map((board) => (
          <Link
            key={board._id}
            to={`/board/${board._id}`}
            className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition duration-300 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Layout size={20} />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
              {board.title}
            </h3>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{board.members?.length || 1} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{board.createdAt ? new Date(board.createdAt).toLocaleDateString() : 'Unknown'}</span>
              </div>
            </div>
          </Link>
        ))}

        {boards.length === 0 && !isLoading && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Layout className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-600">No boards yet</h3>
            <p className="text-gray-400 mt-1 mb-6">Create your first board to start organizing tasks</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2 bg-white text-blue-600 font-semibold rounded-xl border border-blue-200 hover:bg-blue-50 transition"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create New Board</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            <form onSubmit={onSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Board Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Project Alpha..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition disabled:opacity-70"
                >
                  {isLoading ? 'Creating...' : 'Create Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
