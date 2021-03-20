import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(items: any[], search: string): any[] {
    if (!items) { return []; }
    if (!search) { return items; }

    return items.filter(item => {
      return Object.keys(item).some(key => {
        return String(item[key]).toLowerCase().includes(search.toLowerCase());
      });
    });
  }
}
