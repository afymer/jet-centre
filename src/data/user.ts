'use server';

import { User } from 'next-auth';

import { auth } from '@/actions/auth';

export type Viewer = User & { position?: string };

export const getCurrentUser = async (): Promise<Viewer | undefined> => {
    const session = await auth();
    return session?.user;
};
