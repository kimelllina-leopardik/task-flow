import { useState, FormEvent } from 'react';
import { useTasks } from '../../context/TaskContext';
import { Plus, Calendar, Flag, ChevronDown, ChevronUp } from 'lucide-react';
import { TaskPriority } from '../../types';

export function CreateTaskForm() {
  const { createTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createTask(title, {
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setShowDetails(false);
  };

  return (
    <div className="bg-white border border-neutral-200/90 rounded-2xl shadow-xs p-4 sm:p-5 mb-6 transition-all">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task... (press Enter to save)"
            className="flex-1 bg-transparent text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden py-1.5"
          />

          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="hidden sm:inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-800 px-2 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <span>Options</span>
            {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            type="submit"
            disabled={!title.trim()}
            className="py-2 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Detailed Options Drawer */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-neutral-100 space-y-3">
            <div>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add optional notes or description..."
                className="w-full text-xs text-neutral-800 placeholder:text-neutral-400 bg-neutral-50/60 border border-neutral-200 rounded-lg p-2.5 focus:outline-hidden focus:border-neutral-800 transition-colors"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Flag className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-500 text-[11px] font-medium">Priority:</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  aria-label="Task priority"
                  className="bg-neutral-50 border border-neutral-200 rounded-md py-1 px-2 text-xs text-neutral-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-neutral-500 text-[11px] font-medium">Due Date:</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  aria-label="Task due date"
                  className="bg-neutral-50 border border-neutral-200 rounded-md py-0.5 px-2 text-xs text-neutral-800 focus:outline-hidden cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
