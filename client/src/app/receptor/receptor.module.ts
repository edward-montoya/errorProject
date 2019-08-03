import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceptorRoutingModule } from './receptor-routing.module';
import { WaitingRoomComponent } from './waiting-room/waiting-room.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NotFoundComponent } from '../shared/components/not-found/not-found.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [WaitingRoomComponent],
  imports: [
    CommonModule,
    ReceptorRoutingModule,
    MatProgressSpinnerModule,
    FlexLayoutModule,
    SharedModule
  ]
})
export class ReceptorModule { }
