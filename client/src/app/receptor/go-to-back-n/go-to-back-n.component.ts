import { Component, OnInit } from '@angular/core';
import { VrcService } from 'src/app/shared/services/vrc.service';
import { LrcService } from 'src/app/shared/services/lrc.service';
import { CrcService } from 'src/app/shared/services/crc.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';

@Component({
  selector: 'app-go-to-back-n',
  templateUrl: './go-to-back-n.component.html',
  styleUrls: ['./go-to-back-n.component.scss']
})
export class GoToBackNComponent implements OnInit {

  actualByte = 0;
  tmpBytes: number[][] = [];
  bytes: number[][] = [];
  messages = [];
  shutdown = false;
  config: any;
  timer: any;

  constructor( private vrc: VrcService,
               private lrc: LrcService,
               private crc: CrcService,
               private communicationService: CommunicationService ) { }

  ngOnInit() {
    this.actualByte = 0;
    this.config = this.communicationService.getConfig();
    this.timer = setInterval(() => {
      this.tmpBytes = [];
    }, 5000);
    this.communicationService.getMessages().subscribe((msg: any) => {
      console.log(msg);
      if (msg.code === 400 && !this.shutdown) {
        if (this.tmpBytes.length === 3) {
          if ( this.lrc.check([...this.tmpBytes, this.lrc.convertToNumberArray(msg.data)]) ) {
            this.tmpBytes = this.tmpBytes.filter(p => p.join('') !== '11111111');
            this.messages.push('Trama verificada, enviando ACK.');
            this.bytes = [...this.bytes, ...this.tmpBytes];
            this.tmpBytes = [];
            setTimeout(() => {
              this.communicationService.sendMessage(true);
            }, 1000);
          } else {
            this.messages.push('Error en la trama, enviando NACK.');
            setTimeout(() => {
              this.communicationService.sendMessage(false);
              this.tmpBytes = [];
            }, 1000);
          }
        } else {
          if (this.actualByte === 0) {
            this.messages.push('Inicio de comunicación.');
          }
          this.tmpBytes.push(this.lrc.convertToNumberArray(msg.data));
          this.actualByte++;
          this.messages.push('Trama recibida ... esperando verificación');
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getMessage() {
    const msg: number[] = this.bytes.map((arr: number[]) => parseInt(arr.join(''), 2));
    return String.fromCharCode(...msg);
  }


}
