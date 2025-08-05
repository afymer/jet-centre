'use server';

import { Prisma } from '@prisma/client';

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

const executivePositions = [
    'president',
    'internal-vice-president',
    'operational-vice-president',
    'external-vice-president',
    'treasurer',
    'vice-treasurer',
    'general-secretary',
    'commercial-director',
];

function isExecutiveBoard(viewer: Viewer): boolean {
    if (!viewer.position) return false;
    return executivePositions.includes(viewer.position);
}

export function canUserSeeMRI(viewer: Viewer, mri: MriWithStudy) {
    return !mri.study.information.confidential || isExecutiveBoard(viewer);
}
