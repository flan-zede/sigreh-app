import { City } from './city.model';

export class Establishment {
  id: number;
  name: string;
  nature: string;
  street: string;
  location: string;
  managers: string;
  receptionists: string;
  cityID: number;
  city: City;
}
