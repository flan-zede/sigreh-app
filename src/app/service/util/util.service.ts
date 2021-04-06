import { Injectable } from '@angular/core';
import { ManyToManyInterface } from 'src/app/interface';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  arrayDiff(table: string, old: any, next: any): ManyToManyInterface[] {
    const diff: ManyToManyInterface[] = [];
    let exist = false;
    next.forEach((n: any) => {
      exist = false;
      old.forEach((o: any) => { if (o.id === n.id) { exist = true; } });
      if (exist === false) { diff.push({ table, id: n.id, add: true }); }
    });
    old.forEach((o: any) => {
      exist = false;
      next.forEach((n: any) => { if (o.id === n.id) { exist = true; } });
      if (exist === false) { diff.push({ table, id: o.id, add: false }); }
    });
    return diff;
  }
}
