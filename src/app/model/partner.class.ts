import { Client } from './client.class';

export class Partner {
  id: number;
  gender: string;
  name: string;
  age: string;
  clientId: number;
  client: Client;
}
