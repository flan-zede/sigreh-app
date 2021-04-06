import { Feature } from '../enum';
import { MenuItemsInterface } from '../interface';

export const MENU_ITEMS: MenuItemsInterface[] = [
    { path: Feature.Client, name: 'Client', icon: '', selected: false },
    { path: Feature.User, name: 'Utilisateur', icon: '', selected: false },
    { path: Feature.City, name: 'Ville', icon: '', selected: false },
    { path: Feature.Establishment, name: 'Etablissement', icon: '', selected: false },
];
