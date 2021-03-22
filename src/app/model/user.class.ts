import { Region } from './region.class';
import { Department } from './department.class';
import { Establishment } from './establishment.class';

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
  active: boolean;
  role: string;
  regions: Region[] = [];
  departments: Department[] = [];
  establishments: Establishment[] = [];
  createdAt: Date;
  updatedAt: Date;
}
