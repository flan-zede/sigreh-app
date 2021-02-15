import { City } from './city.model';
import { Department } from './department.model';

export class Subprefecture {
  id: number;
  name: string;
  departmentID: number;
  department: Department;
  cities: City[] = [];
}
