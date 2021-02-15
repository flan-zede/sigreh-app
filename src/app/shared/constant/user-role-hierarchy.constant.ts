import { UserRoleEnum } from '../enum/user-role.enum';

export const USER_ROLE_HIERARCHY = {
  REH: [UserRoleEnum.REH],
  GEH: [UserRoleEnum.GEH, UserRoleEnum.REH, UserRoleEnum.PP, UserRoleEnum.DDMT, UserRoleEnum.DRMT, UserRoleEnum.DSMT, UserRoleEnum.SMI, UserRoleEnum.ADMIN],
  PP: [UserRoleEnum.PP, UserRoleEnum.DDMT, UserRoleEnum.DRMT, UserRoleEnum.DSMT, UserRoleEnum.SMI, UserRoleEnum.ADMIN],
  DDMT: [UserRoleEnum.DDMT, UserRoleEnum.DRMT, UserRoleEnum.DSMT, UserRoleEnum.SMI, UserRoleEnum.ADMIN],
  DRMT: [UserRoleEnum.DRMT, UserRoleEnum.DSMT, UserRoleEnum.SMI, UserRoleEnum.ADMIN],
  DSMT: [UserRoleEnum.DSMT, UserRoleEnum.SMI, UserRoleEnum.ADMIN],
  SMI: [UserRoleEnum.SMI, UserRoleEnum.ADMIN],
  ADMIN: [UserRoleEnum.ADMIN],
};
