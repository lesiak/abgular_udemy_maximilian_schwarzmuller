import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sorted',
  pure: false
})
export class SortedPipe implements PipeTransform {

  transform(value: any, propName: string): any {
    const itemsCopy = [...value];
    return itemsCopy.sort((itemA, itemB) => this.compareByKey(itemA, itemB, propName));
  }

  compareByKey(a: any, b: any, propName: string): number {
    if (a[propName] < b[propName]) {
      return -1;
    } else if (a[propName] > b[propName]) {
      return 1;
    } else {
      return 0;
    }
  }

}
