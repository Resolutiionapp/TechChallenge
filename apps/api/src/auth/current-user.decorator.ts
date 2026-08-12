import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { CurrentUserPayload } from '@techchallenge/shared-types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    const workspaceIdsHeader: string = request.headers['x-workspace-ids'] ?? '';

    return {
      userId: request.headers['x-user-id'] ?? 'anonymous',
      workspaceIds: workspaceIdsHeader.split(',').filter(Boolean),
    };
  },
);
