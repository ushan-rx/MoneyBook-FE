import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Allow image optimization and static files
  //   if (
  //     req.nextUrl.pathname.startsWith('/_next/static') ||
  //     req.nextUrl.pathname.startsWith('/_next/image') ||
  //     req.nextUrl.pathname === '/favicon.ico'
  //   ) {
  //     return NextResponse.next();
  //   }

  const authToken = req.cookies.get('auth-token')?.value;
  const publicRoutes = ['/']; // Allow these pages
  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

  if (isPublicRoute || req.nextUrl.pathname.startsWith('/_next/')) {
    // Allow public routes and static files
    return NextResponse.next();
  }

  if (!authToken && !isPublicRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'], // Protect everything except "/"
};
