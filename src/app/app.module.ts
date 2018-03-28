import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module'; // Роутинг
import {HttpModule} from '@angular/http'; // Для запроса GET, POST ...

import {AppComponent} from './app.component';

<<<<<<< HEAD
/* pipe */
import {Token} from './token'; // импортируем переменные из файла


=======
>>>>>>> 295f3e00b47b4200322b6ce91c210f00cd7161e1
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
