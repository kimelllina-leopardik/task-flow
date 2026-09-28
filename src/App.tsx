/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { AuthCard } from './components/Auth/AuthCard';
import { Dashboard } from './components/Dashboard/Dashboard';

function MainContent() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <AuthCard />
        <footer className="mt-8 text-center text-xs text-neutral-400">
          <p>TaskFlow Personal Task Manager &middot; Ready for Supabase connection</p>
        </footer>
      </div>
    );
  }

  return (
    <TaskProvider>
      <Dashboard />
    </TaskProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
