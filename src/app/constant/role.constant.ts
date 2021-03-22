import { Role } from '../enum';
import { SelectItemsInterface } from '../interface';

export const ROLE: SelectItemsInterface[] = [
    { id: Role.REH, name: 'Receptionist d\'etablissement hotelier' },
    { id: Role.GEH, name: 'Gerant d\'etablissement hotelier' },
    { id: Role.PP, name: 'Responsable de Préfecture de police' },
    { id: Role.DDMT, name: 'Directeur départementale du ministère du tourisme' },
    { id: Role.DRMT, name: 'Directeur régionale du ministère du tourisme' },
    { id: Role.DSMT, name: 'Directeur de la statistique du ministère du tourisme' },
    { id: Role.SMI, name: 'Responsable sureté, ministère de l\'interieur' },
    { id: Role.ADMIN, name: 'Administrateur' }
];
