import { Injectable } from '@nestjs/common';
import type { Task, TaskStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    workspaceId: string,
    page: number,
    pageSize: number,
  ): Promise<{ items: Task[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.task.findMany({
        where: { workspaceId },
        skip: page * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.task.count({ where: { workspaceId } }),
    ]);

    return { items, total };
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async countByWorkspace(workspaceId: string): Promise<number> {
    return this.prisma.task.count({ where: { workspaceId } });
  }

  async create(data: {
    id: string;
    workspaceId: string;
    title: string;
    description: string;
    status: TaskStatus;
    assignee: string | null;
  }): Promise<Task> {
    return this.prisma.task.create({ data });
  }

  async update(id: string, patch: Record<string, unknown>): Promise<Task | null> {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    const merged = { ...existing, ...patch };

    return this.prisma.task.update({
      where: { id },
      data: {
        workspaceId: merged.workspaceId as string,
        title: merged.title as string,
        description: merged.description as string,
        status: merged.status as TaskStatus,
        assignee: (merged.assignee ?? null) as string | null,
      },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
