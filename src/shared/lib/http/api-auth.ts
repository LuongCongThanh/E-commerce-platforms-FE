import { API } from '@/shared/constants/api-endpoints';
import { useAuthStore } from '@/shared/stores/auth-store';

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

export function setAccessToken(token: string | null): void {
  if (token !== null) {
    useAuthStore.getState().setAccessToken(token);
  } else {
    useAuthStore.getState().clearAuth();
  }
}

export async function refreshAccessToken(): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  const res = await fetch(`${baseUrl}${API.AUTH.REFRESH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // Assuming refresh token is in a cookie, or we need to send something else
    // In this project, it seems to be in a cookie (withCredentials)
  });

  if (!res.ok) {
    throw new Error('Unable to refresh token');
  }

  const result = (await res.json()) as { data: string }; // Adjust based on your API response
  const newToken = result.data;

  setAccessToken(newToken);

  return newToken;
}
