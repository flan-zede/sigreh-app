import { Component, Output, EventEmitter, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { PageInterface } from 'src/app/interface';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent {

  @Input() page: PageInterface = { index: 1, size: 10, length: 0, sizeOptions: [], showFirstLastButtons: true };
  @Output() paginate = new EventEmitter<PageInterface>();

  handlePageEvent(event: PageEvent): void {
    this.page.length = event.length ? event.length : 1;
    this.page.size = event.pageSize ? event.pageSize : 10;
    this.page.index = event.pageIndex ? event.pageIndex : 1;
    this.paginate.emit(this.page);
  }

}
