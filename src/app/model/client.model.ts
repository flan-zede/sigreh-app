import { Establishment } from './establishment.model';
import { User } from './user.model';

export class Client {
  id: number;
  phone: string;
  enterDate: Date;
  numberOfNights: number;
  numberOfHours: number;
  occupationType: string;
  bedroomNumber: number;
  bedroomType: string;
  numberOfVisitors: number;
  partnerGender: string;
  releaseDate: Date;
  name: string;
  firstname: string;
  birthdate: Date;
  gender: string;
  nationality: string;
  idnumber: string;
  idnumberNature: string;
  signature: string;
  createdAt: Date;

  establishmentID: number;
  userID: number;

  establishment: Establishment;
  user: User;
}
