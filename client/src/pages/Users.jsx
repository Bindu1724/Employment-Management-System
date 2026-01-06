import { useQuery } from '@tanstack/react-query';
import http from '../api/http';
import { useAuth } from '../store/auth';

export default function Users() {
  const { user } = useAuth();
  const { data, error } = useQuery(['users'], async () => (await http.get('/users')).data, { enabled: user?.role === 'admin' });

  if (user?.role !== 'admin') return <div className="alert alert-warning">Forbidden: Admins only</div>;
  if (error) return <div className="alert alert-danger">Error loading users</div>;

  return (
    <>
      <h1 className="mb-3">Users</h1>
      <ul className="list-group">
        {data?.map(u => (
          <li key={u._id} className="list-group-item">
            <strong>{u.name}</strong> — {u.role}
            <div className="text-muted">{u.email}</div>
          </li>
        ))}
      </ul>
    </>
  );
}