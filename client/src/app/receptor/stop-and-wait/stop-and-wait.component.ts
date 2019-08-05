import { Component, OnInit } from '@angular/core';
import { VrcService } from 'src/app/shared/services/vrc.service';
import { LrcService } from 'src/app/shared/services/lrc.service';
import { CrcService } from 'src/app/shared/services/crc.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stop-and-wait',
  templateUrl: './stop-and-wait.component.html',
  styleUrls: ['./stop-and-wait.component.scss']
})
export class StopAndWaitComponent implements OnInit {

  actualByte = 0;
  tmpBytes: number[][] = [];
  bytes: number[][] = [];
  messages = [];
  shutdown = false;
  config: any;
  windowData = 0;
  timer: any;

  constructor( private vrc: VrcService,
               private router: Router,
               private communicationService: CommunicationService ) {
        this.config = this.communicationService.getConfig();
        if (!!!this.config) {
          alert('No hay configuración predefinida');
          this.router.navigate(['']);
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
    }, error => {
      console.log(error);
    });
  }

  getMessage() {
    const msg = this.bytes.map((arr: number[]) => parseInt(arr.slice(0, arr.length - 1).join(''), 2));
    return String.fromCharCode(...msg);
  }


}
