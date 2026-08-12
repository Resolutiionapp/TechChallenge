'use client';

import { useEffect, useState } from 'react';
import { setSessionToken } from '../../lib/session';
import { apiClient } from '../../lib/api-client';

interface AdminWorkspaceSummary {
  id: string;
  name: string;
  taskCount: number;
}

export default function AdminPage() {
  const [workspaces, setWorkspaces] = useState<AdminWorkspaceSummary[]>([]);

  useEffect(() => {
    setSessionToken('admin-session-demo-token');
    apiClient.get<AdminWorkspaceSummary[]>('/admin/workspaces').then(setWorkspaces);
  }, []);

  return (
    <main>
      <h1>Admin: All Workspaces</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: 8 }}>Workspace</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Tasks</th>
          </tr>
        </thead>
        <tbody>
          {workspaces.map((workspace) => (
            <tr key={workspace.id}>
              <td style={{ padding: 8 }}>{workspace.name}</td>
              <td style={{ padding: 8 }}>{workspace.taskCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
