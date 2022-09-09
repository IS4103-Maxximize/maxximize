import { NextResponse } from 'next/server'

export function middleware(request) {
    const authenticated = localStorage.getItem('accessToken');
    if (authenticated == null) {
        request.nextUrl.pathname = '/login'
        return NextResponse.rewrite(request.nextUrl);
    }
}