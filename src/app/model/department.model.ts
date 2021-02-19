import { Region } from './region.model';
import { User } from './user.model';

export class Department {
  id: number;
  name: string;
  regionId: number;
  region: Region;
  users: User[] = [];
}
