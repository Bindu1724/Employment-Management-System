import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../api/http';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters long');
      return;
    }

    setLoading(true);
    try {
      await http.post('/auth/register', { name, email, password, role });
      setSuccess('Registration successful — redirecting to sign in...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex vh-100 justify-content-center align-items-center">
      <form className="card p-4 shadow w-100" style={{ maxWidth: '520px' }} onSubmit={submit}>
        <h2 className="mb-3 text-center">Create an account</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input className="form-control" value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>

        <div className="row">
          <div className="mb-3 col-md-6 pe-md-2">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-3 col-md-6 ps-md-2">
            <label className="form-label">Confirm Password</label>
            <input type="password" className="form-control" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing up...' : 'Register'}
        </button>

        <div className="text-center mt-3">
          <small>
            Already have an account? <Link to="/login">Sign in</Link>
          </small>
        </div>
      </form>
    </div>
  );
}