import { MenuItemInterface } from 'src/app/shared/interface/menu-item.interface';
import { USER_ROLE_HIERARCHY } from './user-role-hierarchy.constant';

export const MENU_ITEM: MenuItemInterface[] = [
  { route: '/user', name: 'user', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
  { route: '/city', name: 'city', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
  { route: '/client', name: 'client', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.GEH },
  { route: '/department', name: 'department', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
  { route: '/district', name: 'district', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
  { route: '/establishment', name: 'establishment', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
  { route: '/region', name: 'region', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN },
  { route: '/subprefecture', name: 'subprefecture', icon: '', disabled: null, roles: USER_ROLE_HIERARCHY.ADMIN }
];
