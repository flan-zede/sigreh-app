import { PaginatorInterface } from './paginator.interface';
import { PatchInterface } from './patch.interface';
import { ManyToManyInterface, OneToManyInterface } from './relate.interface';

export interface RouteInterface {
    path: string;
    sort?: string;
    id?: number;
    search?: string;
    page?: PaginatorInterface;
    oneToMany?: OneToManyInterface[];
    manyToMany?: ManyToManyInterface[];
    patch?: PatchInterface[];
}
