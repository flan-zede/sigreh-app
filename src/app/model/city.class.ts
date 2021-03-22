import { Department } from './department.class';
import { Establishment } from './establishment.class';

export class City {
  id: number;
  name: string;
  departmentId: number;
  department: Department;
  establishments: Establishment[] = [];
}
