import { useState } from 'react';
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const ok = await login(email, password);
    if (ok) navigate('/Dashboard');
  };

  return (
    <div className="container d-flex vh-100 justify-content-center align-items-center">
      <form className="card p-4 shadow w-100" style={{ maxWidth: '420px' }} onSubmit={submit}>
        <h2 className="mb-3 text-center">Sign In</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}