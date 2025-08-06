'use client';

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { getPublicMRIs, PublicMRI } from '@/data/mri';
import { getViewer } from '@/data/user';

function MRICard({ mri }: { mri: PublicMRI }) {
    return (
        <div className="bg-white text-black p-4 rounded w-full">
            <div>{mri.studyName}</div>
        </div>
    );
}

type MRIListStatus =
    | { kind: 'pending' }
    | { kind: 'error'; message: string }
    | { kind: 'display'; MRIs: PublicMRI[] };

export function MRIList({ initialMRIs }: { initialMRIs: PublicMRI[] }) {
    const [status, setStatus] = useState<MRIListStatus>({
        kind: 'display',
        MRIs: initialMRIs,
    });

    const refresh = useCallback(async () => {
        setStatus({ kind: 'pending' });

        const result = await getViewer();
        if (result.status === 'error') {
            setStatus({ kind: 'error', message: result.message });
        } else {
            const mris = await getPublicMRIs(result.viewer);
            setStatus({ kind: 'display', MRIs: mris });
        }
    }, []);

    return (
        <div>
            <Button variant="default" onClick={refresh}>
                Refresh list
            </Button>

            <div className="flex flex-col p-4">
                {status.kind === 'display' &&
                    status.MRIs.map((mri) => <MRICard key={mri.id} mri={mri} />)}
                {status.kind === 'pending' && <div>Pending...</div>}
                {status.kind === 'error' && <div>Error: {status.message}</div>}
            </div>
        </div>
    );
}
