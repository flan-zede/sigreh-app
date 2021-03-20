import { Client } from './client.model';

export class Partner {
  id: number;
  gender: string;
  name: string;
  age: string;
  ClientId: number;
  Client: Client;
}
