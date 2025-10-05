import React, { useState, useEffect, createContext, useContext } from 'react';

const API_BASE = 'http://localhost:3000/api';

const UserContext = createContext<any>(null);

let renderCount = 0;

export const UserAdminPanel: React.FC = () => {
  renderCount++;

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [filter, setFilter] = useState('');
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [showForm, setShowForm] = useState(false);

  console.log('UserAdminPanel render #', renderCount);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem('lastFilter', filter);
  }, [filter]);

  useEffect(() => {
    const saved = localStorage.getItem('cachedUsers');
    if (saved) {
      try {
        setUsers(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/users`);
      const data = await res.json();
      setUsers(data.data || []);
      localStorage.setItem('cachedUsers', JSON.stringify(data.data || []));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${API_BASE}/users/delete/${id}`);
      loadUsers();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  const startEdit = (user: any) => {
    setEditingId(user.id);
    setEditForm({ ...user });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(`${API_BASE}/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!res.ok) throw new Error('Update failed');

      cancelEdit();
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEditChange = async (field: string, value: any) => {
    const updated = { ...editForm, [field]: value };
    setEditForm(updated);

    // Auto-save on every keystroke
    try {
      await fetch(`${API_BASE}/users/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch (err) {
      console.error('Auto-save failed', err);
    }
  };

  const createUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error('Create failed');

      setNewUser({ name: '', email: '', role: 'user' });
      setShowForm(false);
      loadUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = users.filter((u: any) =>
    u.name?.toLowerCase().includes(filter.toLowerCase()) ||
    u.email?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <UserContext.Provider value={{ users, setUsers }}>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ marginBottom: '10px', color: '#666', fontSize: '12px' }}>
          Render count: {renderCount}
        </div>

        <h1 style={{ color: '#333' }}>User Admin Panel</h1>

        {loading && <div style={{ color: 'blue' }}>Loading...</div>}
        {error && <div style={{ color: 'red' }}>Error: {error}</div>}

        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Filter users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px', width: '300px', marginRight: '10px' }}
          />

          <div
            onClick={() => setShowForm(!showForm)}
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {showForm ? 'Cancel' : 'Add User'}
          </div>
        </div>

        {showForm && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5' }}>
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              style={{ padding: '8px', marginRight: '10px' }}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              style={{ padding: '8px', marginRight: '10px' }}
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              style={{ padding: '8px', marginRight: '10px' }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div
              onClick={createUser}
              style={{
                display: 'inline-block',
                padding: '8px 16px',
                background: '#28a745',
                color: 'white',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
            >
              Create
            </div>
          </div>
        )}

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#e9ecef' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user: any, index: number) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '10px' }}>{user.id}</td>
                <td style={{ padding: '10px' }}>
                  {editingId === user.id ? (
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      style={{ padding: '4px', width: '100%' }}
                    />
                  ) : (
                    user.name
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  {editingId === user.id ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => handleEditChange('email', e.target.value)}
                      style={{ padding: '4px', width: '100%' }}
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  {editingId === user.id ? (
                    <select
                      value={editForm.role}
                      onChange={(e) => handleEditChange('role', e.target.value)}
                      style={{ padding: '4px' }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  {editingId === user.id ? (
                    <>
                      <div
                        onClick={saveEdit}
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: '#28a745',
                          color: 'white',
                          cursor: 'pointer',
                          marginRight: '5px',
                          fontSize: '12px',
                        }}
                      >
                        Save
                      </div>
                      <div
                        onClick={cancelEdit}
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: '#6c757d',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Cancel
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        onClick={() => startEdit(user)}
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: '#ffc107',
                          color: 'black',
                          cursor: 'pointer',
                          marginRight: '5px',
                          fontSize: '12px',
                        }}
                      >
                        Edit
                      </div>
                      <div
                        onClick={() => handleDelete(user.id)}
                        style={{
                          display: 'inline-block',
                          padding: '4px 8px',
                          background: '#dc3545',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Delete
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && !loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No users found
          </div>
        )}
      </div>
    </UserContext.Provider>
  );
};
