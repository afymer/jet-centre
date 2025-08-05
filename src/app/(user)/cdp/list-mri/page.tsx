'use client';

import { useEffect, useState } from 'react';

import { getPublicMRIs, PublicMRI } from '@/data/mri';
import { getCurrentUser } from '@/data/user';

function MRICard({ mri }: { mri: PublicMRI }) {
    return (
        <div>
            <div>{mri.studyName}</div>
        </div>
    );
}

export default function Page() {
    const [MRIs, setMRIs] = useState<PublicMRI[]>([]);

    useEffect(() => {
        async function fetchMris() {
            const viewer = await getCurrentUser();
            if (!viewer) return;
            const MRIs = await getPublicMRIs(viewer);
            setMRIs(MRIs);
        }
        fetchMris();
    }, []);

    return (
        <div>
            {MRIs.map((mri) => (
                <MRICard key={mri.id} mri={mri} />
            ))}
        </div>
    );
}
