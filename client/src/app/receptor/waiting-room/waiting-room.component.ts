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
  counter = 0;

  ngOnInit() {
    this.transmisorService.deviceReady('Receptor');
    this.transmisorService.getMessages().pipe(takeUntil(this.unsubscribe))
    .subscribe((msg: any) => {
      console.log(msg);
      if (msg.state === 'control') {
        this.counter++;
        console.log('Esperando transmisor....');
      }
      if (this.counter === 2) {
        this.router.navigate(['receptor/config']);
      }
    }, error => {
      console.log('Error en la comunicación ' + error);
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
