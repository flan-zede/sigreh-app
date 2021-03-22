import { Component, Output, EventEmitter, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { RouteInterface } from 'src/app/interface';

@Component({
  selector: 'app-paginator',
  template: `
    <div class='row'>
      <div class='col-lg-12'>
        <mat-paginator
          (page)='handlePageEvent($event)'
          [length]='route.page.length'
          [pageSize]='route.page.size'
          [showFirstLastButtons]='route.page.showFirstLastButtons'
          [pageSizeOptions]='route.page.sizeOptions'
          [pageIndex]='route.page.index'>
        </mat-paginator>
      </div>
    </div>
  `
})
export class PaginatorComponent {

  @Input() route: RouteInterface;
  @Output() paginate = new EventEmitter<RouteInterface>();

  handlePageEvent(event: PageEvent): void {
    this.route.page.length = event.length ? event.length : 1;
    this.route.page.size = event.pageSize ? event.pageSize : 10;
    this.route.page.index = event.pageIndex ? event.pageIndex : 1;
    this.paginate.emit(this.route);
  }

}
