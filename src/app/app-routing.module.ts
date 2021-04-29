import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { FlashComponent } from './flash/flash.component';
import { TypingComponent } from './typing/typing.component';
import { QuizComponent } from './quiz/quiz.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'flash', component: FlashComponent },
  { path: 'typing', component: TypingComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '',   redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
