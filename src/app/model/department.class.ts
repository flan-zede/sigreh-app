import { City } from './city.class';
import { Region } from './region.class';
import { User } from './user.class';

export class Department {
  id: number;
  name: string;
  regionId: number;
  region: Region;
  cities: City[];
  users: User[] = [];
}
