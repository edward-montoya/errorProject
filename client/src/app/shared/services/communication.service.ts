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
  private type: any;
  private config: any;

  constructor() {
    this.socket = io(this.url);
  }

  public deviceReady(type: string) {
    this.type = type;
    const data: Data = {control: true, state: 'request', code: 601, data: type, id: undefined};
    this.socket.emit('communication', JSON.stringify(data));
  }

  public sendConfig(config: any) {
    this.config = config;
    const data: Data = {control: true, state: 'request', code: 600, data: config, id: undefined};
    this.socket.emit('communication', JSON.stringify(data));
  }

  public sendMessage(message: any) {
    const data: Data = {control: false, state: 'request', code: 400, data: message, id: this.id};
    this.socket.emit('communication', JSON.stringify(data));
  }

  public getId() {
    return this.id;
  }

  public getType() {
    return this.type;
  }

  public setConfig(config: any) {
    this.config = config;
  }

  public getConfig() {
    return this.config;
  }

  public getMessages() {
    return new Observable((observer) => {
        this.socket.on('communication', (message: any) => {
            const msg: Data = JSON.parse(message);
            console.log(msg);
            if (!!msg.state && msg.state === 'error') {
              observer.next(msg);
            } else if (!!msg.state && msg.state === 'control') {
              this.id = msg.id;
              observer.next(msg);
            } else {
              observer.next(msg);
            }
        });
    });
  }
}
