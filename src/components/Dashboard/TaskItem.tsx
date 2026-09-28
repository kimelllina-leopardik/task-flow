import { useState } from 'react';
import { Task } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { Check, Trash2, Calendar, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTaskCompleted, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      deleteTask(task.id);
    }, 150);
  };

  const priorityLabel = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }[task.priority || 'medium'];

  const priorityColor = {
    high: 'text-amber-700 bg-amber-50/70 border-amber-200/60',
    medium: 'text-neutral-600 bg-neutral-100/70 border-neutral-200/60',
    low: 'text-slate-600 bg-slate-50 border-slate-200/60',
  }[task.priority || 'medium'];

  return (
    <div
      className={`group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all duration-150 ${
        task.completed
          ? 'bg-neutral-50/70 border-neutral-200/70 text-neutral-400'
          : 'bg-white border-neutral-200/90 hover:border-neutral-300 hover:shadow-xs text-neutral-800'
      } ${isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* Checkbox button */}
      <button
        type="button"
        onClick={() => toggleTaskCompleted(task.id)}
        aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        className={`mt-0.5 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
          task.completed
            ? 'bg-emerald-600 border-emerald-600 text-white'
            : 'border-neutral-300 hover:border-neutral-500 bg-white'
        }`}
      >
        {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
      </button>

      {/* Task Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p
            onClick={() => toggleTaskCompleted(task.id)}
            className={`text-sm font-medium leading-snug cursor-pointer select-none transition-colors ${
              task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'
            }`}
          >
            {task.title}
          </p>
        </div>

        {task.description && (
          <p
            className={`text-xs mt-1 leading-relaxed ${
              task.completed ? 'text-neutral-400 line-through' : 'text-neutral-500'
            }`}
          >
            {task.description}
          </p>
        )}

        {/* Task Metadata (clean unboxed text with subtle separators as per Zero-Pill rule) */}
        <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-500 font-normal">
          {task.priority && task.priority !== 'medium' && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${priorityColor}`}>
              {priorityLabel}
            </span>
          )}

          {task.dueDate && (
            <span className="inline-flex items-center gap-1 text-neutral-500">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>Due {task.dueDate}</span>
            </span>
          )}

          {task.dueDate && <span aria-hidden="true" className="text-neutral-300">·</span>}

          <span className="text-neutral-400 tabular-nums">
            Added {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Delete Action Button */}
      <button
        type="button"
        onClick={handleDelete}
        title="Delete task"
        aria-label="Delete task"
        className="shrink-0 p-2 text-neutral-400 hover:text-rose-600 hover:bg-rose-50/80 rounded-lg transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
