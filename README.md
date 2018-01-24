# TelegramBotForAngular5<br><br>

<hr><br><br>

<a href="https://onesuch.github.io/Telegrams-Bot-write-me-a-message/dist/">Запустить бота</a> для проверки работоспособности<br>Неоходима поддержка <a href="">EctmaScript 5/6 - на хостинге(для работы)</a><br>

<hr><br><br>

Для работы необходимо выполнить:<br><br>

1. git clone https://github.com/ONESucH/Telegrams-Bot-write-me-a-message.git  - Клонируем проект к себе<br>
2. cd Telegrams-Bot-write-me-a-message  - Переходим в папку склонированныого проекта<br>
3. <a href="">npm install</a> - Ставим зависимости<br>
4. ng serve -o - Запускаем проект AngularCli v5<br><br><br>

У нас откроектся в браузере вкладка с портом <a href="">localhost:4200</a><br><br>

<h2>Подготовим, создадим бота в Telegramm</h2><br><br>

1.Скачиваем телеграмм.exe(windows)<br>
2.В поиске ищем @BotFather<br>
3.Клацаем на него, клацаем на кнопку /start <br><br>

  Создаём телеграмм бота(пишем в чате @BotFather)<br><br>

4./help - помощь<br>
5./newbot  (enter, потом пи<br>шем название бота)<br>
  @MyNameUserBot  - Внимание бот должен содержать в конце "названия бота" "Bot" или "_bot"<br><br>
  
Если <i>success</i>, то бот создался<br>
Найдём его:<br>

5./mybot (курсором клацаем на блок с название нашего бота "@MyNameUserBot")<br> 
6.Мы видим панель бота<br> 
7.Заходим во вкладку "API TOKEN"<br> 
8.Копируем <a href="">Token</a><br><br> 

<h2>В проекте Angular который мы склонировали открываем компоненту</h2><br><br>

Путь <a href="">src/app/app.component.ts</a><br><br>

Находим строку <a href="">private token: string = '456198924:AAEICuQy1e0gopHbeNyv0al2n132asddsds21@e23';</a><br>

Заменяем на свой Token<br>

<h2>Заходим в браузер и обновляем страницу localhost:4200</h2><br>

