const SESSION_TOKEN_KEY = 'sessionToken';

export function getSessionToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(SESSION_TOKEN_KEY);
}

export function setSessionToken(token: string): void {
  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}
