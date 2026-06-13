import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware disabled — this project uses localStorage-based mock auth
// for portfolio purposes. Route protection happens client-side in
// DashboardLayout.tsx via isAuthenticated().
//
// If a real backend with cookie-based sessions is added later, restore
// the matcher below and re-enable server-side route protection.

export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};