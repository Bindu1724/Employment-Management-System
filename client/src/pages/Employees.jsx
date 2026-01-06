import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../api/http';
import { useState } from 'react';

export default function Employees() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { data: depts } = useQuery({ queryKey: ['departments'], queryFn: async () => (await http.get('/departments')).data });
  const { data } = useQuery({ queryKey: ['employees', page, q], queryFn: async () => (await http.get(`/employees?page=${page}&q=${q}`)).data });

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', roleTitle: '',
    department: '', status: 'active', salary: 0
  });

  const create = useMutation({
    mutationFn: async () => (await http.post('/employees', form)).data,
    onSuccess: () => { setForm({ firstName:'', lastName:'', email:'', roleTitle:'', department:'', status:'active', salary:0 }); qc.invalidateQueries(['employees']); }
  });

  return (
    <>
      <h1 className="mb-3">Employees</h1>
      <div className="d-flex gap-2 mb-3">
        <input className="form-control w-auto" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn btn-outline-secondary" onClick={()=>setPage(1)}>Search</button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Create employee</h5>
            <div className="row g-2">
              <div className="col-6"><input className="form-control" placeholder="First name" value={form.firstName} onChange={e=>setForm(v=>({ ...v, firstName: e.target.value }))}/></div>
              <div className="col-6"><input className="form-control" placeholder="Last name" value={form.lastName} onChange={e=>setForm(v=>({ ...v, lastName: e.target.value }))}/></div>
              <div className="col-12"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm(v=>({ ...v, email: e.target.value }))}/></div>
              <div className="col-12"><input className="form-control" placeholder="Role title" value={form.roleTitle} onChange={e=>setForm(v=>({ ...v, roleTitle: e.target.value }))}/></div>
              <div className="col-12">
                <select className="form-select" value={form.department} onChange={e=>setForm(v=>({ ...v, department: e.target.value }))}>
                  <option value="">Select department</option>
                  {depts?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div className="col-6">
                <select className="form-select" value={form.status} onChange={e=>setForm(v=>({ ...v, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="on_leave">On leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div className="col-6"><input className="form-control" type="number" placeholder="Salary" value={form.salary} onChange={e=>setForm(v=>({ ...v, salary: Number(e.target.value) }))}/></div>
            </div>
            <button className="btn btn-success mt-3" onClick={() => create.mutate()} disabled={create.isLoading}>
              {create.isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">List</h5>
            <ul className="list-group">
              {data?.items?.map(e => (
                <li key={e._id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{e.firstName} {e.lastName}</strong> — {e.roleTitle}
                    <div className="text-muted">{e.email} | {e.department?.name} | {e.status}</div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="d-flex align-items-center gap-2 mt-3">
              <button className="btn btn-outline-secondary" onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={page===1}>Prev</button>
              <span>Page {data?.page || 1} / {data?.pages || 1}</span>
              <button className="btn btn-outline-secondary" onClick={()=>setPage(p=>Math.min(data?.pages || 1, p+1))} disabled={(data?.page || 1) >= (data?.pages || 1)}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}