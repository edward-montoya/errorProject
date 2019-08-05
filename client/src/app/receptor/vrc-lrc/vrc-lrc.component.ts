import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';

@Component({
  selector: 'app-vrc-lrc',
  templateUrl: './vrc-lrc.component.html',
  styleUrls: ['./vrc-lrc.component.scss']
})
export class VrcLrcComponent implements OnInit {

  bytes: number[][] = [];
  errorRows: number[] = [];
  errorCols: number[] = [];
  errors: number[][] = [];
  messageByte: number[][] = [];
  characters: string[] = [];
  counter: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  message = '';
  noData = 0;
  broken = false;
  i  = 0;
  j = 0;

  constructor(private communicationService: CommunicationService, private cr: ChangeDetectorRef) { }

  // tslint:disable: no-bitwise
  ngOnInit() {
    this.communicationService.getMessages().subscribe((msg: any) => {
      if (msg.code === 400) {
        alert('ENTRO MENSAJE');
        this.broken = false;
        this.errors = [];
        this.message = '';
        const data = msg.data.split('-');
        this.characters = data;
        const tmp: number[][] = [];
        data.forEach((element: string) => {
          let k = 0;
          for (const bit of element) {
              this.counter[k] = (parseInt(bit, 10)) ? this.counter[k] + 1 : this.counter[k];
              k++;
          }
          this.errorRows.push( this.in_parallel(parseInt(element, 2)) );
          const arrayNum: number[] = element.split('').map((char: string) => parseInt(char, 10));
          tmp.push(arrayNum);
        });
        const err = [];
        this.counter.forEach(num => {
            err.push(num % 2);
        });
        this.errorCols = err;
        this.bytes = tmp;
        this.blank();
        for (let i = 0 ; i < this.errorRows.length; i++) {
          for (let j = 0 ; j < this.errorCols.length; j++) {
            if (this.errorRows[i] === 1 && this.errorCols[j] === 1) {
              this.errors[i][j] = 1;
              this.i = i;
              this.j = j;
              this.noData++;
            } else {
              this.errors[i][j] = 0;
            }
          }
        }
        if (this.noData > 1) {
          this.broken = true;
          setTimeout(() => {
            alert('El mensaje no se puede recuperar');
          }, 2000);
          return;
        } else if (this.noData === 1) {
          this.broken = false;
          this.characters[this.i] = this.characters[this.i].substring(0, this.j ) +
           // tslint:disable-next-line: triple-equals
           `${ (this.characters[this.i][this.j] == '1')  ? 0 : 1}` +
           this.characters[this.i].substring(this.j + 1 , this.characters[this.i].length);
        }
        for (let i = 0 ; i < this.characters.length - 1 ; i++) {
          this.message = this.message + String.fromCharCode(parseInt(this.characters[i].substring(0, this.characters[i].length - 1), 2));
        }
        this.errorCols = [];
        this.errorRows = [];
        this.counter =  [0, 0, 0, 0, 0, 0, 0, 0, 0];
        console.log(this.errors);
      }
    }, error => {
      console.log(error);
    });
  }

  blank() {
    this.errors = new Array(this.errorRows.length);
    for (let i = 0; i < this.errorRows.length; i++) {
      this.errors[i] = new Array(this.errorCols.length).fill(0);
    }
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
