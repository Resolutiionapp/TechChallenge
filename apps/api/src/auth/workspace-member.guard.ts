import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceMemberGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const workspaceIdsHeader: string = request.headers['x-workspace-ids'] ?? '';
    const workspaceIds: string[] = workspaceIdsHeader.split(',').filter(Boolean);
    const requestedWorkspaceId: string | undefined =
      request.params.workspaceId ?? request.body?.workspaceId;

    if (!requestedWorkspaceId) {
      return true;
    }

    return workspaceIds.includes(requestedWorkspaceId);
  }
}
