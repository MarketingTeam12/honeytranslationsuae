import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      const redirectTo = location.state?.from || '/admin';
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-[#f8f9ff] via-white to-[#edf2ff] px-6 py-16">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-10 shadow-2xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#151249] mb-2">Admin Login</h1>
          <p className="text-gray-600">Sign in to manage blogs and content</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#151249] mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#151249] mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#151249] font-bold hover:shadow-lg transition-all disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
