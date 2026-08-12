import { Injectable } from '@nestjs/common';
import type { Task } from '@techchallenge/shared-types';

let TASKS: Task[] = [
  {
    id: 'task-1',
    workspaceId: 'ws-1',
    title: 'Design onboarding flow',
    description: '',
    status: 'todo',
    assignee: null,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    workspaceId: 'ws-1',
    title: 'Fix checkout bug',
    description: '',
    status: 'in_progress',
    assignee: 'alice',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    workspaceId: 'ws-2',
    title: 'Rotate deploy keys',
    description: '',
    status: 'todo',
    assignee: null,
    updatedAt: new Date().toISOString(),
  },
];

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 15));
}

@Injectable()
export class TasksRepository {
  async findAll(
    workspaceId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: Task[]; total: number }> {
    await simulateLatency();
    const inWorkspace = TASKS.filter((task) => task.workspaceId === workspaceId);
    const start = page * pageSize;

    return {
      items: inWorkspace.slice(start, start + pageSize),
      total: inWorkspace.length,
    };
  }

  async findById(id: string): Promise<Task | undefined> {
    await simulateLatency();
    return TASKS.find((task) => task.id === id);
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    await simulateLatency();
    return TASKS.filter((task) => task.workspaceId === workspaceId).length;
  }

  async create(task: Task): Promise<Task> {
    await simulateLatency();
    TASKS.push(task);
    return task;
  }

  async update(id: string, patch: Partial<Task>): Promise<Task | undefined> {
    const existing = await this.findById(id);
    if (!existing) {
      return undefined;
    }

    await simulateLatency();

    const updated: Task = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    TASKS = TASKS.map((task) => (task.id === id ? updated : task));
    return updated;
  }

  async remove(id: string): Promise<void> {
    await simulateLatency();
    TASKS = TASKS.filter((task) => task.id !== id);
  }
}
