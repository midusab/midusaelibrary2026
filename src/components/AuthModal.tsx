import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  Lock, 
  Mail, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [method, setMethod] = useState<'mpesa' | 'google' | 'email'>('mpesa');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleMpesaQuickLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    const dummyUser: UserProfile = {
      id: `user-${phone.replace(/\D/g, '') || Date.now()}`,
      name: name || `Reader (${phone})`,
      email: email || `${phone.replace(/\D/g, '')}@midusa.reader`,
      phone: phone,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      provider: 'mpesa',
    };

    onLoginSuccess(dummyUser);
    onClose();
  };

  const handleGoogleLogin = () => {
    const dummyUser: UserProfile = {
      id: `google-${Date.now()}`,
      name: 'Brian Ochieng',
      email: 'bochieng228@gmail.com',
      phone: '0712345678',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      provider: 'google',
    };
    onLoginSuccess(dummyUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-50/80 backdrop-blur-md animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-slate-50 border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-10 text-slate-800 animate-slideDown">
        
        {/* Header */}
        <div className="p-6 sm:p-8 text-center border-b border-slate-200 relative bg-linear-to-b from-slate-900 to-slate-950">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-dodgerblue/20 text-dodgerblue mx-auto flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="font-heading font-extrabold text-2xl text-slate-900">
            {authMode === 'login' ? 'Welcome Back' : 'Create Reader Account'}
          </h3>
          <p className="text-xs text-slate-500 font-body mt-1">
            Access your purchased eBooks, download tokens, and reading notes on any device.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 p-2 gap-2 bg-slate-50">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'login' ? 'bg-dodgerblue text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              authMode === 'register' ? 'bg-dodgerblue text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Quick Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300/80 text-slate-900 font-semibold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Or via Phone / M-Pesa</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* M-Pesa Phone / Email Form */}
          <form onSubmit={handleMpesaQuickLogin} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mwangi"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:border-dodgerblue"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">M-Pesa Phone Number</label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:border-dodgerblue"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm placeholder-slate-500 focus:outline-hidden focus:border-dodgerblue"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-dodgerblue hover:bg-dodgerblue text-white font-bold text-xs sm:text-sm shadow-md shadow-dodgerblue/20 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
            >
              <span>{authMode === 'login' ? 'Sign In Instantly' : 'Create My Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-dodgerblue" />
            <span>Secure encryption • Instant library sync</span>
          </div>

        </div>

      </div>
    </div>
  );
};
