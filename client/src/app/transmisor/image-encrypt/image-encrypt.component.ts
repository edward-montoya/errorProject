import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-image-encrypt',
  templateUrl: './image-encrypt.component.html',
  styleUrls: ['./image-encrypt.component.scss']
})
export class ImageEncryptComponent implements OnInit {
  @Output() event = new EventEmitter<string>();
  matrix: number[][];
  state = 6;
  floatLabel = true;

  rows: number;
  cols: number;

  ready = false;

  array: number[];

  showCode = false;
  code = '';

  constructor() {}

  ngOnInit() {}

  setState(state: number) {
    this.state = state;
  }
  setColorMatrix(i: number, j: number) {
    console.log(`i: ${i} - j: ${j}`);
    this.matrix[i][j] = this.state;
  }
  genMatrix() {
    if (!!this.rows && !!this.cols && this.cols * this.rows <= 64) {
      this.matrix = new Array(this.rows);
      for (let i = 0; i < this.matrix.length; i++) {
        this.matrix[i] = new Array(this.cols).fill(6);
      }
      this.ready = true;
    } else {
      alert('La matriz debe tener 64 o menos cuadros');
    }
  }
  reStart() {
    this.ready = false;
    this.rows = null;
    this.cols = null;
    this.code = '';
    this.showCode = false;
  }
  /* tslint:disable:no-bitwise */
  genCode() {
    this.code = '';
    let k = 0;
    let iterator = 0;
    this.array = new Array(this.rows * this.cols);
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j <= this.cols; j++) {
        if (iterator === 0 && j === 0 && j < this.cols) {
          this.array[k] = (this.matrix[i][j] << 4) | 1;
          iterator++;
        } else if (
          iterator !== 0 &&
          this.matrix[i][j] === this.matrix[i][j - 1] &&
          j < this.cols
        ) {
          this.array[k]++;
          iterator++;
        } else if (
          this.matrix[i][j] !== this.matrix[i][j - 1] &&
          iterator !== 0 &&
          j < this.cols
        ) {
          [iterator, k] = this.controlSuperior(iterator, k);
          this.array[k] = this.array[k] | iterator;
          k++;
          iterator = 1;
          this.array[k] = (this.matrix[i][j] << 4) | 1;
        } else {
          [iterator, k] = this.controlSuperior(iterator, k);
          this.array[k] = this.array[k] | iterator;
          k++;
        }
      }
      this.array[k] = 128;
      iterator = 0;
      k++;
    }

    for (const character of this.array) {
      if (!!character) {
        this.code += String.fromCharCode(character);
      }
    }
    console.log(this.array);
    this.event.emit(this.code);
  }
  /* tslint:disable:no-bitwise */
  in_parallel(v: number) {
    v ^= v >> 16;
    v ^= v >> 8;
    v ^= v >> 4;
    v &= 0xf;
    return (0x6996 >> v) & 1;
  }
  /* tslint:enable:no-bitwise */

  /* tslint:disable:no-bitwise */
  controlSuperior(iteration: number, position: number): any {
    if (iteration > 15) {
      const simbol = this.array[position] - iteration;
      iteration -= 15;
      do {
        this.array[position] = simbol | 0x0f;
        iteration -= 15;
        position++;
        this.array[position] = simbol;
      } while (iteration > 0);
      iteration += 15;
      return [iteration, position];
    } else {
      return [iteration, position];
    }
  }
  /* tslint:enable:no-bitwise */
  blank() {
    this.code = '';
    this.showCode = false;
    this.matrix = new Array(this.rows);
    for (let i = 0; i < this.matrix.length; i++) {
      this.matrix[i] = new Array(this.cols).fill(6);
    }
  }
}
