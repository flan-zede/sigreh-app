import { City } from './city.class';
import { User } from './user.class';

export class Establishment {
  id: number;
  name: string;
  nature: string;
  municipality: string;
  location: string;
  cityId: number;
  city: City;
  users: User[] = [];
}
