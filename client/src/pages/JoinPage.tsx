import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Loader2, Users, ArrowRight } from 'lucide-react';

const JoinPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [boardInfo, setBoardInfo] = useState<{ title: string; ownerName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!token) return;
      try {
        const res = await axiosInstance.get(`/api/join-board/invite-info/${token}`);
        setBoardInfo(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Invalid or expired invite link');
      }
    };
    fetchInfo();
  }, [token]);

  const handleJoin = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.post('/api/join-board/join', { token });
      const boardId = res.data.boardId;
      navigate(`/board/${boardId}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to join board');
    } finally {
      setLoading(false);
    }
  };

  if (!boardInfo && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg p-4">
      <div className="relative group w-full max-w-md">
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
        
        <div className="relative bg-white dark:bg-dark-surface rounded-2xl shadow-2xl p-8 border border-white/20 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative mb-6">
              <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20 transform -rotate-6 transition group-hover:rotate-0 duration-300">
                {boardInfo?.title?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white dark:bg-dark-surface border-4 border-slate-50 dark:border-dark-bg flex items-center justify-center overflow-hidden shadow-lg" title={`Owner: ${boardInfo?.ownerName}`}>
                 <div className="h-full w-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-600 dark:text-purple-400">
                    {boardInfo?.ownerName?.charAt(0).toUpperCase() || 'O'}
                 </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Ready to collaborate?
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              You've been invited to join <span className="font-bold text-indigo-600 dark:text-indigo-400">{boardInfo?.title}</span> by <span className="font-medium text-slate-700 dark:text-slate-200">{boardInfo?.ownerName}</span>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleJoin} 
              disabled={loading || !!error} 
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Joining...
                </>
              ) : (
                <>
                  Join the Board
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <button 
              onClick={() => navigate('/')} 
              className="w-full px-6 py-4 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 rounded-xl font-bold transition-all"
            >
              Maybe later
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-6 grayscale opacity-50">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
               <Users size={14} />
               Secure Collaboration
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
