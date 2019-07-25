import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  transform(value: any): any {
    return this.reverseString(value);
  }

  reverseString(str: string): string {
    return str.split('').reverse().join('');
  }

}
