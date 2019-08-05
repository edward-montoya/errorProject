import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import * as hammingCode from 'hamming-code/index';

@Component({
  selector: 'app-hamming',
  templateUrl: './hamming.component.html',
  styleUrls: ['./hamming.component.scss']
})
export class HammingComponent implements OnInit {

  bytes: number[][] = [];
  errors: number[][] = [];
  characters: string[];
  noData: number[] = [];
  message = '';
  waiting = false;

  constructor(private communicationService: CommunicationService) { }

  // tslint:disable: no-bitwise
  ngOnInit() {
    this.communicationService.getMessages().subscribe((msg: any) => {
      if (msg.code === 400) {
        alert('ENTRO MENSAJE');
        this.errors = [];
        this.message = '';
        const data = msg.data.split('-');
        this.characters = data;
        this.blank();
        const tmp: number[][] = [];
        let i = 0;
        data.forEach((element: string) => {
          const p1 = this.in_parallel(parseInt(element[0] + element[2] + element[4] +
            element[6] + element[8] + element[10], 2));
          const p2 = this.in_parallel(parseInt(element[1] + element[2] + element[5] +
             element[6] + element[9] + element[10], 2));
          const p3 = this.in_parallel(parseInt(element[3] + element[4] + element[5] +
             element[6] + element[11], 2));
          const p4 = this.in_parallel(parseInt(element[7] + element[8] + element[9] +
             element[10] + element[11], 2));
          const error = parseInt(`${p4}${p3}${p2}${p1}`, 2);
          const arrayNum: number[] = element.split('').map((char: string) => parseInt(char, 10));
          if (error > 0 && error < 12) {
            this.errors[i][error - 1] = 1;
            // tslint:disable-next-line: triple-equals
            this.characters[i] = this.characters[i].substring(0, error - 1) + `${ (this.characters[i][error - 1] == '1')  ? 0 : 1}` +
            this.characters[i].substring(error , this.characters[i].length);
          }
          if (error > 11) {
            this.noData.push(error - 1);
          }
          tmp.push(arrayNum);
          i++;
        });
        this.bytes = tmp;
        if (this.noData.length > 0) {
          alert('No fue posible recuperar todos los caracteres.');
        }
        this.characters.map((char: string) => char[2] +  char[4] +  char[5] +
         char[6] +  char[8] +  char[9] + char[10] + char[11]).forEach((char: string) => {
          this.message = this.message + String.fromCharCode(parseInt(char, 2));
        });
        this.waiting = true;
      }
    }, error => {

    });
  }

  blank() {
    this.errors = new Array(this.characters.length);
    for (let i = 0; i < this.characters.length; i++) {
      this.errors[i] = new Array(12).fill(0);
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
