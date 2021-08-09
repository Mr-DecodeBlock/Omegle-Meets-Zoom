import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if(value.length >10) {
      return value.slice(0,16) + '...'
    }
    return value;
  }

}
