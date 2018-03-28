import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module'; // Роутинг
import {HttpModule} from '@angular/http'; // Для запроса GET, POST ...

import {AppComponent} from './app.component';

/* pipe */
import {Token} from './token'; // импортируем переменные из файла


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, // Роутинг
    HttpModule // Для запроса GET, POST ...
  ],
  providers: [Token],
  bootstrap: [AppComponent]
})
export class AppModule {}
