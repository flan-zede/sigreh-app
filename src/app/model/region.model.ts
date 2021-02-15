import { District } from './district.model';
import { Department } from './department.model';

export class Region {
  id: number;
  name: string;
  districtID: number;
  district: District;
  departments: Department[] = [];
}
