'use server';

import prisma from '@/db';

import { canUserSeeMRI } from './mri-dto';
import { Viewer } from './user';

export type PublicMRI = {
    studyName: string;
    id: string;
};

export async function getPublicMRIs(viewer: Viewer): Promise<PublicMRI[]> {
    return await prisma.mri
        .findMany({
            include: {
                study: {
                    include: {
                        information: true,
                    },
                },
            },
        })
        .then((mris) =>
            mris
                .filter((mri) => canUserSeeMRI(viewer, mri))
                .map((mri) => {
                    return {
                        studyName: mri.study.information.title ?? '',
                        id: mri.id,
                    };
                })
        );
}
