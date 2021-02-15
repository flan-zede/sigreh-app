import { Region } from './region.model';
import { Subprefecture } from './subprefecture.model';

export class Department {
  id: number;
  name: string;
  regionID: number;
  region: Region;
  subprefectures: Subprefecture[] = [];
}
