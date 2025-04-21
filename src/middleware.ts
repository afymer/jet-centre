/**
 * In our case, the middleware's goal is to handle authentication.
 * This module exports a default function that acts as a middleware for Next.js.
 * It is responsible for redirecting or rewriting URLs based on the authentication status.
 * The module also exports a configuration object for specifying the URL matcher.
 * The middleware is great as it intercepts all requests before they reach the page.
 *
 * @file middleware.ts
 * @donotmove - This file mus't be moved to another directory, as
 * it's location has got importance.
 */

import { NextResponse } from 'next/server';

import { auth } from './actions/auth';

import type { Session } from 'next-auth';
import type { NextRequest } from 'next/server';
import { DEFAULT_LOGIN_REDIRECT, UNAUTHORIZED_REDIRECT } from './routes';
import prisma, { redis } from './db';
import { env } from 'process';

/**
 * Extends the internal NextAuth type to add `auth` session.
 *
 * @interface NextAuthRequest
 * @extends {NextRequest}
 */
interface NextAuthRequest extends NextRequest {
    auth: Session | null;
}

/**
 * Main function of the middleware.
 */
export default auth(async (request: NextAuthRequest) => {
    const session = request.auth;
    const isLoggedIn = !!session?.user.email;

    if (process.env.DEV_MODE) {
        return;
    }

    const { pathname } = request.nextUrl;

    if (!isLoggedIn) {
        if (pathname !== '/auth/signin') {
            return NextResponse.redirect(new URL('/auth/signin', request.nextUrl));
        } else {
            return NextResponse.next();
        }
    }

    if (pathname === '/auth/signin') {
        return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.nextUrl));
    }

    // At this point any user is logged in.

    let cacheHit = false;
    if (!env.NO_CACHE) {
        const key = 'access-' + session.user.email;
        cacheHit = (await redis?.get(key)) !== null;
    }

    let allowedRoutes: {
        allowedRoute: string;
        allowSubroutes: boolean;
    }[] = [];
    if (!cacheHit) {
        allowedRoutes = await prisma.permission.findMany({
            select: {
                allowedRoute: true,
                allowSubroutes: true,
            },
            where: {
                permissionGroups: {
                    every: {
                        users: {
                            every: {
                                person: {
                                    email: {
                                        equals: session.user.email ?? '',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    } else {
        // const key = 'access-' + session.user.email;
        // await redis?.hget(key, '');
        // const res = await redis?.get('test');
        // console.log('redis returned', res);
        // if (res === null) {
        //     redis?.set('test', 0);
        // } else {
        //     redis?.incr('test');
        // }
    }

    const isAllowed = allowedRoutes.some(({ allowedRoute, allowSubroutes }) => {
        if (allowSubroutes) {
            return pathname === allowedRoute || pathname.startsWith(`${allowedRoute}`);
        } else {
            return pathname === allowedRoute;
        }
    });

    if (pathname != UNAUTHORIZED_REDIRECT && !isAllowed) {
        return NextResponse.redirect(new URL(UNAUTHORIZED_REDIRECT, request.nextUrl));
    }

    return NextResponse.next();
});

/**
 * @property {string[]} matcher - An array of URL patterns to match against.
 * The middleware will solely be applied to URLs that match this patterns.
 */
export const config = {
    runtime: 'nodejs',
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};
