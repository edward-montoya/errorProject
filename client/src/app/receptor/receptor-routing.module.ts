import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { VrcLrcComponent } from './vrc-lrc/vrc-lrc.component';
import { HammingComponent } from './hamming/hamming.component';

const routes: Routes = [
  { path: '', component: WaitingRoomComponent },
  { path: 'vrc-lrc', component: VrcLrcComponent },
  { path: 'hamming', component: HammingComponent },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceptorRoutingModule { }
