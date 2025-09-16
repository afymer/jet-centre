import { FaGears, FaHouse, FaNoteSticky } from 'react-icons/fa6';
import { GiFinishLine } from 'react-icons/gi';
import { PiStudent } from 'react-icons/pi';

import { ExtendedPosition } from '@/data/positions';

import { ADMIN_SIDEBAR } from './admin';
import { COMMERCIAL_DIRECTOR_SIDEBAR } from './dirco';
import { SECRETARY_GENERAL_SIDEBAR } from './secge';
import { MRI_ICON, TRESO_ICON } from './tabs';
import { TREASURER_SIDEBAR } from './treasurer';
import { RoleSideBar, SideBarGroup } from './types';
import { VPO_SIDEBAR } from './vpo';

export const ROLES_SIDEBARS: Partial<Record<ExtendedPosition, RoleSideBar>> = {
    treasurer: TREASURER_SIDEBAR,
    operational_vice_president: VPO_SIDEBAR,
    general_secretary: SECRETARY_GENERAL_SIDEBAR,
    commercial_director: COMMERCIAL_DIRECTOR_SIDEBAR,
    info: ADMIN_SIDEBAR,
    admin: ADMIN_SIDEBAR,
} satisfies Partial<Record<ExtendedPosition, RoleSideBar>>;

export const CDP_SIDEBAR: SideBarGroup[] = [
    {
        title: 'Pré-étude',
        items: [
            {
                title: "Paramètres de l'étude",
                icon: FaGears,
                href: '/settings',
            },
            {
                title: 'Écriture MRI',
                icon: MRI_ICON,
                href: '/mri',
            },
            {
                title: "Sélection d'intervenants",
                icon: PiStudent,
                href: '/assignees',
            },
        ],
    },
    {
        title: 'Documents',
        items: [
            {
                title: 'Notes clients & étude',
                icon: FaNoteSticky,
                href: '/notes',
            },
            {
                title: 'Documents de mission',
                icon: FaNoteSticky,
                href: '/docs',
            },
        ],
    },
    {
        title: 'Suivi',
        items: [
            {
                title: 'Tableau de bord',
                icon: FaHouse,
                href: '/dashboard',
            },
            {
                title: "Finalisation de l'étude",
                icon: GiFinishLine,
                href: '/finalisation',
            },
        ],
    },
    {
        title: 'Espace fun',
        items: [
            {
                title: 'Espace trésorerie',
                icon: TRESO_ICON,
                href: '/treso',
            },
        ],
    },
];
