import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

export default function LocaliAdminLogin() {
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/localiadmin');
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">Locali Admin Login</h2>
        <form onSubmit={submit}>
          <label className="block mb-2">Username</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" />
          <label className="block mb-2">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          <button disabled={loading} className="w-full py-2 px-4 bg-teal-600 text-white rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="text-xs text-slate-500 mt-3">Temporary fallback credentials: admin / admin</div>
      </div>
    </div>
  );
}
