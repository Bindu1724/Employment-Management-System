import { useQuery } from '@tanstack/react-query';
import http from '../api/http';

export default function Dashboard() {
  const { data: depts } = useQuery({ queryKey: ['departments'], queryFn: async () => (await http.get('/departments')).data });
  const { data: employees } = useQuery({ queryKey: ['employees'], queryFn: async () => (await http.get('/employees?limit=5')).data });

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Departments</h5>
              <p className="display-6">{depts?.length || 0}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Employees</h5>
              <p className="display-6">{employees?.total || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}