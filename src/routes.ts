export const DEFAULT_LOGIN_REDIRECT = '/';
export const UNAUTHORIZED_REDIRECT = '/unauthorized';

export const authorizedRoutes = {
    tresorier: ['/', '/treso', '/admin'],
};

export type StudyParams = { params: Promise<{ study: string }> };
