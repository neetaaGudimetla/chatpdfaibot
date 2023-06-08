import { Pipe, PipeTransform } from '@angular/core';
//import undefined = require('firebase/empty-import');

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], filteredStatus: string): any[] {
    console.log(filteredStatus);
    if (!items) return [];
    if (!filteredStatus) return items;
    filteredStatus = filteredStatus.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(filteredStatus);
    });
  }


}
