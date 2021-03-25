import { Injectable } from '@angular/core';

import { PermissionInterface, AuthResponseInterface } from 'src/app/interface';
import { Role, Feature, Permission } from '../enum';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly roles = [
    {
      name: Role.REH,
      featurePermissions: [
        { feature: Feature.Client, permissions: [Permission.Manage] }
      ]
    },
    {
      name: Role.GEH,
      featurePermissions: [
        { feature: Feature.Client, permissions: [Permission.Read] }
      ]
    },
    {
      name: Role.PP,
      featurePermissions: [
        { feature: Feature.Client, permissions: [Permission.Read] }
      ]
    },
    {
      name: Role.DDMT,
      featurePermissions: [
        { feature: Feature.Client, permissions: [Permission.Read] }
      ]
    },
    {
      name: Role.DRMT,
      featurePermissions: [
        { feature: Feature.Client, permissions: [Permission.Read] }
      ]
    },
    {
      name: Role.DSMT,
      featurePermissions: [
        { feature: Feature.Client, permissions: [Permission.Read] }
      ]
    },
    {
      name: Role.SMI,
      featurePermissions: [
        { feature: Feature.Client, permissions: [Permission.Manage] }
      ]
    },
    {
      name: Role.ADMIN,
      featurePermissions: [
        { feature: Feature.City, permissions: [Permission.Manage] },
        { feature: Feature.Client, permissions: [Permission.Read, Permission.Update] },
        { feature: Feature.Establishment, permissions: [Permission.Manage] },
        { feature: Feature.User, permissions: [Permission.Manage] }
      ]
    }
  ];
  permission: PermissionInterface = {
    create: false,
    read: false,
    update: false,
    delete: false
  };

  constructor() {}

  setCredential(data: AuthResponseInterface): void {
    localStorage.setItem('credential', JSON.stringify(data));
  }

  getCredential(): AuthResponseInterface {
    return JSON.parse(localStorage.getItem('credential'));
  }

  logout(): void {
    localStorage.clear();
  }

  checkPermission(feature: string, permission: Permission): boolean {
    const user = this.getCredential()?.user;
    const userRole = this.roles.find(p => p.name === user.role);
    if (userRole) {
      const userFeature = userRole.featurePermissions.find(p => p.feature === feature);
      if (userFeature) {
        if (userFeature.permissions.includes(Permission.Manage)) { return true; }
        else if (userFeature.permissions.includes(permission)) { return true; }
      }
    }
    return false;
  }

  permissions(feature: string): void {
    this.permission.create = this.checkPermission(feature, Permission.Create);
    this.permission.read = this.checkPermission(feature, Permission.Read);
    this.permission.update = this.checkPermission(feature, Permission.Update);
    this.permission.delete = this.checkPermission(feature, Permission.Delete);
  }

}
