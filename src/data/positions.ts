/// Warning: this file may end up on the client

import { Viewer } from './user';

const positions = [
    'president',
    'internal_vice_president',
    'operational_vice_president',
    'external_vice_president',
    'treasurer',
    'vice_treasurer',
    'general_secretary',
    'commercial_director',
    'info',
] as const;

export type Position = (typeof positions)[number];

const executivePositions: Position[] = [
    'president',
    'internal_vice_president',
    'operational_vice_president',
    'external_vice_president',
    'treasurer',
    'vice_treasurer',
    'general_secretary',
    'commercial_director',
];

export type ExtendedPosition = Position | 'admin';

// export type ExecutivePosition = (typeof executivePositions)[number];

export function isValidPosition(pos: string): pos is Position {
    return (positions as readonly string[]).includes(pos);
}

export function isExecutiveBoard(viewer: Viewer): boolean {
    if (!viewer.position) return false;
    return executivePositions.includes(viewer.position);
}
