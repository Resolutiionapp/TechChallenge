'use client';

import type { Task } from '@techchallenge/shared-types';
import { useCurrentUser } from '../hooks/use-current-user';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const currentUser = useCurrentUser();

  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 12, marginBottom: 8 }}>
      <div style={{ fontWeight: 600 }}>{task.title}</div>
      <div style={{ color: '#666', fontSize: 13 }}>{task.status}</div>
      {currentUser.role === 'admin' && (
        <button onClick={() => onDelete(task.id)} style={{ marginTop: 8 }}>
          Delete
        </button>
      )}
    </div>
  );
}
