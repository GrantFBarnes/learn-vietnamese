import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { TypingComponent } from './pages/typing/typing.component';
import { FlashComponent } from './pages/flash/flash.component';
import { EditFlashComponent } from './pages/edit/edit-flash/edit-flash.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'typing', component: TypingComponent },
  { path: 'flash', component: FlashComponent },
  { path: 'edit/flash', component: EditFlashComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
