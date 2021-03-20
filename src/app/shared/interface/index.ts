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
    sort?: string;
    id?: number;
    search?: string;
    page?: PaginatorInterface;
    relates?: RelationshipInterface[];
    patches?: PatchInterface[];
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

export interface RelationshipInterface {
    table: string;
    id: number;
    add: boolean;
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
}

export interface ListItemInterface {
    id: string;
    name: string;
}