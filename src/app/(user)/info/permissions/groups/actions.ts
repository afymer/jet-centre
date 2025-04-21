'use server';

import prisma from '@/db';

type QueryParameters = {
    offset?: number;
    limit?: number;
};

export async function getPermissionGroups(query_parameters?: QueryParameters) {
    try {
        return await prisma.permissionGroup.findMany({
            include: {
                users: {
                    include: {
                        person: true,
                    },
                },
                permission: true,
            },
            skip: query_parameters?.offset,
            take: query_parameters?.limit,
        });
    } catch (e) {
        console.error(`[getUsers] ${e}`);
    }
}
