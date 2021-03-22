import { User } from '../model';

export interface AuthResponseInterface {
    user: User;
    jwt: string;
}
