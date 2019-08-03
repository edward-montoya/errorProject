import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransmisorRoutingModule } from './transmisor-routing.module';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';



@NgModule({
  declarations: [WaitingRoomComponent],
  imports: [
    CommonModule,
    TransmisorRoutingModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    SharedModule
  ]
})
export class TransmisorModule { }
