'use server';

import { Prisma } from '@prisma/client';

import { executivePositions } from './positions';
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

function isExecutiveBoard(viewer: Viewer): boolean {
    if (!viewer.position) return false;
    return executivePositions.includes(viewer.position);
}

export async function canUserSeeMRI(viewer: Viewer, mri: MriWithStudy) {
    return !mri.study.information.confidential || isExecutiveBoard(viewer);
}
