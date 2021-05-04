import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { JumbotronComponent } from './shared/jumbotron/jumbotron.component';

import { HomeComponent } from './home/home.component';

import { FlashComponent } from './flash/flash.component';
import { WordComponent } from './flash/word/word.component';
import { TranslationComponent } from './flash/translation/translation.component';
import { ExamplesComponent } from './flash/examples/examples.component';
import { TranslationsComponent } from './flash/translations/translations.component';
import { FlipComponent } from './flash/flip/flip.component';

import { TypingComponent } from './typing/typing.component';
import { QuizComponent } from './quiz/quiz.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    JumbotronComponent,
    HomeComponent,
    FlashComponent,
    WordComponent,
    TranslationComponent,
    ExamplesComponent,
    TranslationsComponent,
    FlipComponent,
    TypingComponent,
    QuizComponent,
    PageNotFoundComponent,
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
