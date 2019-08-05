import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { ConfigComponent } from './config/config.component';
import { VrcLrcComponent } from './vrc-lrc/vrc-lrc.component';
import { HammingComponent } from './hamming/hamming.component';
import { StopAndWaitComponent } from './stop-and-wait/stop-and-wait.component';

const routes: Routes = [
  { path: '', component: WaitingRoomComponent },
  { path: 'config', component: ConfigComponent },
  { path: 'vrc-lrc', component: VrcLrcComponent },
  { path: 'hamming', component: HammingComponent },
  { path: 'stop-and-wait', component: StopAndWaitComponent },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransmisorRoutingModule { }
