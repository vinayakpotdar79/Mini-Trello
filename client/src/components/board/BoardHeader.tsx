import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Copy, ExternalLink, X, Users, Mail } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import type { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import type { User } from '../../types';

interface BoardHeaderProps {
  boardTitle: string;
  memberCount: number;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ boardTitle, memberCount }) => {
  const navigate = useNavigate();
  const [link, setLink] = React.useState('');
  const [showModal, setShowModal] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const board = useSelector((state: RootState) => state.board.currentBoard);
  const boardId = board?._id;
  const isOwner = user?._id === board?.ownerId;

  const handleInviteClick = async () => {
    if (!boardId) {
      alert('No board selected');
      return;
    }
    try {
      const res = await axiosInstance.post(
        `/api/join-board/generate-invite-link/${boardId}`);
      const inviteLink = res.data.link;
      setLink(inviteLink);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to generate invite link");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('Failed to copy');
    }
  };

  const members = board?.members || [];
  const displayMembers = members.slice(0, 4);

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
            {displayMembers.map((member: User | string) => {
              const name = typeof member === 'string' ? 'U' : (member.name || 'U');
              const initial = name.charAt(0).toUpperCase();
              return (
                <div
                  key={typeof member === 'string' ? member : member._id}
                  title={typeof member === 'object' ? member.name : ''}
                  className="h-8 w-8 rounded-full border-2 border-indigo-500 bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg transform hover:scale-110 transition cursor-default"
                >
                  {initial}
                </div>
              );
            })}
            <button
              onClick={() => setShowModal(true)}
              className="h-8 w-8 rounded-full border-2 border-indigo-500 bg-slate-800 flex items-center justify-center text-xs font-bold text-white hover:bg-slate-700 transition shadow-lg"
            >
              {memberCount > 4 ? `+${memberCount - 4}` : memberCount}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          disabled={!board}
          onClick={handleInviteClick}
          className="ml-2 px-6 py-2 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          Invite
        </button>

        {showModal && createPortal(
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users size={20} className="text-indigo-600 dark:text-indigo-400" />
                    Board Members
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage access and share the board</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Members List Section */}
              <div className="mb-8 max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
                {members.map((member: User | string) => {
                  const m = typeof member === 'object' ? member : { name: 'User', email: '...', _id: member as string };
                  return (
                    <div key={m._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                          {m.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="text-slate-900 dark:text-white font-medium text-sm">{m.name}</p>
                          {isOwner && 'email' in m && (
                            <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1">
                              <Mail size={10} />
                              {m.email}
                            </p>
                          )}
                        </div>
                      </div>
                      {board.ownerId === m._id && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                          Owner
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Invite Link Section */}
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Invite Link</label>
                <div className="bg-slate-100 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-xl p-1.5 flex gap-2">
                  <input
                    readOnly
                    value={link || 'Click invite to generate link...'}
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-600 dark:text-slate-300 focus:outline-none"
                  />
                  {link ? (
                    <button
                      onClick={handleCopy}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${copied
                          ? 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20'
                          : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'
                        }`}
                    >
                      {copied ? 'Copied!' : <><Copy size={16} /> Copy</>}
                    </button>
                  ) : (
                    <button
                      onClick={handleInviteClick}
                      className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-500 rounded-lg font-bold text-sm shadow-lg shadow-indigo-600/20 transition-all"
                    >
                      Generate
                    </button>
                  )}
                </div>
                {link && (
                  <div className="flex gap-3">
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition"
                    >
                      <ExternalLink size={16} />
                      Open Link
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </div>
  );
};

export default BoardHeader;