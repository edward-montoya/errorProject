import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CommunicationService } from 'src/app/shared/services/communication.service';


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

  ngOnInit() {
    this.transmisorService.deviceReady('Transmisor');
    this.transmisorService.getMessages().pipe(takeUntil(this.unsubscribe))
    .subscribe((msg: any) => {
      if (msg.state === 'control' && (msg.code === 201 || msg.code === 200)) {
        this.router.navigate(['transmisor/config']);
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
