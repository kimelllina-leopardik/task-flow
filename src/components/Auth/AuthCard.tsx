import { useState, FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Lock, Mail, Eye, EyeOff, ArrowRight, UserPlus, LogIn, AlertCircle } from 'lucide-react';

export function AuthCard() {
  const { login, register, isLoading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }

    if (mode === 'register') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      const res = await register(email, password);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    } else {
      const res = await login(email, password);
      if (!res.success && res.error) {
        setErrorMessage(res.error);
      }
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setConfirmPassword('password123');
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-neutral-900 text-white mb-4 shadow-sm">
          <CheckSquare className="w-6 h-6 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          TaskFlow
        </h1>
        <p className="text-sm text-neutral-500 mt-1">
          {mode === 'login' ? 'Sign in to access your personal tasks' : 'Create an account to manage your tasks'}
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl shadow-sm p-6 sm:p-8">
        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl mb-6 text-sm font-medium">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage(null);
            }}
            className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Form Error Notice */}
        {errorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-950 text-white rounded-xl text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : mode === 'login' ? (
              <>
                <span>Sign In to Tasks</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>Create My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Testing Helper */}
        <div className="mt-8 pt-6 border-t border-neutral-100">
          <div className="text-xs font-medium text-neutral-500 mb-3 flex items-center justify-between">
            <span>Quick Test Accounts</span>
            <span className="text-[11px] text-neutral-400 font-normal">Isolated data per user</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('alex@example.com')}
              className="p-2.5 text-left rounded-lg border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 hover:border-neutral-300 transition-colors cursor-pointer"
            >
              <div className="font-semibold text-neutral-800">Alex's Account</div>
              <div className="text-neutral-400 truncate text-[11px]">alex@example.com</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('sarah@example.com')}
              className="p-2.5 text-left rounded-lg border border-neutral-200 bg-neutral-50/60 hover:bg-neutral-100 hover:border-neutral-300 transition-colors cursor-pointer"
            >
              <div className="font-semibold text-neutral-800">Sarah's Account</div>
              <div className="text-neutral-400 truncate text-[11px]">sarah@example.com</div>
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 mt-2.5 text-center">
            Or create a brand new account with any email & password.
          </p>
        </div>
      </div>
    </div>
  );
}
