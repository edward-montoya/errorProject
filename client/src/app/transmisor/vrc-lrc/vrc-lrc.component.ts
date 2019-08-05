import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-vrc-lrc',
  templateUrl: './vrc-lrc.component.html',
  styleUrls: ['./vrc-lrc.component.scss']
})
export class VrcLrcComponent implements OnInit, OnDestroy {
  dataForm: FormGroup;
  coding = false;
  config: any;
  bytes: number[][] = [];
  errorInBytes: number[][] = [];
  counter = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  unsuscribe: Subject<boolean> = new Subject<boolean>();

  constructor(
    private communicationService: CommunicationService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.config = this.communicationService.getConfig();
    if (!!!this.config) {
      alert('No hay configuración predefinida');
      this.router.navigate(['']);
    }
    this.dataForm = this.fb.group({
      text: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.communicationService
      .getMessages()
      .pipe(takeUntil(this.unsuscribe))
      .subscribe(
        (msg: any) => {
          if (msg.state === 'error' && msg.code === 104) {
            alert('Se desconecto el receptor');
            this.router.navigate(['']);
          }
        },
        error => {
          alert('Error');
          this.router.navigate(['']);
        }
      );
  }

  ngOnDestroy() {
    this.unsuscribe.next(true);
    this.unsuscribe.unsubscribe();
  }

  sendMessage() {
    let msg = '';
    this.bytes.forEach(byte => {
      msg = msg + byte.join('') + '-';
    });
    msg = msg.substring(0, msg.length - 1);
    this.communicationService.sendMessage(msg);
    msg = '';
  }
  // tslint:disable: no-bitwise
  in_parallel(v: number) {
    v ^= v >> 16;
    v ^= v >> 8;
    v ^= v >> 4;
    v &= 0xf;
    return (0x6996 >> v) & 1;
  }

  blank() {
    this.errorInBytes = new Array(this.bytes.length);
    for (let i = 0; i < this.errorInBytes.length; i++) {
      this.errorInBytes[i] = new Array(9).fill(0);
    }
  }

  errors() {
    for (let i = 0; i < this.bytes.length; i++) {
      this.setState(i, Math.floor(Math.random() * 9));
    }
  }

  code() {
    this.bytes = [];
    this.coding = true;
    let i = 0;
    let j = 0;
    let tmp = new Array();
    for (const char of this.dataForm.get('text').value) {
      if (!!char) {
        const charCode: number = char.charCodeAt();
        const parity = this.in_parallel(charCode);
        const v = this.pad(charCode.toString(2)) + parity;
        for (const bit of v) {
          if (!!bit) {
            tmp.push(parseInt(bit, 10));
            j++;
          }
        }
        this.bytes.push(tmp);
        tmp = [];
        i++;
      }
    }
    this.bytes.forEach(byte => {
      let k = 0;
      for (const bit of byte) {
        this.counter[k] = bit ? this.counter[k] + 1 : this.counter[k];
        k++;
      }
    });
    tmp = [];
    this.counter.forEach(num => {
      tmp.push(num % 2);
    });
    this.bytes.push(tmp);
    this.blank();
    this.counter = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  }

  pad(num: string, size: number = 8) {
    const s = '0000000' + num;
    return s.substr(s.length - size);
  }

  setState(i: number, j: number) {
    this.errorInBytes[i][j] = !this.errorInBytes[i][j] ? 1 : 0;
    this.bytes[i][j] = !this.bytes[i][j] ? 1 : 0;
  }
}
