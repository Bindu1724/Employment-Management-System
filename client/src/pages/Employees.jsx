import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../api/http';
import { useState, useEffect } from 'react';
import { useAuth } from '../store/auth';

export default function Employees() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const { user, token } = useAuth();
  const isEmployee = user?.role === 'employee';

  // when employee is signed in, fetch only their record (search by email)
  const pageToUse = isEmployee ? 1 : page;
  const qToUse = isEmployee ? (user?.email || '') : q;

  const { data: depts, isLoading: deptsLoading, isError: deptsError, error: deptsFetchError } = useQuery({ queryKey: ['departments'], queryFn: async () => (await http.get('/departments')).data });
  const { data, isLoading: employeesLoading } = useQuery({ queryKey: ['employees', pageToUse, qToUse], queryFn: async () => (await http.get(`/employees?page=${pageToUse}&limit=5&q=${encodeURIComponent(qToUse)}`)).data, keepPreviousData: true });

  const initialForm = { firstName: '', lastName: '', email: '', roleTitle: '', phone: '', department: '', status: 'active', salary: 0 };
  const [form, setForm] = useState(initialForm);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  // human-friendly salary input (formatted display while keeping numeric value in form.salary)
  const [salaryDisplay, setSalaryDisplay] = useState('');

  const [editingId, setEditingId] = useState(null);

  const create = useMutation({
    mutationFn: async (payload) => (await http.post('/employees', payload)).data,
    onSuccess: () => {
      setForm(initialForm);
      setSalaryDisplay('');
      setFormError(null);
      setSuccessMessage('Employee created successfully');
      setTimeout(()=>setSuccessMessage(null), 3000);
      qc.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => (await http.put(`/employees/${id}`, payload)).data,
    onSuccess: () => {
      setEditingId(null);
      setForm(initialForm);
      setSalaryDisplay('');
      setFormError(null);
      setSuccessMessage('Employee updated successfully');
      setTimeout(()=>setSuccessMessage(null), 3000);
      qc.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const remove = useMutation({
    mutationFn: async (id) => (await http.delete(`/employees/${id}`)),
    onSuccess: (_, id) => {
      // if we were editing the deleted employee, reset the form
      if (editingId === id) {
        setEditingId(null);
        setForm(initialForm);
        setSalaryDisplay('');
      }
      setSuccessMessage('Employee deleted successfully');
      setTimeout(()=>setSuccessMessage(null), 3000);
      qc.invalidateQueries({ queryKey: ['employees'] });
    }
  });

  const handleSave = () => {
    setSuccessMessage(null);
    setFormError(null);
    if (!form.firstName || !form.lastName || !form.email || !form.roleTitle || !form.department) {
      setFormError('Please fill all required fields (including department).');
      return;
    }
    if (editingId) {
      update.mutate({ id: editingId, payload: form });
    } else {
      create.mutate(form);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      roleTitle: emp.roleTitle || '',
      department: emp.department?._id || emp.department || '',
      status: emp.status || 'active',
      salary: emp.salary || 0
    });
    setSalaryDisplay(emp.salary ? new Intl.NumberFormat().format(emp.salary) : '');
    setFormError(null);
  }; 

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
    setSalaryDisplay('');
    setFormError(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    setSuccessMessage(null);
    remove.mutate(id);
  };

  // if total pages decreased (e.g., after delete), make sure current page is within bounds
  useEffect(() => {
    if (!isEmployee && data?.pages && page > data.pages) {
      setPage(data.pages);
    }
  }, [data?.pages, isEmployee, page]); 

  return (
    <>
      <h1 className="mb-3">Employee Details</h1>
      {!isEmployee && (
        <div className="d-flex gap-2 mb-3">
          <input className="form-control w-auto" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn btn-outline-secondary" onClick={()=>setPage(1)}>Search</button>
        </div>
      )}

      <div className="row g-4">
      {!isEmployee && (
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">Create employee</h5>
            <div className="row g-2">
              <div className="col-6"><input className="form-control" placeholder="First name" value={form.firstName} onChange={e=>setForm(v=>({ ...v, firstName: e.target.value }))}/></div>
              <div className="col-6"><input className="form-control" placeholder="Last name" value={form.lastName} onChange={e=>setForm(v=>({ ...v, lastName: e.target.value }))}/></div>
              <div className="col-12"><input className="form-control" placeholder="Email" value={form.email} onChange={e=>setForm(v=>({ ...v, email: e.target.value }))}/></div>
              <div className="col-12"><input className="form-control" placeholder="Phone" value={form.phone} onChange={e=>setForm(v=>({ ...v, phone: e.target.value }))}/></div>
              <div className="col-12"><input className="form-control" placeholder="Role title" value={form.roleTitle} onChange={e=>setForm(v=>({ ...v, roleTitle: e.target.value }))}/></div>
              <div className="col-12">
                <select className="form-select" value={form.department} onChange={e=>setForm(v=>({ ...v, department: e.target.value }))} enabled={deptsLoading || deptsError}>
                  {deptsLoading && <option>Loading departments...</option>}
                  {deptsError && <option>Unable to load departments</option>}
                  {!deptsLoading && !deptsError && <>
                    <option value="">Select department</option>
                    {depts?.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                  </>}
                </select>
                {deptsError && <div className="text-danger small mt-1">{deptsFetchError?.response?.data?.message || deptsFetchError?.message || 'Error loading departments. Are you logged in?'}</div>}
              </div>
              <div className="col-6">
                <select className="form-select" value={form.status} onChange={e=>setForm(v=>({ ...v, status: e.target.value }))}>
                  <option value="active">Active</option>
                  <option value="on_leave">On leave</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
              <div className="col-6">
                <input
                  className="form-control"
                  type="text"
                  inputMode="numeric"
                  placeholder="Salary"
                  value={salaryDisplay}
                  onChange={e=>{
                    const raw = e.target.value;
                    setSalaryDisplay(raw);
                    const cleaned = raw.replace(/[^0-9.]/g, '');
                    setForm(v=>({ ...v, salary: cleaned === '' ? 0 : Number(cleaned) }));
                  }}
                  onBlur={()=>{
                    if (form.salary) setSalaryDisplay(new Intl.NumberFormat().format(form.salary));
                    else setSalaryDisplay('');
                  }}
                  onFocus={()=>{
                    setSalaryDisplay(form.salary ? String(form.salary) : '');
                  }}
                />
              </div>
            </div>
            <div className="d-flex align-items-center mt-3">
              <button className="btn btn-success" onClick={handleSave} disabled={(create.isLoading || update.isLoading) || !token || (user?.role !== 'admin' && user?.role !== 'manager')}>
                {(create.isLoading || update.isLoading) ? 'Saving...' : ( !token || (user?.role !== 'admin' && user?.role !== 'manager') ? 'Sign in as admin/manager' : (editingId ? 'Update' : 'Save'))}
              </button>
              {editingId && <button className="btn btn-outline-secondary ms-2" onClick={handleCancelEdit} disabled={create.isLoading || update.isLoading}>Cancel</button>}
            </div>
            {(create.isError || update.isError || formError) && <div className="alert alert-danger mt-2">{formError || create.error?.response?.data?.message || update.error?.response?.data?.message || create.error?.message || update.error?.message || 'Error saving employee'}</div> }
            {remove.isError && <div className="alert alert-danger mt-2">{remove.error?.response?.data?.message || remove.error?.message || 'Error deleting employee'}</div> }
            {successMessage && <div className="alert alert-success mt-2">{successMessage}</div> }
          </div>
        </div>
      )}

        <div className={isEmployee ? "col-md-12" : "col-md-6"}>
          <div className="card p-3 shadow-sm">
            <h5 className="mb-3">{isEmployee ? 'Your details' : 'List'}</h5>

            {isEmployee && data?.items?.length === 0 && <div className="text-muted">No profile found for your account.</div>}

            {/* show when a user searched for something and there are no matches */}
            {!isEmployee && q?.trim() && !employeesLoading && data?.items?.length === 0 && (
              <div className="alert alert-warning">No employees found for "{q.trim()}".</div>
            )}

            <ul className="list-group">
              {data?.items?.map(e => (
                isEmployee ? (
                  <li key={e._id} className="list-group-item">
                    <div>
                      <strong>{e.firstName} {e.lastName}</strong> — {e.roleTitle}
                    </div>
                    <div className="mt-2">Email: <span className="text-muted ms-1">{e.email}</span></div>
                    <div>Phone: <span className="text-muted ms-1">{e.phone || '-'}</span></div>
                    <div>Status: <span className="text-muted ms-1">{e.status}</span></div>
                    <div>Department: <span className="text-muted ms-1">{e.department?.name || '-'}</span></div>
                  </li>
                ) : (
                  <li key={e._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{e.firstName} {e.lastName}</strong> — {e.roleTitle}
                      <div className="text-muted">{e.email} {e.phone && `| ${e.phone}`} | {e.department?.name} | {e.status}</div>
                    </div>
                    <div>
                      {(user?.role === 'admin' || user?.role === 'manager') && <button className="btn btn-sm btn-primary me-2" onClick={()=>handleEdit(e)}>Edit</button>}
                      {user?.role === 'admin' && <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(e._id)} disabled={remove.isLoading}>Delete</button>}
                    </div>
                  </li>
                )
              ))}
            </ul>

            {!isEmployee && (
              <div className="d-flex align-items-center gap-2 mt-3">
                <button className="btn btn-outline-secondary" onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={page===1}>Prev</button>
                <span>Page {data?.page || 1} / {data?.pages || 1}</span>
                <button className="btn btn-outline-secondary" onClick={()=>setPage(p=>Math.min(data?.pages || 1, p+1))} disabled={(data?.page || 1) >= (data?.pages || 1)}>Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}