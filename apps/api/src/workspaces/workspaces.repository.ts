import { Injectable } from '@nestjs/common';

export interface WorkspaceRecord {
  id: string;
  name: string;
}

const WORKSPACES: WorkspaceRecord[] = [
  { id: 'ws-1', name: 'Product' },
  { id: 'ws-2', name: 'Platform' },
];

@Injectable()
export class WorkspacesRepository {
  async findAll(): Promise<WorkspaceRecord[]> {
    await new Promise((resolve) => setTimeout(resolve, 5));
    return WORKSPACES;
  }

  async findById(id: string): Promise<WorkspaceRecord | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 5));
    return WORKSPACES.find((workspace) => workspace.id === id);
  }
}
