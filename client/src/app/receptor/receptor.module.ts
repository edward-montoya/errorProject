import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptorRoutingModule } from './receptor-routing.module';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from '../shared/shared.module';
import { VrcLrcComponent } from './vrc-lrc/vrc-lrc.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HammingComponent } from './hamming/hamming.component';
import { StopAndWaitComponent } from './stop-and-wait/stop-and-wait.component';
import { GoToBackNComponent } from './go-to-back-n/go-to-back-n.component';
import {MatCheckboxModule} from '@angular/material/checkbox';




@NgModule({
  declarations: [WaitingRoomComponent, VrcLrcComponent, HammingComponent, StopAndWaitComponent, GoToBackNComponent],
  imports: [
    CommonModule,
    ReceptorRoutingModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    SharedModule,
    FormsModule,
    MatCardModule,
    ScrollingModule,
    MatCheckboxModule
  ]
})
export class ReceptorModule { }
