import { RouteInterface, MenuItemInterface, ListItemInterface } from 'src/app/shared/interface';

export const USER_ROLE: ListItemInterface[] = [
    { id: 'REH',   name: 'Receptionist d\'etablissement hotelier' },
    { id: 'GEH',   name: 'Gerant d\'etablissement hotelier' },
    { id: 'PP',    name: 'Responsable de Préfecture de police' },
    { id: 'DDMT',  name: 'Directeur départementale du ministère du tourisme' },
    { id: 'DRMT',  name: 'Directeur régionale du ministère du tourisme' },
    { id: 'DSMT',  name: 'Directeur de la statistique du ministère du tourisme' },
    { id: 'SMI',   name: 'Responsable sureté, ministère de l\'interieur' },
    { id: 'ADMIN', name: 'Administrateur' }
];

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
    },
    relates: [],
    patches: []
};

export const MENU_ITEM: MenuItemInterface[] = [
    { route: '/client', name: 'client', icon: '' },
    { route: '/user', name: 'user', icon: '' },
    { route: '/city', name: 'city', icon: '' },
    { route: '/establishment', name: 'establishment', icon: '' },
];

export const DIALOG_CONFIG = {
    disableClose: false,
    minHeight: '100vh',
    minWidth: '100vw',
    autoFocus: false
};
