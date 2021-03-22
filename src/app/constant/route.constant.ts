import { RouteInterface } from '../interface';

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
    oneToMany: [],
    manyToMany: [],
    patch: []
};
