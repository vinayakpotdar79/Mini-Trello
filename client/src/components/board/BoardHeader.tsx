import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface BoardHeaderProps {
  boardTitle: string;
  memberCount: number;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ boardTitle, memberCount }) => {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-4 flex justify-between items-center bg-blue-950 dark:bg-dark-surface backdrop-blur-md border-b border-white/10 dark:border-dark-border">
      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-white/10 rounded-full transition text-white"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white tracking-tight">{boardTitle}</h1>
          <div className="flex -space-x-2 ml-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 w-8 rounded-full border-2 border-blue-600 bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 shadow-sm">
                {String.fromCharCode(64 + i)}
              </div>
            ))}
            <button className="h-8 w-8 rounded-full border-2 border-blue-600 bg-white/20 flex items-center justify-center text-xs font-bold text-white hover:bg-white/30 transition">
              {memberCount}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-2.5 text-white/50" size={16} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition w-48 focus:w-64"
          />
        </div> */}
        {/* <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition">
          <Bell size={20} />
        </button>
        <button className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition">
          <Settings size={20} />
        </button> */}
        <button className="ml-2 px-4 py-2 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 shadow-lg shadow-black/10 transition">
          Invite
        </button>
      </div>
    </div>
  );
};

export default BoardHeader;