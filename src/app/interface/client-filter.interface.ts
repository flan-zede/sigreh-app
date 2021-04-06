import { City, Department, Establishment, Region } from 'src/app/model';

export interface ClientFilterInterface {
    step: number;
    region: Region;
    department: Department;
    city: City;
    establishment: Establishment;
}
