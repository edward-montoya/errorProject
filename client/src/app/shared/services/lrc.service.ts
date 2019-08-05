import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LrcService {

  constructor() { }

  encode(array: string): number[][] {
    let tmp = [];
    for (let i = 0 ; i < array.length ; i += 3) {
      if (tmp.length > 0) {
        const y = i + 3 ;
        if (array.length % 3 > 0 && y > array.length) {
          let p = array.slice(3 * Math.floor(array.length / 3), array.length);
          for (let j = 0 ; j <  3 - (array.length - 3 * Math.floor(array.length / 3)) ; j++  ) {
             p = p + String.fromCharCode(255);
          }
          tmp = [...tmp, ...(this.controlArray(p))];
        } else {
          tmp = [...tmp, ...(this.controlArray(array.slice(i, i + 3)))];
        }
      } else {
        tmp = this.controlArray(array.slice(i, i + 3));
      }
    }
    return tmp;
  }

  controlArray(array: string): number[][] {
    const bytes: number[][] = [];
    let tmp: number[] = [];
    for (const char of array) {
      if (!!char) {
        const charCode: number = char.charCodeAt(0);
        const v = this.pad(charCode.toString(2)) ;
        for (const bit of v) {
          if (!!bit) {
            tmp.push( parseInt(bit, 10) );
          }
        }
        bytes.push(tmp);
        tmp = [];
      }
    }
    return this.getLrc(bytes);
  }

  getLrc(array: number[][]): number[][] {
    let counter: number[] = array[0].map(c => 0);
    array.forEach((data: number[]) => {
      for (let i = 0 ; i < data.length ; i++) {
        counter[i] = counter[i] + data[i];
      }
    });
    counter = counter.map((n) => n % 2);
    array.push(counter);
    return array;
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

  check(array: number[][]) {
    let returnValue = true;
    let counter: number[] = array[0].map(c => 0);
    array.forEach((data: number[]) => {
      for (let i = 0 ; i < data.length ; i++) {
        counter[i] = counter[i] + data[i];
      }
    });
    counter = counter.map((n) => n % 2);
    counter.forEach((n) => {
      if (n === 1) {
        returnValue = false;
      }
     });
    return returnValue;
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
