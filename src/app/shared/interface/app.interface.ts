import { User } from "src/app/model/user.model";

export interface LoginInterface {
    email: string;
    password: string;
}

export interface AuthResponseInterface {
    user: User;
    jwt: string;
}

export interface RouteInterface {
    path: string;
    related?: string;
    sort?: string;
    id?: number;
    ids?: string;
    search?: string;
    page?: PaginatorInterface;
}

export interface PaginatorInterface {
    index: number;
    size: number;
    length: number;
    sizeOptions: number[];
    showFirstLastButtons: boolean;
}

export interface PatchInterface {
    op: string;
    path: string;
    from?: string;
    value: string;
}

export interface RelationInterface {
    path?: string;
    action?: string;
    id?: number;
    relatedId?: number;
}

export interface PageResponseInterface {
    first: PageInterface;
    last: PageInterface;
    total: number;
    records: number;
    next: PageInterface;
    previous: PageInterface;
    data: [];
}

interface PageInterface {
    index: number;
    size: number;
}

export interface MenuItemInterface {
    route: string;
    name: string;
    icon: string;
    disabled: boolean;
    roles: string[];
}
