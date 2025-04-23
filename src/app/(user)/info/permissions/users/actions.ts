'use server';

import prisma from '@/db';

type QueryParameters = {
    offset?: number;
    limit?: number;
};

export async function getUsersAndPermission(query_parameters?: QueryParameters) {
    try {
        return await prisma.user.findMany({
            include: {
                person: true,
                permissionGroups: {
                    include: {
                        permission: true,
                    },
                },
            },
            skip: query_parameters?.offset,
            take: query_parameters?.limit,
        });
    } catch (e) {
        console.error(`[getUsers] ${e}`);
    }
}
