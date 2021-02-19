import { City } from './city.model';
import { User } from './user.model';

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
