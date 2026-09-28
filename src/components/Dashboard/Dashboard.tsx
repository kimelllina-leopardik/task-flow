import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../Navigation/Navbar';
import { CreateTaskForm } from './CreateTaskForm';
import { TaskItem } from './TaskItem';
import { Search, CheckCircle2, Clock, ListTodo, Sparkles } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const {
    tasks,
    allUserTasks,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
  } = useTasks();

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Dashboard Title Header & Overview */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              My Tasks
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-1">
              Personal task workspace for <span className="font-semibold text-neutral-700">{user?.email}</span>
            </p>
          </div>

          {/* Quick Metrics (Single-elevation, Tabular figures) */}
          <div className="flex items-center gap-3 self-start sm:self-auto text-xs">
            <div className="bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <ListTodo className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-500 font-medium">Total:</span>
              <span className="font-bold text-neutral-900 tabular-nums">{stats.total}</span>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-500 font-medium">Pending:</span>
              <span className="font-bold text-neutral-900 tabular-nums">{stats.active}</span>
            </div>

            <div className="bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-neutral-500 font-medium">Done:</span>
              <span className="font-bold text-neutral-900 tabular-nums">{stats.completed}</span>
            </div>
          </div>
        </div>

        {/* Task Creation Box */}
        <CreateTaskForm />

        {/* Search & Segmented Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
          {/* Interactive Filter Tabs (Segmented control) */}
          <div className="flex items-center gap-1 p-1 bg-neutral-200/60 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Tasks ({allUserTasks.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'active'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              type="button"
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filter === 'completed'
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in your tasks..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-xl text-neutral-800 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 transition-colors"
            />
          </div>
        </div>

        {/* Task List Container */}
        <div className="space-y-2.5">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskItem key={task.id} task={task} />)
          ) : (
            /* Empty State */
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-8 sm:p-12 text-center my-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                {searchQuery ? (
                  <Search className="w-5 h-5" />
                ) : filter === 'completed' ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
              </div>
              <h2 className="text-sm font-semibold text-neutral-900 mb-1">
                {searchQuery
                  ? 'No matching tasks found'
                  : filter === 'completed'
                  ? 'No completed tasks yet'
                  : filter === 'active'
                  ? 'All tasks completed!'
                  : 'No tasks in your workspace'}
              </h2>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {searchQuery
                  ? `No task matches "${searchQuery}". Clear your search query to see all tasks.`
                  : filter === 'completed'
                  ? 'Finish any active task to see it listed in your completed archive.'
                  : 'Create your first task above to start organizing your day.'}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
