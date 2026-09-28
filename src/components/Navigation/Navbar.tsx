import { useAuth } from '../../context/AuthContext';
import { CheckSquare, LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with icon */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
            <CheckSquare className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-base font-bold tracking-tight text-neutral-900">
            TaskFlow
          </span>
        </div>

        {/* Zone 2: Clean breadcrumb / location */}
        <div className="hidden md:flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <span>Workspace</span>
          <span aria-hidden="true" className="text-neutral-300">/</span>
          <span className="text-neutral-900 font-semibold">My Tasks</span>
        </div>

        {/* Zone 3: User indicator and Logout action */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-600 bg-neutral-100/80 px-2.5 py-1.5 rounded-lg border border-neutral-200/60 max-w-[220px]">
              <UserIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="truncate font-medium">{user.email}</span>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            title="Log out of session"
            className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
