import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { CommunicationService } from './services/communication.service';

@NgModule({
  declarations: [NotFoundComponent],
  providers: [CommunicationService],
  exports: [NotFoundComponent],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
