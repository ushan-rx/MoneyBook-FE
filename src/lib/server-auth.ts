import 'server-only';
import { cookies } from 'next/headers';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { redirect } from 'next/navigation';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Protected route helper - checks authentication and redirects if not authenticated
 * @param redirectPath Path to redirect to if not authenticated (defaults to '/')
 * @returns Authentication status
 */
export async function requireAuth(redirectPath: string = '/'): Promise<{
  authenticated: boolean;
  error: string | null;
}> {
  const result = await ServerValidateUser();
  if (!result.authenticated) {
    redirect(redirectPath);
  }
  return result;
}

// Function to validate user authentication on the server
export async function ServerValidateUser(): Promise<{
  authenticated: boolean;
  error: string | null;
}> {
  // Get cookie store
  const cookieStore = await cookies();

  // Extract individual cookies needed for auth
  const cookieHeader = formatCookieHeader(cookieStore);

  const isAuthTokenPresent = cookieHeader.includes('auth-token');
  const isRefreshTokenPresent = cookieHeader.includes('refresh-token');
  let isUserValid = false;

  if (!isRefreshTokenPresent && !isAuthTokenPresent) {
    // If cookies are missing, redirect to login
    console.log('Server: Missing auth cookies');
    return {
      authenticated: false,
      error: 'Missing auth cookies',
    };
  } else {
    try {
      if (isAuthTokenPresent) {
        isUserValid = await isValidated(cookieHeader);
        if (isUserValid) {
          console.log('Server: Authenticated successfully');
          return {
            authenticated: true,
            error: null,
          };
        } else {
          console.log('Server: Auth token invalid');
          return {
            authenticated: false,
            error: 'Auth token invalid',
          };
        }
      } else if (isRefreshTokenPresent) {
        const refreshResponse = await fetchNewAuthToken(cookieHeader);
        // Get new cookies from response
        const setCookieHeader = refreshResponse.headers.getSetCookie();
        // If refresh was successful, try to get validated again
        if (refreshResponse.ok) {
          const newCookHeader =
            setCookieHeader.length > 0
              ? setCookieHeader.join('; ')
              : cookieHeader;
          // Validate user again with new cookies
          isUserValid = await isValidated(newCookHeader);
          if (isUserValid) {
            console.log('Server: Token refreshed successfully');
            return {
              authenticated: true,
              error: null,
            };
          }
        }
        // when both initial request and refresh failed
        return {
          authenticated: false,
          error: 'Authentication failed',
        };
      } else {
        console.log('Server: No valid auth tokens found');
        return {
          authenticated: false,
          error: 'No valid auth tokens found',
        };
      }
    } catch (error) {
      console.error('Server auth error:', error);
      return {
        authenticated: false,
        error: 'Failed to authenticate',
      };
    }
  }
}

async function isValidated(cookieHeader: string): Promise<boolean> {
  const response = await fetch(`${API_URL}/auth/validate`, {
    method: 'GET',
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
    },
    // not use credentials: 'include' with server-side fetch when manually setting cookies
    cache: 'no-store',
  });
  if (response.ok) {
    const data = await response.json();
    return data?.data?.authenticated || false;
  } else {
    console.error('Server auth error:', response.status);
    return false;
  }
}

async function fetchNewAuthToken(cookieHeader: string): Promise<Response> {
  console.log('Server: Attempting to refresh token');
  return await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      Cookie: cookieHeader,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
}

// Helper function to format cookies properly
function formatCookieHeader(cookieStore: ReadonlyRequestCookies): string {
  const allCookies = cookieStore.getAll();

  // Look specifically for auth-related cookies
  const relevantCookieNames = ['auth-token', 'refresh-token', 'JSESSIONID'];

  const cookiePairs = allCookies
    .filter(
      (cookie) =>
        relevantCookieNames.includes(cookie.name) ||
        cookie.name.toLowerCase().includes('token') ||
        cookie.name.toLowerCase().includes('auth') ||
        cookie.name.toLowerCase().includes('refresh')
    )
    .map((cookie) => `${cookie.name}=${cookie.value}`);

  return cookiePairs.join('; ');
}
