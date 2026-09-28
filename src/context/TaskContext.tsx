import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { Task, TaskPriority, TaskFilter, TaskSort } from '../types';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  allUserTasks: Task[];
  createTask: (title: string, options?: { description?: string; priority?: TaskPriority; dueDate?: string }) => void;
  toggleTaskCompleted: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: TaskSort;
  setSortBy: (sort: TaskSort) => void;
  stats: {
    total: number;
    completed: number;
    active: number;
    completionRate: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Initial in-memory task database partitioned strictly by userId
const INITIAL_TASKS: Task[] = [
  // Alex's tasks
  {
    id: 'task-alex-1',
    userId: 'user-alex-101',
    title: 'Review team weekly sprint deliverables',
    description: 'Check pull requests and verify staging deployment stability',
    completed: false,
    priority: 'high',
    dueDate: '2026-10-02',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'task-alex-2',
    userId: 'user-alex-101',
    title: 'Prepare product architecture slides',
    description: 'Draft the data model overview and API contract diagrams',
    completed: true,
    priority: 'medium',
    dueDate: '2026-09-30',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'task-alex-3',
    userId: 'user-alex-101',
    title: 'Finalize design review feedback',
    description: 'Ensure compliance with WCAG contrast and mobile tap target sizes',
    completed: false,
    priority: 'low',
    dueDate: '2026-10-05',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  // Sarah's tasks (isolated from Alex)
  {
    id: 'task-sarah-1',
    userId: 'user-sarah-102',
    title: 'Set up Supabase database migration scripts',
    description: 'Configure auth schema and row-level security policies',
    completed: false,
    priority: 'high',
    dueDate: '2026-10-01',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'task-sarah-2',
    userId: 'user-sarah-102',
    title: 'Update onboarding documentation for clients',
    description: 'Add quick-start walkthrough and FAQ section',
    completed: true,
    priority: 'medium',
    dueDate: '2026-09-29',
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
  },
];

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // In-memory state only - no localStorage, ready for Supabase client
  const [taskStore, setTaskStore] = useState<Task[]>(INITIAL_TASKS);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<TaskSort>('newest');

  // Filter tasks strictly by current user's ID
  const userTasks = useMemo(() => {
    if (!user) return [];
    return taskStore.filter((task) => task.userId === user.id);
  }, [taskStore, user]);

  const createTask = (
    title: string,
    options?: { description?: string; priority?: TaskPriority; dueDate?: string }
  ) => {
    if (!user || !title.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user.id,
      title: title.trim(),
      description: options?.description?.trim() || undefined,
      completed: false,
      priority: options?.priority || 'medium',
      dueDate: options?.dueDate || undefined,
      createdAt: new Date().toISOString(),
    };

    setTaskStore((prev) => [newTask, ...prev]);
  };

  const toggleTaskCompleted = (taskId: string) => {
    if (!user) return;
    setTaskStore((prev) =>
      prev.map((task) => {
        // Enforce user ownership
        if (task.id === taskId && task.userId === user.id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId: string) => {
    if (!user) return;
    setTaskStore((prev) =>
      prev.filter((task) => !(task.id === taskId && task.userId === user.id))
    );
  };

  // Filtered & searched view
  const filteredTasks = useMemo(() => {
    let result = [...userTasks];

    // Filter by completion status
    if (filter === 'active') {
      result = result.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      result = result.filter((t) => t.completed);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [userTasks, filter, searchQuery, sortBy]);

  // Statistics calculation for the user
  const stats = useMemo(() => {
    const total = userTasks.length;
    const completed = userTasks.filter((t) => t.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, completionRate };
  }, [userTasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks: filteredTasks,
        allUserTasks: userTasks,
        createTask,
        toggleTaskCompleted,
        deleteTask,
        filter,
        setFilter,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        stats,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
