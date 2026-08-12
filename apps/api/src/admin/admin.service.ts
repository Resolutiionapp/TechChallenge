import { Injectable } from '@nestjs/common';
import { WorkspacesRepository } from '../workspaces/workspaces.repository';
import { TasksRepository } from '../tasks/tasks.repository';
import { AdminNotifier } from './admin-notifier';

interface AdminActor {
  userId: string;
  email: string;
}

@Injectable()
export class AdminService {
  private lastActor: AdminActor | null = null;

  constructor(
    private readonly workspacesRepository: WorkspacesRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async listAllWorkspaces(actor: AdminActor) {
    this.lastActor = actor;

    const workspaces = await this.workspacesRepository.findAll();
    const withTaskCounts = await Promise.all(
      workspaces.map(async (workspace) => ({
        ...workspace,
        taskCount: await this.tasksRepository.countByWorkspace(workspace.id),
      })),
    );

    console.log('[admin] workspace list requested', this.lastActor);

    const notifier = new AdminNotifier();
    await notifier.notify(`Workspace list viewed by ${this.lastActor.email}`);

    return withTaskCounts;
  }
}
