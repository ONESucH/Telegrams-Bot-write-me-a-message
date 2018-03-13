import {Component} from '@angular/core';
import {Http} from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  private token: string = '456198924:AAFoDQBPFeWnU45kOUQ4jvyBmOMy8e_H6kQ';
  private timer = this;

  constructor(private http: Http) {
    this.onLoading();
  }

  /* Получаем Токен, данные пользователя - записываем данные в объект для дальнейшей работы с БОТОМ */
  onLoading() {
    let methodName: string = 'getMe'; // Название Метода

    this.http.get('https://api.telegram.org/bot' + this.token + '/' + methodName)
      .subscribe(
        data => {

          let parsingResponseJson = data.json(),
            result = parsingResponseJson.result; // Сократим до результата

          /* Записываем данные об пользователе */
          let saveUserData = {  // Будем записывать данные об пользователе
            messageChatId: Number(result.id), // Id Чата в котором находимся
            is_bot: result.is_bot, // Бот ли это? true - да
            first_name: result.first_name, // Имя бота или пользователя
            username: result.username, // Имя чата
          };

          this.getInformationChat(saveUserData); // Запрашиваем доступ к приложению
        },
        error => {
          console.log('%c ' + 'error', 'background:red;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error)
        })
  }

  /* Получаем ID чата для работы с сообщениями */
  getInformationChat(userData) { // Получили информацио об приложении

    let methodName: string = 'getUpdates'; // Название метода

    this.http.get('https://api.telegram.org/bot' + this.token + '/' + methodName + '?offset=112080303') // offset - параметр для игнорирования тех пользователей которым мы уже отправили сообщения
      .subscribe(
        data => {

          const responce = data.json();

          console.log(responce);

          this.pasteMessage(responce, userData);
        },
        error => {
          console.log('%c ' + 'error.statusText', 'background:blue;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error.statusText);

          switch (error.response) {
            case error.response.statusText = 'Forbidden':
              console.log('%c ' + 'Вас удалили из группы или Выставили Бан', 'background:coral1;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;');
              break;
            default:
              console.log('%c ' + 'error', 'background:silver;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error);
              break;
          }
        },
      );
  }

  /* Отправляем сообщение в ЛС по ID или по ID группы */
  pasteMessage(chatOpen, userData) { // Отправляем по функциям user data для того чтобы не потерять данные + не делать глобальные переменные

    /* Получили доступ к чату, пробуем отправлять сообщения */
    if (chatOpen.ok === true) {

      let methodName: string = 'sendMessage', // Название Типа
        postMessage: string = 'Сегодня: ' + new Date(); // Сообщение которое полетит в группу(через бота)

      this.http.get('https://api.telegram.org/bot' + this.token + '/' + methodName + '?chat_id=' + Number(chatOpen.result[0].message.chat.id) + '&text=' + postMessage) // chat_id = Строка или Число, будет в json когда вступит в групповой чат
        .subscribe(
          data => {

            let responce = data.json();

            userData.appId = responce.result.chat.id; // ID чата в котором отсылаем сообщения

            console.log('%c ' + 'responce', 'background:orange;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', responce);

            this.timer.onLoading(); // Запускаем поторный цикл
          },
          error => console.log('%c ' + 'error', 'background:silver;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error)
        );
    } else {
      alert('Нет прав у бота отправлять сообщения, смотри метод "getUpdates"');
    }
  }

  /* Paste data for interface */
  postDataForInterface() {

  }
}
