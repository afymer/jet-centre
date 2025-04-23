'use server';

import prisma from '@/db';

export async function updatePermission(
    id: string,
    allowedRoute: string,
    allowSubroutes: boolean
): Promise<void> {
    console.log('updating permission with id', id);
    console.log('updating permission with route', allowedRoute);
    console.log('updating permission with subroutes', allowSubroutes);
    try {
        await prisma.permission.update({
            where: { id },
            data: { allowedRoute, allowSubroutes },
        });
    } catch (e) {
        console.error(`[updatePermission] ${e}`);
    }
}
