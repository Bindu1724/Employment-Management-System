import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../api/http';
import { useState } from 'react';
import { useAuth } from '../store/auth';

export default function Departments() {
  const qc = useQueryClient();
  const { data, isError: fetchError, error: fetchErrorObj, isLoading: fetchLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => (await http.get('/departments')).data
  });
  const [form, setForm] = useState({ name: '', code: '' });
  const { token, user } = useAuth();

  const create = useMutation({
    mutationFn: async () => (await http.post('/departments', form)).data,
    onSuccess: () => {
      setForm({ name: '', code: '' });
      qc.invalidateQueries({ queryKey: ['departments'] });
    }
  });

  // Helper to render API error messages in UI
  const createErrorMessage = create.error?.response?.data?.message || create.error?.message || null;

  return (
    <>
      <h1 className="mb-3">Departments</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Create department</h5>
            <input className="form-control mb-2" placeholder="Department Name" value={form.name} onChange={e=>setForm(v=>({ ...v, name: e.target.value }))}/>
            <input className="form-control mb-2" placeholder="Code" value={form.code} onChange={e=>setForm(v=>({ ...v, code: e.target.value }))}/>
            <button className="btn btn-success" onClick={() => create.mutate()} disabled={create.isLoading || !token || user?.role !== 'admin'}>
              {create.isLoading ? 'Saving...' : ( !token || user?.role !== 'admin' ? 'Sign in as admin to save' : 'Save')}
            </button>
            {create.isError && <div className="alert alert-danger mt-2">{createErrorMessage || 'Error creating department'}</div>}
            {(!token || user?.role !== 'admin') && <div className="text-muted small mt-2">You must be signed in as an admin to create departments.</div>}
          </div>
        </div>
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">List</h5>
            {fetchLoading && <div className="text-muted">Loading departments...</div>}
            {fetchError && <div className="text-danger small mb-2">{fetchErrorObj?.response?.data?.message || fetchErrorObj?.message || 'Error loading departments. Are you signed in?'}</div>}
            <ul className="list-group">
              {data?.map(d => (
                <li key={d._id} className="list-group-item d-flex justify-content-between">
                  <div>
                    <strong>{d.name}</strong> ({d.code})
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