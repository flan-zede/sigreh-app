import { Department } from './department.class';
import { User } from './user.class';

export class Region {
  id: number;
  name: string;
  departments: Department[] = [];
  users: User[] = [];
}
