import { Component, Output, EventEmitter, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PageInterface } from 'src/app/interface';

@Component({
  selector: 'app-paginator',
  template: `
    <div class='row'>
      <div class='col-lg-12'>
        <mat-paginator
          (page)='handlePageEvent($event)'
          [length]='page.length'
          [pageSize]='page.size'
          [showFirstLastButtons]='page.showFirstLastButtons'
          [pageSizeOptions]='page.sizeOptions'
          [pageIndex]='page.index'>
        </mat-paginator>
      </div>
    </div>
  `
})
export class PaginatorComponent {

  @Input() page: PageInterface;
  @Output() paginate = new EventEmitter<PageInterface>();

  handlePageEvent(event: PageEvent): void {
    this.page.length = event.length ? event.length : 1;
    this.page.size = event.pageSize ? event.pageSize : 10;
    this.page.index = event.pageIndex ? event.pageIndex : 1;
    this.paginate.emit(this.page);
  }

}
