import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../api/http';
import { useState } from 'react';

export default function Departments() {
  const qc = useQueryClient();
  const { data } = useQuery(['departments'], async () => (await http.get('/departments')).data);
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  const create = useMutation({
    mutationFn: async () => (await http.post('/departments', form)).data,
    onSuccess: () => { setForm({ name: '', code: '', description: '' }); qc.invalidateQueries(['departments']); }
  });

  return (
    <>
      <h1 className="mb-3">Departments</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Create department</h5>
            <input className="form-control mb-2" placeholder="Name" value={form.name} onChange={e=>setForm(v=>({ ...v, name: e.target.value }))}/>
            <input className="form-control mb-2" placeholder="Code" value={form.code} onChange={e=>setForm(v=>({ ...v, code: e.target.value }))}/>
            <input className="form-control mb-2" placeholder="Description" value={form.description} onChange={e=>setForm(v=>({ ...v, description: e.target.value }))}/>
            <button className="btn btn-success" onClick={() => create.mutate()} disabled={create.isLoading}>
              {create.isLoading ? 'Saving...' : 'Save'}
            </button>
            {create.isError && <div className="alert alert-danger mt-2">Error creating department</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">List</h5>
            <ul className="list-group">
              {data?.map(d => (
                <li key={d._id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>{d.name}</strong> ({d.code})
                    <div className="text-muted">{d.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}