'use client';

import { useState } from 'react';
import type { CreateTaskDto } from '../../../api/src/tasks/dto/create-task.dto';

interface TaskFormProps {
  workspaceId: string;
  onCreate: (input: Pick<CreateTaskDto, 'workspaceId' | 'title'>) => void;
}

export function TaskForm({ workspaceId, onCreate }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const submit = () => {
    if (!title.trim()) {
      return;
    }
    onCreate({ workspaceId, title });
    setTitle('');
  };

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task title"
        style={{ padding: 8, flex: 1 }}
      />
      <button onClick={submit}>Add task</button>
    </div>
  );
}
