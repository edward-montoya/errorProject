import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
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
export class GoToBackNComponent implements OnInit, OnDestroy {
  dataForm: FormGroup;
  coding = false;
  config: any;
  bytes: number[][] = [];
  errorInBytes: number[][] = [];
  actualByte = 0;
  messages = [];
  count = 10;
  timer: any;
  state = 0;
  sended = false;
  waiting = false;
  lastByte = 0;
  resend = 0;
  unsuscribe: Subject<boolean> = new Subject<boolean>();
  windowData = 0;

  constructor(
    private vrc: VrcService,
    private lrc: LrcService,
    private crc: CrcService,
    private communicationService: CommunicationService,
    private fb: FormBuilder,
    private router: Router
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

    this.dataForm = this.fb.group({
      text: ['', [Validators.required]]
    });
  }

  codeImage($event: string) {
    this.dataForm.get('text').setValue($event);
    this.code();
  }

  code() {
    if (this.dataForm.valid) {
      if (this.config.methodArq === 'LRC') {
        console.log(this.dataForm.get('text').value);
        this.coding = true;
        this.bytes = this.lrc.encode(this.dataForm.get('text').value);
        console.log(this.bytes);
        this.blank();
      } else {
        this.coding = true;
        this.bytes = this.vrc.encode(this.dataForm.get('text').value);
        console.log(this.bytes);
        this.blank();
      }
    }
  }

  getMessage() {
    if (this.state === 0) {
      return 'PENDIENTE DE ENVIO.';
    } else if (this.state === 1) {
      return 'ENVIANDO';
    } else if (this.state === 2) {
      return 'ESPERANDO RESPUESTA';
    } else if (this.state === 3) {
      return 'TERMINADO.';
    }
  }

  blank() {
    this.errorInBytes = new Array(this.bytes.length);
    for (let i = 0; i < this.errorInBytes.length; i++) {
      this.errorInBytes[i] = new Array(9).fill(0);
    }
  }

  sendMessage() {
    this.send();
    this.state = 1;
    this.messages.unshift('Inicio de comunicación');
    this.timer = setInterval(() => {
      this.count--;
      if (this.count === 0) {
        this.count = 10;
        this.actualByte = this.lastByte;
        this.messages.push('Reenviando trama...');
        this.resend++;
        if (this.resend >= 4) {
          clearInterval(this.timer);
          alert('Conexión perdida. Volviendo a pagina principal');
          this.router.navigate(['transmisor']);
        } else {
          this.send();
        }
      }
    }, 1000);
  }

  send() {
    if (this.actualByte <= this.bytes.length) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          this.sended = true;
          this.messages.push(`Trama ${this.actualByte} enviada`);
          this.communicationService.sendMessage(
            this.bytes[this.actualByte].join('')
          );
          this.actualByte++;
          if (i === 4) {
            this.sended = false;
            this.state = 2;
          }
        }, 1000 * i);
      }
    } else {
      clearInterval(this.timer);
    }
  }

  setState(i: number, j: number) {
    this.errorInBytes[i][j] = !this.errorInBytes[i][j] ? 1 : 0;
    this.bytes[i][j] = !this.bytes[i][j] ? 1 : 0;
  }

  ngOnInit() {
    this.actualByte = 0;
    this.count = 10;
    this.state = 0;
    this.sended = false;
    this.waiting = false;
    this.lastByte = 0;
    this.resend = 0;
    clearInterval(this.timer);
    this.communicationService
      .getMessages()
      .pipe(takeUntil(this.unsuscribe))
      .subscribe(
        (msg: any) => {
          if (msg.code === 400) {
            console.log(msg);
            if (msg.data) {
              this.lastByte = this.actualByte;
              this.messages.push('Respuesta recibida ACK');
              this.count = 10;
              this.state = 1;
              if (this.actualByte >= this.bytes.length) {
                clearInterval(this.timer);
                this.messages.push('Final de trasmisión');
                this.actualByte = 0;
                this.count = 10;
                this.state = 3;
                this.sended = false;
                this.waiting = false;
                this.lastByte = 0;
                this.resend = 0;
                return;
              }
            } else {
              this.messages.push('Respuesta recibida NACK');
              this.count = 10;
              this.actualByte = this.lastByte;
              this.state = 1;
            }
            this.send();
          } else if (msg.state === 'error' && msg.code === 104) {
            alert('Se desconecto el receptor');
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
}
