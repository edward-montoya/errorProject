import { Component, OnInit } from '@angular/core';
import { CommunicationService } from 'src/app/shared/services/communication.service';

@Component({
  selector: 'app-vrc-lrc',
  templateUrl: './vrc-lrc.component.html',
  styleUrls: ['./vrc-lrc.component.scss']
})
export class VrcLrcComponent implements OnInit {

  constructor(private transmisorService: CommunicationService) { }

  messages: string[] = [];
  message: string;

  ngOnInit() {
    this.transmisorService.getMessages()
    .subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  sendMessage() {
    this.transmisorService.sendMessage(this.message);
    this.message = '';
  }


}
