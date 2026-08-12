import { Injectable, NotFoundException } from '@nestjs/common';
import type { CurrentUserPayload, Task } from '@techchallenge/shared-types';
import { TasksRepository } from './tasks.repository';
import { AuditLogRepository } from '../common/audit-log.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly auditLog: AuditLogRepository,
  ) {}

  list(workspaceId: string, page: number, pageSize: number) {
    return this.tasksRepository.findAll(workspaceId, page, pageSize);
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findById(id);
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }

  async create(dto: CreateTaskDto, user: CurrentUserPayload): Promise<Task> {
    const task = await this.tasksRepository.create({
      id: `task-${Date.now()}-${Math.round(Math.random() * 1000)}`,
      workspaceId: dto.workspaceId,
      title: dto.title,
      description: dto.description ?? '',
      status: dto.status ?? 'todo',
      assignee: dto.assignee ?? null,
      updatedAt: new Date().toISOString(),
    });

    this.auditLog.record({ actorId: user.userId, action: 'task.create', targetId: task.id });

    return task;
  }

  async update(id: string, dto: UpdateTaskDto, rawBody: Record<string, unknown>): Promise<Task> {
    await this.findOne(id);

    const updated = await this.tasksRepository.update(id, { ...dto, ...rawBody });
    if (!updated) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.tasksRepository.remove(id);
  }
}
