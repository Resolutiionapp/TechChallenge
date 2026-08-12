import { Injectable } from '@nestjs/common';
import type { WorkspaceSummary } from '@techchallenge/shared-types';
import { WorkspacesRepository } from './workspaces.repository';
import { TasksRepository } from '../tasks/tasks.repository';

@Injectable()
export class WorkspacesService {
  constructor(
    private readonly workspacesRepository: WorkspacesRepository,
    private readonly tasksRepository: TasksRepository,
  ) {}

  async listWithTaskCounts(): Promise<WorkspaceSummary[]> {
    const workspaces = await this.workspacesRepository.findAll();

    return Promise.all(
      workspaces.map(async (workspace) => ({
        id: workspace.id,
        name: workspace.name,
        taskCount: await this.tasksRepository.countByWorkspace(workspace.id),
      })),
    );
  }
}
