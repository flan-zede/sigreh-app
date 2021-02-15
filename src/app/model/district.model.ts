import { Region } from './region.model';

export class District {
  id: number;
  name: string;
  autonomy: boolean;
  regions: Region[] = [];
}
