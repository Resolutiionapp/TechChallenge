export interface CurrentUser {
  userId: string;
  role: 'member' | 'admin';
  workspaceId: string;
}

export function useCurrentUser(): CurrentUser {
  return { userId: 'demo-user', role: 'member', workspaceId: 'ws-1' };
}
