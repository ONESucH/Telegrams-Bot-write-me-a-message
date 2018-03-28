import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Token} from './token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public token: any;
  public moreCommands = '';

  constructor(private http: Http, public dataToken: Token) {
    this.token = this.dataToken.key;
  }

  ngOnInit() {
    this.onLoading();
  }

  /* Получаем Токен, данные пользователя - записываем данные в объект для дальнейшей работы с БОТОМ */
  onLoading() {

    this.http.get('https://api.telegram.org/bot' + this.token + '/getMe')
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
        }
      )
  }

  /* Получаем ID чата для работы с сообщениями / командами */
  getInformationChat(userData) { // Получили информацию об приложении
    let timer = this;

    this.http.get('https://api.telegram.org/bot' + this.token + '/getUpdates?offset=112080303') // offset - параметр для игнорирования тех пользователей которым мы уже отправили сообщения
      .subscribe(
        data => {
          let responce = data.json(),
            commands = responce.result[responce.result.length-1].message.text; // сообщение запишем чтобы отлавливать команды

          /**
           -----------------------------------------
           *  Здесь мы задаём команды
           -----------------------------------------
           **/
          // Накрутка счетчика
          if (commands === '/telegrammcounter') {
            this.pasteMessage(responce, userData);
          } else
          // Выводим дату
          if (commands === '/clock' && commands !== this.moreCommands) {
            this.getToData(responce, userData);
          }

          this.moreCommands = commands;
        },
        error => {
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

    // Цикл обновления данных
    setTimeout(function () {
      timer.onLoading();
    }, 500);
  }

  /* Накрутка сообщений */
  pasteMessage(chatOpen, userData) { // Отправляем по функциям user data для того чтобы не потерять данные + не делать глобальные переменные

    /* Получили доступ к чату, пробуем отправлять сообщения */
    if (chatOpen.ok === true) {

      this.http.get('https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + Number(chatOpen.result[0].message.chat.id) + '&text=Добавляем...') // chat_id = Строка или Число, будет в json когда вступит в групповой чат
        .subscribe(
          data => {
            let responce = data.json();
            userData.appId = responce.result.chat.id; // ID чата в котором отсылаем сообщения

            //this.pasteMessage(chatOpen, userData); // Запускаем повторный цикл
          },
          error => console.log('%c ' + 'error', 'background:silver;border-radius:10px;color:#fff;text-shadow: 0 0 5px red;padding-right:5px;', error)
        );
    } else {
      alert('Нет прав у бота отправлять сообщения, смотри метод "getUpdates"');
    }
  }

  /* Получаем время */
  getToData(chatOpen, userData) {
    let getData = new Date();

    this.http.get('https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + Number(chatOpen.result[0].message.chat.id) + '&text=Время: ' + getData.getHours()+':'+getData.getMinutes()+':'+getData.getSeconds())
      .subscribe(
        data => {
          let responce = data.json();
          userData.appId = responce.result.chat.id;
        }
      );
  }
}
