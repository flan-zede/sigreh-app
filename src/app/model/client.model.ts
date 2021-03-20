import { Partner } from './partner.model';
import { Establishment } from './establishment.model';
import { User } from './user.model';

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
