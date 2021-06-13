import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TitleComponent } from './shared/components/title/title.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';

import { HomeComponent } from './pages/home/home.component';

import { TypingComponent } from './pages/typing/typing.component';

import { EditFlashComponent } from './pages/edit/edit-flash/edit-flash.component';
import { EditCardModalComponent } from './pages/edit/edit-flash/edit-card-modal/edit-card-modal.component';
import { EditExampleModalComponent } from './pages/edit/edit-flash/edit-example-modal/edit-example-modal.component';
import { AddCardModalComponent } from './pages/edit/edit-flash/add-card-modal/add-card-modal.component';
import { AddExampleModalComponent } from './pages/edit/edit-flash/add-example-modal/add-example-modal.component';
import { FlashComponent } from './pages/flash/flash.component';
import { WordComponent } from './pages/flash/word/word.component';
import { TranslationComponent } from './pages/flash/translation/translation.component';
import { ExamplesComponent } from './pages/flash/examples/examples.component';
import { TranslationsComponent } from './pages/flash/translations/translations.component';
import { FlipComponent } from './pages/flash/flip/flip.component';

import { QuizComponent } from './pages/quiz/quiz.component';
import { AnswerComponent } from './pages/quiz/answer/answer.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    LoadingComponent,
    PageNotFoundComponent,
    UnauthorizedComponent,
    HomeComponent,
    TypingComponent,
    EditFlashComponent,
    EditCardModalComponent,
    EditExampleModalComponent,
    AddCardModalComponent,
    AddExampleModalComponent,
    FlashComponent,
    WordComponent,
    TranslationComponent,
    ExamplesComponent,
    TranslationsComponent,
    FlipComponent,
    QuizComponent,
    AnswerComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
