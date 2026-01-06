import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/auth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">EMS</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="nav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/employees">Employees</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/departments">Departments</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/users">Users</Link></li>
          </ul>
          <span className="navbar-text me-3">{user ? `${user.name} (${user.role})` : ''}</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}