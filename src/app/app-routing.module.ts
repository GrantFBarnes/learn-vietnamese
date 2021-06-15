import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LearnComponent } from './pages/learn/learn.component';
import { TypingComponent } from './pages/typing/typing.component';
import { FlashComponent } from './pages/flash/flash.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ManageComponent } from './pages/manage/manage.component';
import { ConnectionsComponent } from './pages/manage/connections/connections.component';
import { EditCategoriesComponent } from './pages/manage/edit-categories/edit-categories.component';
import { EditFlashComponent } from './pages/manage/edit-flash/edit-flash.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'learn', component: LearnComponent },
  { path: 'typing', component: TypingComponent },
  { path: 'flash', component: FlashComponent },
  { path: 'quiz', component: QuizComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'manage/connections', component: ConnectionsComponent },
  { path: 'manage/categories', component: EditCategoriesComponent },
  { path: 'manage/flash', component: EditFlashComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
