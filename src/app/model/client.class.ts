import { Partner } from './partner.class';
import { Establishment } from './establishment.class';
import { User } from './user.class';

export class Client {
  id: number;
  name: string;
  firstname: string;
  birthdate: Date;
  gender: string;
  nationality: string;
  idnumber: string;
  idnumberNature: string;
  phoneType: string;
  phone: string;
  occupationType: string;
  numberOfNights: number;
  numberOfHours: number;
  bedroomNumber: number;
  bedroomType: string;
  enterDate: Date;
  enterTime: string;
  partners: Partner[];
  establishmentId: number;
  userId: number;
  establishment: Establishment;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
