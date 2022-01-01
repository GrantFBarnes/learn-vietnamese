import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { LearnComponent } from './pages/learn/learn.component';
import { TypingComponent } from './pages/typing/typing.component';
import { FlashComponent } from './pages/flash/flash.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { ManageComponent } from './pages/manage/manage.component';
import { EditCategoriesComponent } from './pages/manage/edit-categories/edit-categories.component';
import { EditFlashComponent } from './pages/manage/edit-flash/edit-flash.component';
import { EditFlashCategoriesComponent } from './pages/manage/edit-flash-categories/edit-flash-categories.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: 'vietnamese/home', component: HomeComponent },
  { path: 'vietnamese/learn', component: LearnComponent },
  { path: 'vietnamese/typing', component: TypingComponent },
  { path: 'vietnamese/flash', component: FlashComponent },
  { path: 'vietnamese/quiz', component: QuizComponent },
  { path: 'vietnamese/manage', component: ManageComponent },
  { path: 'vietnamese/manage/categories', component: EditCategoriesComponent },
  { path: 'vietnamese/manage/flash', component: EditFlashComponent },
  {
    path: 'vietnamese/manage/flash-categories',
    component: EditFlashCategoriesComponent,
  },
  { path: 'vietnamese', redirectTo: '/vietnamese/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
