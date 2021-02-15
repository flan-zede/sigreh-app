import { PaginatorInterface } from './paginator.interface';

export interface RouteInterface {
  path: string;
  sort?: string;
  id?: number;
  search?: string;
  page?: PaginatorInterface;
}
