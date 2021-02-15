import { User } from 'src/app/model/user.model';

export interface AuthResponseInterface {
  user: User;
  jwt: string;
}
