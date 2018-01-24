import {Component} from '@angular/core';
import {Http} from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  private token: string = '456198924:AAGtULqrSKM6mbWY_Z2TK7PGPfwP2W6CZtA';

  constructor(private http: Http) {
    this.onLoading();
  }

  /* Получаем доступ к БОТУ и записываем данные в объект для дальнейшей работы */
  onLoading() {
    let methodName: string = 'getMe'; // Название Метода

    this.http.get('https://api.telegram.org/bot' + this.token + '/' + methodName)
      .subscribe(
        data => {

          let parsingResponseJson = data.json(),
            result = parsingResponseJson.result; // Сократим до результата

          /* Записываем данные об пользователе */
          let saveUserData = {  // Будем записывать данные об пользователе
            id: Number(result.id), // Id Чата
            is_bot: result.is_bot, // Бот ли это? true - да
            first_name: result.first_name, // Имя бота или пользователя
            username: result.username, // Имя чата
          };

          this.getInformationChat(); // Зарпашиваем доступ к приложению
          this.pasteMessage(saveUserData); // Если всё хорошо запускаем дальше
        },
        error => {
          console.log('%c ' + 'error', 'background:red;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error)
        })
  }

  /* Получаем ID чата для работы с сообщениями !important */
  getInformationChat() { // Получили информацио об приложении

    let methodName: string = 'getUpdates'; // Название метода

    this.http.get('https://api.telegram.org/bot' + this.token + '/' + methodName + '')
      .subscribe(
        data => {

          const responce = data.json();

            this.pasteMessage(responce);
        },
        error => console.log('%c ' + 'error', 'background:silver;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error),
      );
  }

  /* Отправляем сообщения */
  pasteMessage(saveDataUser) {

    /* Получили доступ к чату, пробуем отправлять сообщения */
    if (saveDataUser.ok === true) {

      let methodName: string = 'sendMessage', // Название Типа
        postMessage: string = 'Мой бот готов отправлять сообщения!'; // Сообщение которое полетит в группу(через бота)

      this.http.get('https://api.telegram.org/bot' + this.token + '/' + methodName + '?chat_id=' + Number(saveDataUser.result[0].message.from.id) + '&text=' + postMessage) // chat_id = Строка или Число, будет в json когда вступит в групповой чат
        .subscribe(
          data => {

            let responce = data.json();

            console.log(responce);

          },
          error => console.log('%c ' + 'error', 'background:silver;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error)
        );
    }
  }
}
