import { Region } from './region.model';
import { Department } from './department.model';
import { Establishment } from './establishment.model';

export class User {
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

  username: string;
  email: string;
  password: string;
  blocked: boolean;
  role: string;

  regions: Region[] = [];
  departments: Department[] = [];
  establishments: Establishment[] = [];

  createdAt: Date;
}
