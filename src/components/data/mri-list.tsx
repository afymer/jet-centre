'use client';

import { Domain, Level, MriStatus } from '@prisma/client';
import { useCallback, useState } from 'react';
import { FaQuestion } from 'react-icons/fa6';

import { Button } from '@/components/ui/button';
import { getPublicMRIs, PublicMRI } from '@/data/mri';
import { getViewer } from '@/data/user';
import { cn } from '@/lib/utils';

import { Badge } from '../ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogPortal,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

function MRIDifficultyLabel({ difficulty }: { difficulty: Level | null }) {
    const style: {
        variant: 'secondary' | 'outline';
        className: string;
        label: string;
    } = {
        variant: 'secondary',
        className: '',
        label: 'inconnu',
    };
    switch (difficulty) {
        case 'High':
            style.variant = 'secondary';
            style.className = 'bg-red-500';
            style.label = 'Difficile';
            break;
        case 'Medium':
            style.variant = 'secondary';
            style.className = 'bg-orange-500';
            style.label = 'Moyen';
            break;
        case 'Low':
            style.variant = 'secondary';
            style.className = 'bg-green-500';
            style.label = 'Facile';
            break;
        case null:
        default:
            style.variant = 'outline';
            style.className = '';
            style.label = 'Difficulté inconnue';
            break;
    }
    return (
        <Badge variant={style.variant} className={cn('select-none', style.className)}>
            {style.label}
        </Badge>
    );
}

const MRIDomainDesc: Record<Domain, string> = {
    AppDev: 'AppDev',
    Chatbot: 'Chatbot',
    ComputerGraphics: 'ComputerGraphics',
    ComputerVision: 'ComputerVision',
    Cryptography: 'Cryptography',
    Cybersecurity: 'Cybersecurity',
    d_3D: 'd_3D',
    DataScience: 'DataScience',
    EmbeddedSystems: 'EmbeddedSystems',
    Image: 'Image',
    IntelligenceArtificielle: 'IntelligenceArtificielle',
    Internet: 'Internet',
    IoT: 'IoT',
    MachineLearning: 'MachineLearning',
    MarketAnalysis: 'MarketAnalysis',
    MobileDev: 'MobileDev',
    Networks: 'Networks',
    StateOfTheArt: 'StateOfTheArt',
    Telecommunications: 'Telecommunications',
    WebDev: 'WebDev',
};

function MRIDomainLabel({ domain }: { domain: Domain | null }) {
    const style: {
        variant: 'secondary';
        className: string;
        label: string;
        tooltip: string | null;
    } = {
        variant: 'secondary',
        className: 'bg-blue-500',
        label: domain === null ? 'Domaine inconnu' : (domain as string),
        tooltip: domain === null ? 'Domaine non renseigné sur le MRI' : MRIDomainDesc[domain],
    };
    return (
        <Tooltip delayDuration={500} disableHoverableContent>
            <TooltipTrigger className="cursor-default">
                <Badge variant={style.variant} className={cn('space-x-2', style.className)}>
                    <FaQuestion />
                    <div>{style.label}</div>
                </Badge>
            </TooltipTrigger>
            {style.tooltip !== null && <TooltipContent>{style.tooltip}</TooltipContent>}
        </Tooltip>
    );
}

function MRIStatusLabel({ status }: { status: MriStatus }) {
    const style: {
        variant: 'secondary';
        className: string;
        label: string;
        tooltip: string | null;
    } = {
        variant: 'secondary',
        className: '',
        label: 'Inconnu',
        tooltip: null,
    };
    switch (status) {
        case 'InProgress': // Currently being redacted
            style.className = 'bg-gray-500';
            style.label = 'En rédaction';
            style.tooltip = 'En cours de rédaction par les CDPs';
            break;
        case 'Finished': // Currently being reviewed
            style.className = 'bg-yellow-500';
            style.label = 'Terminé';
            style.tooltip = 'En attente de validation';
            break;
        case 'Validated':
            style.className = 'bg-green-500';
            style.label = 'Validé';
            style.tooltip = "Validé, en attente d'être envoyé";
            break;
        case 'Sent': // Waiting for students
            style.className = 'bg-green-500';
            style.label = 'Envoyé';
            style.tooltip = 'Envoyé, actif';
            break;
        case 'Expired': // Selection is over
            style.className = 'bg-red-500';
            style.label = 'Expiré';
            style.tooltip = null;
            break;

        default:
            break;
    }
    return (
        <Tooltip delayDuration={500} disableHoverableContent>
            <TooltipTrigger className="cursor-default">
                <Badge variant={style.variant} className={cn('space-x-2', style.className)}>
                    <FaQuestion />
                    <div>{style.label}</div>
                </Badge>
            </TooltipTrigger>
            {style.tooltip !== null && <TooltipContent>{style.tooltip}</TooltipContent>}
        </Tooltip>
    );
}

function MRICard({ mri }: { mri: PublicMRI }) {
    const title = mri.mriTitle ?? 'No title';
    return (
        <div className="bg-card p-4 rounded w-full space-y-6">
            <div className="flex flex-col space-y-1">
                <div className="text-3xl font-bold">{title}</div>
                <div className="flex flex-row space-x-2">
                    <MRIDifficultyLabel difficulty={mri.mriDifficulty} />
                    <MRIDomainLabel domain={mri.mriMainDomain} />
                    <MRIStatusLabel status={mri.mriStatus} />
                </div>
            </div>
            <Dialog>
                <DialogTrigger>
                    <div className="max-h-[4rem] overflow-hidden relative cursor-pointer">
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-card to-transparent" />
                        <div>{mri.introductionText}</div>
                    </div>
                </DialogTrigger>
                <DialogPortal container={document.body}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{mri.introductionText}</DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </DialogPortal>
            </Dialog>
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
        <div className="flex flex-col space-y-4">
            <div>
                <Button variant="default" onClick={refresh}>
                    Refresh list
                </Button>
            </div>

            <div className="grid grid-cols-4 space-y-2">
                {status.kind === 'display' &&
                    status.MRIs.map((mri) => <MRICard key={mri.id} mri={mri} />)}
                {status.kind === 'pending' && <div>Pending...</div>}
                {status.kind === 'error' && <div>Error: {status.message}</div>}
            </div>
        </div>
    );
}
