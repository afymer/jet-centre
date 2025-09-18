import { CompanySize as PgCompanySize } from '@prisma/client';

/**
 * See {@link https://www.economie.gouv.fr/cedef/entreprises-categories}.
 */
export type CompanySize =
    | 'Micro-entreprise'
    | 'Petite entreprise'
    | 'Moyenne entreprise'
    | 'Grande entreprise';

export function toPgCompanySize(companySize: CompanySize): PgCompanySize {
    switch (companySize) {
        case 'Micro-entreprise':
            return 'MicroEntreprise';
        case 'Petite entreprise':
            return 'PetiteEntreprise';
        case 'Moyenne entreprise':
            return 'MoyenneEntreprise';
        case 'Grande entreprise':
            return 'GrandeEntreprise';
    }
}

export const ANIMATION_DURATION_MS = 200;
