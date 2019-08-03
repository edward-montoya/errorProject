import { Injectable } from '@angular/core';
import { Data } from '../helpers/data';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  private url = 'http://localhost:3000';
  private socket: any;
  private id: any;

  constructor() {
    this.socket = io(this.url);
  }

  public deviceReady(type: string) {
    const data: Data = {control: true, ctrlMessage: type, message: undefined, id: undefined};
    this.socket.emit('communication', JSON.stringify(data));
  }

  public sendMessage(message) {
    this.socket.emit('communication', message);
  }

  public getId() {
    return this.id;
  }

  public getMessages() {
    return new Observable((observer) => {
        this.socket.on('communication', (message: any) => {
            const msg = JSON.parse(message);
            if (!!msg.state && msg.state === 'error') {
              observer.error(msg);
            } else if (!!msg.state && msg.state === 'control') {
              this.id = msg.data.id;
              observer.next(msg);
            } else {
              observer.next(msg.data);
            }
        });
    });
  }
}
