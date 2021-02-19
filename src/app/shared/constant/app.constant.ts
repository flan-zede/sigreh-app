import { RouteInterface, MenuItemInterface } from 'src/app/shared/interface/app.interface';

export const USER_ROLE = {
    'reh': 'Receptionist d\'etablissement hotelier',
    'geh': 'Gerant d\'etablissement hotelier',
    'pp': 'Responsable de Préfecture de police',
    'ddmt': 'Directeur départementale du ministère du tourisme',
    'drmt': 'Directeur régionale du ministère du tourisme',
    'dsmt': 'Directeur de la statistique du ministère du tourisme',
    'smi': 'Responsable sureté, ministère de l\interieur',
    'admin': 'Administrateur'
};

export const USER_ROLE_HIERARCHY = {
    REH: ['reh'],
    GEH: ['geh', 'reh', 'pp', 'ddmt', 'drmt', 'dsmt', 'smi', 'admin'],
    PP: ['pp', 'ddmt', 'drmt', 'dsmt', 'smi', 'admin'],
    DDMT: ['ddmt', 'drmt', 'dsmt', 'smi', 'admin'],
    DRMT: ['drmt', 'dsmt', 'smi', 'admin'],
    DSMT: ['dsmt', 'smi', 'admin'],
    SMI: ['smi', 'admin'],
    ADMIN: ['admin'],
};

export const ROUTE: RouteInterface = {
    path: null,
    sort: 'desc',
    id: null,
    search: null,
    page: {
        length: 1,
        size: 10,
        sizeOptions: [10, 50, 100, 200],
        showFirstLastButtons: true,
        index: 1
    }
};

export const MENU_ITEM: MenuItemInterface[] = [
    { route: '/client', name: 'client', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.GEH },
    { route: '/user', name: 'user', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
    { route: '/city', name: 'city', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
    { route: '/establishment', name: 'establishment', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
];

export const DIALOG_CONFIG = {
    disableClose: false,
    height: '100vh',
    width: '100vw',
    minHeight: '100vh',
    minWidth: '100vw',
    autoFocus: false
};


