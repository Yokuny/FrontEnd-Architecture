# IOTLog Frontend

```sh
$ cd iotlog-fronted
```

### Executando por npm

 - Necessário instalar [Node.js](https://nodejs.org/)


Copiar .env e configurar váriaveis do ambiente
```sh
$ cp .env.example .env
```
----


Instalar dependências e iniciar o frontend

```sh
$ npm install 
$ npm start
```
----
### Executando no Docker

 - Necessário instalar o [Docker](https://www.docker.com/)

```sh
$ docker build -t iotlog-portal .
```

Executar via linha de comando

```sh
$ docker run --name iotlog-portal \
     -p 3000:3000
     -e REACT_APP_URI_BASE=http://localhost:3001/api/v1
     -e REACT_APP_URI_SOCKET=http://localhost:3001
     -e REACT_APP_URI_SUPPORT=http://localhost:3010/api/v1
     -e REACT_APP_GAID=UA-GOOGLE
     -e REACT_APP_MAX_SIZE_FILE_BYTES=26214400
     -d iotlog-portal
```
