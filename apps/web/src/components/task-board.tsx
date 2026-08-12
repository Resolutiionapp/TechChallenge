'use client';

import { useTasks } from '../hooks/use-tasks';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { apiClient } from '../lib/api-client';

interface TaskBoardProps {
  workspaceId: string;
}

export function TaskBoard({ workspaceId }: TaskBoardProps) {
  const { tasks, loading, error, deleteTask, refetch } = useTasks(workspaceId);

  const createTask = async (input: { workspaceId: string; title: string }) => {
    await apiClient.post('/tasks', input);
    await refetch();
  };

  if (loading) {
    return <div>Loading tasks…</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <TaskForm workspaceId={workspaceId} onCreate={createTask} />
      {tasks.map((task, index) => (
        <div key={index}>
          <TaskCard task={task} onDelete={deleteTask} />
        </div>
      ))}
    </div>
  );
}
