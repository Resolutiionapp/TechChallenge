'use client';

import { useEffect, useState } from 'react';
import type { Task } from '@techchallenge/shared-types';
import { apiClient } from '../lib/api-client';

const POLL_INTERVAL_MS = 10000;

export function useTasks(workspaceId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ items: Task[] }>(
        `/tasks?workspaceId=${workspaceId}&page=1&pageSize=50`,
      );
      setTasks(res.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadTasks();
    }, POLL_INTERVAL_MS);
  }, [workspaceId]);

  const updateTask = async (id: string, patch: Partial<Task>) => {
    await apiClient.patch(`/tasks/${id}`, patch);
    await loadTasks();
  };

  const deleteTask = async (id: string) => {
    await apiClient.delete(`/tasks/${id}`);
    await loadTasks();
  };

  return { tasks, loading, error, refetch: loadTasks, updateTask, deleteTask };
}
