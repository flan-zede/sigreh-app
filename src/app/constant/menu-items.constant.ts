import { Feature } from '../enum';
import { MenuItemsInterface } from '../interface';

export const MENU_ITEMS: MenuItemsInterface[] = [
    { path: Feature.Client, name: Feature.Client, icon: '', selected: false },
    { path: Feature.User, name: Feature.User, icon: '', selected: false },
    { path: Feature.City, name: Feature.City, icon: '', selected: false },
    { path: Feature.Establishment, name: Feature.Establishment, icon: '', selected: false },
];
