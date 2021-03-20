import { Injectable } from '@angular/core';

import { Ability, AbilityBuilder } from '@casl/ability';

import { AuthResponseInterface } from 'src/app/shared/interface';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor() { }

  setCredential(data: AuthResponseInterface): void {
    localStorage.setItem('credential', JSON.stringify(data));
  }

  getCredential(): AuthResponseInterface {
    return JSON.parse(localStorage.getItem('credential'));
  }

  logout(): void {
    localStorage.clear();
  }

  ability(): Ability {
    const user = this.getCredential().user;
    const { can, cannot, rules } = new AbilityBuilder(Ability);
    switch (user.role) {
      case 'REH': can('manage', 'client'); break;
      case 'GEH':
      case 'PP':
      case 'DDMT':
      case 'DRMT':
      case 'DSMT':
      case 'SMI': can('read', 'client'); break;
      case 'ADMIN': {
        can('manage', 'user');
        can('manage', 'city');
        can('read', 'client');
        can('update', 'client');
        can('manage', 'establishment');
      } break;
      default: break;
    }
    return new Ability(rules);
  }

}
