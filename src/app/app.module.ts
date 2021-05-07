import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitleComponent } from './shared/title/title.component';

import { HomeComponent } from './home/home.component';

import { EditFlashComponent } from './edit-flash/edit-flash.component';
import { FlashComponent } from './flash/flash.component';
import { WordComponent } from './flash/word/word.component';
import { TranslationComponent } from './flash/translation/translation.component';
import { ExamplesComponent } from './flash/examples/examples.component';
import { TranslationsComponent } from './flash/translations/translations.component';
import { FlipComponent } from './flash/flip/flip.component';

import { TypingComponent } from './typing/typing.component';
import { QuizComponent } from './quiz/quiz.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

@NgModule({
  declarations: [
    AppComponent,
    TitleComponent,
    HomeComponent,
    EditFlashComponent,
    FlashComponent,
    WordComponent,
    TranslationComponent,
    ExamplesComponent,
    TranslationsComponent,
    FlipComponent,
    TypingComponent,
    QuizComponent,
    PageNotFoundComponent,
    UnauthorizedComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
