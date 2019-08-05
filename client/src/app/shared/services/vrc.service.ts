import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VrcService {

  constructor() { }

  encode(array: string): number[][] {
    const bytes: number[][] = [];
    let tmp: number[] = [];
    for (const char of array) {
      if (!!char) {
        const charCode: number = char.charCodeAt(0);
        const v = this.pad(charCode.toString(2)) ;
        const parity = this.in_parallel(charCode);
        for (const bit of v) {
          if (!!bit) {
            tmp.push( parseInt(bit, 10) );
          }
        }
        tmp.push(parity);
        bytes.push(tmp);
        tmp = [];
      }
    }
    return bytes;
  }

  convertToNumberArray(array: string): number[] {
    const bytes = [];
    const v = this.pad(array) ;
    for (const bit of v) {
      if (!!bit) {
        bytes.push( parseInt(bit, 10) );
      }
    }
    return bytes;
  }

  check(array: string) {
    const parity = parseInt(array.substring( array.length - 1, array.length), 10);
    return (parity === this.in_parallel(parseInt(array.substring(0, array.length - 1), 2)));
  }

  pad(num: string, size: number = 8) {
    const s = '0000000' + num;
    return s.substr(s.length - size);
  }

  // tslint:disable: no-bitwise
  in_parallel(v: number) {
    v ^= v >> 16;
    v ^= v >> 8;
    v ^= v >> 4;
    v &= 0xf;
    return (0x6996 >> v) & 1;
  }

}
