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

    this.http.get('https://api.telegram.org/bot' + this.token + '/getUpdates?offset=748537703') // offset - параметр для игнорирования тех пользователей которым мы уже отправили сообщения
      .subscribe(
        data => {
          let responce = data.json(),
            commands = responce.result[responce.result.length-1].message.text; // сообщение запишем чтобы отлавливать команды

          /**
           -----------------------------------------
           *  Здесь мы задаём команды
           -----------------------------------------
           **/
          if (commands === '/telegrammcounter') {
            this.pasteMessage(responce, userData);
          }
          if (commands === '/clock' && commands !== this.moreCommands) {
            this.getToData(responce, userData);
          }
          if (commands === '/citation' && commands !== this.moreCommands) {
            this.citations(responce, userData);
          }
          if (commands === '/newpaper' && commands !== this.moreCommands) {
            this.newpaper(responce, userData);
          }
          if (commands === '/course' && commands !== this.moreCommands) {
            this.course(responce, userData);
          }
          if (commands === '/location' && commands !== this.moreCommands) {
            this.location(responce, userData);
          }
          /**
           -----------------------------------------
           *  --------------------------------------
           -----------------------------------------
           **/
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

  /* Запросить время */
  getToData(chatOpen, userData) {
    let day = {
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
        7: 'Воскресенье'
      },
      getData = new Date();

    this.http.get('https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + Number(chatOpen.result[0].message.chat.id) + '&text=Время: ' + getData.getHours() + ':' + getData.getMinutes() + ':' + getData.getSeconds() + '%0AДень недели: ' + day[getData.getDay()])
      .subscribe(
        data => {
          let responce = data.json();
          userData.appId = responce.result.chat.id;
        }
      );
  }

  /* Цитаты из рунета */
  citations(chatOpen, userData) {
    let obj = this;

    this.http.get('https://api.forismatic.com/api/1.0/?method=getQuote&format=json&json=parseQuote')
      .subscribe(data => {
        let responce = data.json();

        obj.http.get('https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + Number(chatOpen.result[0].message.chat.id) + '&text=Цитата: ' + responce.quoteText + ' %0A  Автор: ' + responce.quoteAuthor)
          .subscribe(
            data => {
              let responce = data.json();
              userData.appId = responce.result.chat.id;
            }
          );

      });
  }

  /* Новости */
  newpaper(chatOpen, userData) {
    let news = this;

    this.http.get('https://newsapi.org/v2/top-headlines?sources=google-news-ru&apiKey=15432ffaf9054b8e8105ed6f7d9dc70e')
      .subscribe(data => {
        let responce = data.json();

        news.http.get('https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + Number(chatOpen.result[0].message.chat.id) + '&text=Описание: %0A' + responce.articles[0].title)
          .subscribe(
            data => {
              let responce = data.json();
              userData.appId = responce.result.chat.id;
            }
          );

      });
  }

  /* Курс валют */
  course(chatOpen, userData) {
    let obj = this;

    this.http.get('https://currate.ru/api/?get=rates&pairs=BCHECH,BCHEUR,BCHGBP,BCHJPY,BCHRUB,BCHUSD,BCHXRP,BTCBCH,BTCECH,BTCEUR,BTCGBP,BTCJPY,BTCRUB,BTCUSD,BTCXRP,ECHEUR,ECHGBP,ECHJPY,ECHRUB,ECHUSD,ECHXRP,EURAED,EURBYN,EURGBP,EURJPY,EURKZT,EURRUB,EURUSD,GBPAUD,GBPJPY,GBPRUB,JPYRUB,RUBAED,RUBKZT,USDAED,USDBYN,USDGBP,USDJPY,USDKGS,USDKZT,USDRUB,USDTHB,USDUAH,XRPEUR,XRPGBP,XRPJPY,XRPRUB,XRPUSD&key=68e4f4088639ca47ab26d6db74590e68')
      .subscribe(data => {
        let responce = data.json();

        obj.http.get('https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + Number(chatOpen.result[0].message.chat.id) + '&text=Курс валюты: %0A  ' + JSON.stringify(responce.data))
          .subscribe(
            data => {
              let responce = data.json();
              userData.appId = responce.result.chat.id;
            }
          );

      });
  }

  /* Геолокация */
  location(chatOpen, userData) {
    let pointer = this;

    this.http.get('http://ip-api.com/json')
      .subscribe(data => {
        let responce = data.json();

        pointer.http.get('https://api.telegram.org/bot' + this.token + '/sendMessage?chat_id=' + Number(chatOpen.result[0].message.chat.id) +
          '&text=Местоположение: %0A' +
          'Город: ' + responce.city + '%0A' +
          'Страна: ' + responce.country + '%0A' +
          'Регион: ' + responce.timezone + '%0A' +
          'ip: ' + responce.query + '%0A' +
          'Высота: ' + responce.lat + '%0A' +
          'Широта: ' + responce.lon)
          .subscribe(
            data => {
              let responce = data.json();
              userData.appId = responce.result.chat.id;
            }
          );

      });
  }
}
