'use server';

import { Prisma } from '@prisma/client';

import { isExecutiveBoard } from './positions';
import { Viewer } from './user';

type MriWithStudy = Prisma.MriGetPayload<{
    include: {
        study: {
            include: {
                information: true;
            };
        };
    };
}>;

export async function canUserSeeMRI(viewer: Viewer, mri: MriWithStudy) {
    return !mri.study.information.confidential || isExecutiveBoard(viewer);
}
