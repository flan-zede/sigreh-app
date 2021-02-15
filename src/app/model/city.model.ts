import { Subprefecture } from './subprefecture.model';

export class City {
  id: number;
  name: string;
  subprefectureID: number;
  districtCapital: boolean;
  regionCapital: boolean;
  departmentCapital: boolean;
  subprefectureCapital: boolean;
  subprefecture: Subprefecture;
}
