import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { EditFlashComponent } from './pages/edit/edit-flash/edit-flash.component';
import { FlashComponent } from './pages/flash/flash.component';
import { TypingComponent } from './pages/typing/typing.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'flash', component: FlashComponent },
  { path: 'edit/flash', component: EditFlashComponent },
  { path: 'typing', component: TypingComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
