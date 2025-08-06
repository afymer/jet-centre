/// Warning: this file may end up on the client

export const positions = [
    'president',
    'internal-vice-president',
    'operational-vice-president',
    'external-vice-president',
    'treasurer',
    'vice-treasurer',
    'general-secretary',
    'commercial-director',
] as const;

export type Position = (typeof positions)[number];

export const executivePositions: Position[] = [
    'president',
    'internal-vice-president',
    'operational-vice-president',
    'external-vice-president',
    'treasurer',
    'vice-treasurer',
    'general-secretary',
    'commercial-director',
];

export type ExecutivePosition = (typeof executivePositions)[number];

export function isValidPosition(pos: string): pos is Position {
    return (positions as readonly string[]).includes(pos);
}
