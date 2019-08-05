import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'transmisor',
    loadChildren: './transmisor/transmisor.module#TransmisorModule'
  },
  {
    path: 'receptor',
    loadChildren: './receptor/receptor.module#ReceptorModule'
  },
  { path: 'home', component: HomeComponent },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
