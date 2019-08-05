import { Component, OnInit } from '@angular/core';
import { VrcService } from 'src/app/shared/services/vrc.service';
import { LrcService } from 'src/app/shared/services/lrc.service';
import { CrcService } from 'src/app/shared/services/crc.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Router } from '@angular/router';

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
  windowData = 0;
  timer: any;

  constructor( private vrc: VrcService,
               private lrc: LrcService,
               private crc: CrcService,
               private router: Router,
               private communicationService: CommunicationService ) {
                this.config = this.communicationService.getConfig();
                if (!!!this.config) {
                  alert('No hay configuración predefinida');
                  this.router.navigate(['']);
                } else if (this.config.methodArq === 'LRC') {
                  this.windowData = 4;
                } else if (this.config.methodArq === 'VRC') {
                  this.windowData = 1;
                }
                }

  ngOnInit() {
    this.actualByte = 0;
    this.config = this.communicationService.getConfig();
    this.timer = setInterval(() => {
      this.tmpBytes = [];
    }, 5000);
    this.communicationService.getMessages().subscribe((msg: any) => {
      console.log(msg);
      if (msg.code === 400 && !this.shutdown) {
        if (this.config.methodArq === 'LRC') {
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
        } else if (this.config.methodArq === 'VRC') {
          if ( this.vrc.check(msg.data) ) {
            this.messages.push('Trama verificada, enviando ACK.');
            this.bytes.push(this.vrc.convertToNumberArray(msg.data));
            setTimeout(() => {
              this.communicationService.sendMessage(true);
            }, 1000);
          } else {
            this.messages.push('Error en la trama, enviando NACK.');
            setTimeout(() => {
              this.communicationService.sendMessage(false);
            }, 1000);
          }
        }
      }
    }, error => {
      console.log(error);
    });
  }

  getMessage() {
    if (this.config.methodArq === 'LRC') {
      const msg: number[] = this.bytes.map((arr: number[]) => parseInt(arr.join(''), 2));
      return String.fromCharCode(...msg);
    } else if (this.config.methodArq === 'VRC') {
      const msg = this.bytes.map((arr: number[]) => parseInt(arr.slice(0, arr.length - 1).join(''), 2));
      return String.fromCharCode(...msg);
    }
  }


}
