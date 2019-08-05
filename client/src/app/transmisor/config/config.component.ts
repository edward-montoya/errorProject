import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommunicationService } from 'src/app/shared/services/communication.service';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit, OnDestroy {

  config: FormGroup;
  unsuscribe: Subject<boolean> = new Subject<boolean>();

  constructor(private fb: FormBuilder, private communicationService: CommunicationService, private router: Router) {
    this.config = this.fb.group({
      infoType: ['text', [Validators.required]],
      transmisionType: ['FEC', [Validators.required]],
      methodArq: ['', []],
      controlArq: ['', []],
      controlFec: ['VRC-LRC', []]
    });
   }

  ngOnInit() {
    this.communicationService.getMessages().pipe(takeUntil(this.unsuscribe)).subscribe((msg: any) => {
      console.log(msg);
      if (msg.code === 104) {
        alert('Se desconecto el receptor');
        this.router.navigate(['transmisor']);
      }
    }, error => {

    });
  }
  ngOnDestroy() {
    this.unsuscribe.next(true);
    this.unsuscribe.unsubscribe();
  }

  type() {
    if (this.config.get('methodArq').value === 'FEC') {
      this.config.get('controlFec').setValidators(Validators.required);
      this.config.get('methodArq').clearValidators();
      this.config.get('controlArq').clearValidators();
    } else {
      this.config.get('controlFec').clearValidators();
      this.config.get('methodArq').setValidators(Validators.required);
      this.config.get('controlArq').setValidators(Validators.required);
    }
  }

  send() {
    console.log(this.config);
    if (this.config.valid) {
      if (this.config.get('transmisionType').value === 'FEC') {
        this.communicationService.sendConfig(this.config.value);
        if (this.config.get('controlFec').value === 'VRC-LRC') {
          this.router.navigate(['transmisor/vrc-lrc']);
        } else if (this.config.get('controlFec').value === 'HAM') {
          this.router.navigate(['transmisor/hamming']);
        }
      } else if (this.config.get('transmisionType').value === 'ARQ') {
        this.communicationService.sendConfig(this.config.value);
        if (this.config.get('controlArq').value === 'SW') {
          this.router.navigate(['transmisor/stop-and-wait']);
        }
      }
    }
  }

}
