import { Region } from './region.class';
import { User } from './user.class';

export class Department {
  id: number;
  name: string;
  regionId: number;
  region: Region;
  users: User[] = [];
}
