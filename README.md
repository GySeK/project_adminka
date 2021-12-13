# project_adminka

## nginx

### Установка

```
npm install
```

### Автозапуск

```
sudo systemctl enable nginx
```

### Конфиг в /etc/nginx/sites-available

```
events {
    multi_accept on;
    accept_mutex off;
    worker_connections 1024;
}
http{
    types_hash_max_size 4096;

    server {
        listen 80;

        location /api {
            proxy_pass http://127.0.0.1:3000;
        }
        location / {
            include  /etc/nginx/mime.types;
            root /var/www/project_adminka/dist;
            try_files $uri $uri/ /index.html;
        }
    }
}
```
## postgresql

#### Параметры подключения в файле api

### Таблица users
```
create table users (
username varchar(20),
password varchar(100),
attributes jsonb,
primary key(username)
);
```
### Таблица data
```
create table data (
id serial primary key,
time timestamp,
username varchar(20),
is_edited boolean,
text text
);
```
### Для создания суперпользователя вставте
```
insert into users (username,password,attributes) values ('admin','$2y$12$PYnYVZF6X/Ie2CoQr4whaOVVSuJXo7kCz.FyIzo06pLnDOzHf8C5m','{"permissions": ["write", "administrate"]}'); 
```
## npm

### Установка пакетов
```
sudo npm i
```
### Сборка под production
```
sudo npm run build
```
### Сборка с горячей перезагрузкой
```
sudo npm run serve
```

## api

### Ручная загрузка
```
sudo npm i -g nodemon
sudo nodemon файл
```
### Автозагрузка
```
sudo npm i -g pm2
sudo pm2 start файл
```
## Вход

### Имя пользователя: admin
### Пароль: admin

# Все!
