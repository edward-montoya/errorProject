import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-waiting-room',
  templateUrl: './waiting-room.component.html',
  styleUrls: ['./waiting-room.component.scss']
})
export class WaitingRoomComponent implements OnInit, OnDestroy {

  constructor(private transmisorService: CommunicationService, private router: Router) { }

  response: any;
  private unsubscribe: Subject<void> = new Subject();
  ready = false;
  message = 'Esperando transmisor';

  ngOnInit() {
    this.transmisorService.deviceReady('Receptor');
    this.transmisorService.getMessages().pipe(takeUntil(this.unsubscribe))
    .subscribe((msg: any) => {
      if (msg.state === 'control' && msg.code === 200) {
        this.message = 'Esperando configuración para inicio de comunicación';
      } else if (msg.state === 'control' && msg.code === 600) {
        const data = msg.data;
        if (data.transmisionType === 'FEC') {
          if (data.controlFec === 'VRC-LRC') {
            this.router.navigate(['receptor/vrc-lrc']);
          } else if (data.controlFec === 'HAM') {
            this.router.navigate(['receptor/hamming']);
          }
        }
      } else if (msg.state === 'error' && msg.code === 104) {
        alert('Se desconecto el transmisor');
        this.message = 'Esperando transmisor';
      }
    }, error => {
      console.log('Error en la comunicación ');
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
