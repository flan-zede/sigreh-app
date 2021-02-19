import { Department } from './department.model';
import { Establishment } from './establishment.model';

export class City {
  id: number;
  name: string;
  departmentId: number;
  department: Department;
  establishments: Establishment[] = [];
}
