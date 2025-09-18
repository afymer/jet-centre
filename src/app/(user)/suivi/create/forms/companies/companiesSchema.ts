import { CompanySize, Domain } from '@prisma/client';

import { z, EMPTY_STRING, required, nonEmptyExcluded } from '@/lib/zod';
// import { zCompanySize, zDOMAINS } from '@/settings/vars';

const zIdx = z.object({
    idx: z.number().int(),
});

const zIsNew = z.object({
    isNew: z.boolean(),
});

// ====================================================== //
// ======================= Contact ====================== //
// ====================================================== //

const zContact = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email().optional(),
    job: z.string(),
    excluded: z.boolean().default(false),
    id: z.string(),
});

// ~~~~~~~~~~~ Contact Creation ~~~~~~~~~~ //
export const contactCreationSchema = z.object({
    firstName: z.string().superRefine(required),
    lastName: z.string().superRefine(required),
    email: z.email().optional(),
    tel: z.string().or(EMPTY_STRING),
    job: z.string(),
    description: z.string(),
    excluded: z.boolean().prefault(false),
});

export type ContactCreationSchema = z.input<typeof contactCreationSchema>;
export const emptyContactCreationSchema: ContactCreationSchema = {
    firstName: '',
    lastName: '',
    email: '',
    tel: '',
    description: '',
    job: '',
    excluded: false,
};

// ~~~~~~~~~~ Contact Form Value ~~~~~~~~~ //
const zNewContact = contactCreationSchema.merge(zIsNew);
export type NewContact = z.infer<typeof zNewContact>;

const zContactFormValue = zNewContact.or(zContact);
export type ContactFormValue = z.infer<typeof zContactFormValue>;

// ====================================================== //
// ======================= Company ====================== //
// ====================================================== //

const zCompany = z.object({
    id: z.string(),
    name: z.string().superRefine(required),
    size: z.nativeEnum(CompanySize).or(EMPTY_STRING).nullish(),
    domains: z.array(z.nativeEnum(Domain)).or(EMPTY_STRING),
    ca: z.number().or(EMPTY_STRING).nullable(),
    address: z
        .object({
            number: z.string(),
            street: z.string(),
            city: z.string(),
            zip: z.string(),
            country: z.string(),
        })
        .optional(),
    members: zContactFormValue.array().superRefine(nonEmptyExcluded),
});
export type Company = z.infer<typeof zCompany>;

const zNewCompany = zCompany.merge(zIsNew);

const zCompanyFormValue = zNewCompany.merge(zIdx).or(zCompany.merge(zIdx));
export type CompanyFormValue = z.infer<typeof zCompanyFormValue>;

export const emptyCompany = {
    name: '',
    size: '',
    domains: [] as Domain[],
    ca: '',
    address: {
        number: '',
        street: '',
        city: '',
        zip: '',
        country: '',
    },
    members: [],
};

// ~~~~~~~~~~~~~~ Companies ~~~~~~~~~~~~~~ //
export const companiesCreationSchema = z.object({
    companies: z.array(zCompanyFormValue.nullable()),
});
type CompaniesCreationSchema = z.infer<typeof companiesCreationSchema>;

export const emptyCompaniesCreationSchema: CompaniesCreationSchema = { companies: [] };
