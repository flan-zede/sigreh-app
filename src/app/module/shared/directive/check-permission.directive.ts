import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { Feature, Permission } from 'src/app/enum';
import { AuthService } from 'src/app/service';

@Directive({
  selector: '[appCheckPermission]'
})
export class CheckPermissionDirective implements OnInit {

  @Input() appFeature: Feature;
  @Input() appPermission: Permission;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    if (this.auth.checkPermission(this.appFeature, this.appPermission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainer.clear();
    }
  }

}
