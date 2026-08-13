import { Injectable } from '@nestjs/common';
import type { Workspace } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorkspacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Workspace[]> {
    return this.prisma.workspace.findMany();
  }

  async findById(id: string): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique({ where: { id } });
  }
}
