import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransmisorRoutingModule } from './transmisor-routing.module';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigComponent } from './config/config.component';
import {MatInputModule} from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { VrcLrcComponent } from './vrc-lrc/vrc-lrc.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { HammingComponent } from './hamming/hamming.component';
import {MatIconModule} from '@angular/material/icon';
import { StopAndWaitComponent } from './stop-and-wait/stop-and-wait.component';




@NgModule({
  declarations: [WaitingRoomComponent, ConfigComponent, VrcLrcComponent, HammingComponent, StopAndWaitComponent],
  imports: [
    CommonModule,
    TransmisorRoutingModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatInputModule,
    ReactiveFormsModule,
    SharedModule,
    MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    ScrollingModule,
    MatIconModule
  ]
})
export class TransmisorModule { }
