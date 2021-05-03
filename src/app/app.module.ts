import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlashComponent } from './flash/flash.component';
import { FlipComponent } from './flash/flip/flip.component';
import { HomeComponent } from './home/home.component';
import { TypingComponent } from './typing/typing.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { QuizComponent } from './quiz/quiz.component';

@NgModule({
  declarations: [
    AppComponent,
    FlashComponent,
    FlipComponent,
    HomeComponent,
    TypingComponent,
    PageNotFoundComponent,
    QuizComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
