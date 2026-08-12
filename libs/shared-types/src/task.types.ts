export type TaskStatus = 'todo' | 'in_progress' | 'done';

/**
 * Tasks are append-only once they reach 'done' — completed work is not
 * expected to move backwards in the workflow, and 'done' tasks should
 * only be reopened through a separate, explicit "reopen" action rather
 * than a plain status edit.
 */
export interface Task {
  id: string;
  workspaceId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string | null;
  updatedAt: string;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  taskCount: number;
}

export interface CurrentUserPayload {
  userId: string;
  workspaceIds: string[];
}
