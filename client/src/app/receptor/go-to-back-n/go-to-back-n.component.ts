import { Component, OnInit, OnDestroy } from '@angular/core';
import { VrcService } from 'src/app/shared/services/vrc.service';
import { LrcService } from 'src/app/shared/services/lrc.service';
import { CrcService } from 'src/app/shared/services/crc.service';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-go-to-back-n',
  templateUrl: './go-to-back-n.component.html',
  styleUrls: ['./go-to-back-n.component.scss']
})
export class GoToBackNComponent implements OnInit, OnDestroy {
  actualByte = 0;
  tmpBytes: number[][] = [];
  bytes: number[][] = [];
  messages = [];
  shutdown = false;
  config: any;
  windowData = 0;
  watchDog = 5;
  timer: any;
  unsuscribe: Subject<boolean> = new Subject<boolean>();
  matrix: any = [[]];
  row = 0;
  column = 0;

  constructor(
    private vrc: VrcService,
    private lrc: LrcService,
    private crc: CrcService,
    private router: Router,
    private communicationService: CommunicationService
  ) {
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

  // tslint:disable: no-bitwise
  ngOnInit() {
    this.actualByte = 0;
    this.config = this.communicationService.getConfig();
    this.shutdown = false;
    this.timer = setInterval(() => {
      this.watchDog--;
      if (this.watchDog === 0) {
        this.tmpBytes = [];
      }
    }, 1000);
    this.communicationService
      .getMessages()
      .pipe(takeUntil(this.unsuscribe))
      .subscribe(
        (msg: any) => {
          console.log(msg);
          if (msg.code === 400 && !!!this.shutdown) {
            this.watchDog = 5;
            if (this.config.methodArq === 'LRC') {
              if (this.tmpBytes.length === 3) {
                if (
                  this.lrc.check([
                    ...this.tmpBytes,
                    this.lrc.convertToNumberArray(msg.data)
                  ])
                ) {
                  this.tmpBytes = this.tmpBytes.filter(
                    p => p.join('') !== '11111111'
                  );
                  if (this.config.infoType === 'image') {
                    this.tmpBytes
                      .map(e => e.join(''))
                      .forEach(f => {
                        if (f === '10000000') {
                          this.row++;
                          this.matrix[this.row] = new Array();
                        } else {
                          const n = parseInt(f, 2);
                          const size = n & 0x0f;
                          for (let i = 0; i < size; i++) {
                            this.matrix[this.row].push((n & 0xf0) >> 4);
                          }
                          console.log(this.matrix);
                        }
                      });
                  }
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
              if (this.vrc.check(msg.data)) {
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
          } else if (msg.state === 'error' && msg.code === 104) {
            alert('Se desconecto el transmisor');
            this.router.navigate(['']);
          }
        },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.unsuscribe.next(true);
    this.unsuscribe.unsubscribe();
  }

  getMessage() {
    if (this.config.methodArq === 'LRC') {
      const msg: number[] = this.bytes.map((arr: number[]) =>
        parseInt(arr.join(''), 2)
      );
      return String.fromCharCode(...msg);
    } else if (this.config.methodArq === 'VRC') {
      const msg = this.bytes.map((arr: number[]) =>
        parseInt(arr.slice(0, arr.length - 1).join(''), 2)
      );
      return String.fromCharCode(...msg);
    }
  }
}
