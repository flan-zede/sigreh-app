import { SelectOptionsInterface } from '../interface/select-options.interface';
import { UserRoleEnum } from '../enum/user-role.enum';

export const USER_ROLE: SelectOptionsInterface[] = [
  { value: UserRoleEnum.REH, text: 'Receptionist d\'etablissement hotelier' },
  { value: UserRoleEnum.GEH, text: 'Gerant d\'etablissement hotelier' },
  { value: UserRoleEnum.PP, text: 'Préfecture de police' },
  { value: UserRoleEnum.DDMT, text: 'Direction départementale du ministère du tourisme' },
  { value: UserRoleEnum.DRMT, text: 'Direction régionale du ministère du tourisme' },
  { value: UserRoleEnum.DSMT, text: 'Direction de la statistique du ministère du tourisme' },
  { value: UserRoleEnum.SMI, text: 'Sureté, ministère de l\interieur' },
  { value: UserRoleEnum.ADMIN, text: 'Administrateur' }
];
