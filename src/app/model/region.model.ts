import { Department } from './department.model';
import { User } from './user.model';

export class Region {
  id: number;
  name: string;
  departments: Department[] = [];
  users: User[] = [];
}
