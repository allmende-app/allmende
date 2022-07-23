# allmende

Monorepo for allmende 2022

## Structure

The allmende repository is separated into three services:

<ul>
<li>

**[Server](/server)**<br>
The server serves the public facing API for the client, handles authentication, and the business logic.

</li>
<li>

**[Client](/client)**<br>
The client contains the frontend and with which users can interact with allmende.

</li>
<li>

**[ML](/ml)**<br>
The ML service is seperate from the server and is used by the server to identify and classify images.

</li>

<li>

**[Nginx](/nginx)**<br>
The Nginx folder contains the configurations for the the requests proxys.
</li>

</ul>

## Docker Compose
You can run the services with the normal "docker-compose.yml" or the local "docker-compose.local.yml" file.

### Staging/production environment
To start the architecture, first initialize the environment variables by inserting these inside a .env file.
```bash
MONGO_USER=admin
MONGO_PW=someRandomPassword
MONGO_HOST=mongo-db 
PORT=3000 \
NODE_ENV=production
REDIS_HOST=redis-db
SECRET=someRandomSuperSecret
```
These variables are mandatory for the server service. After you inserted this code snippet, you can run the services with this command:
```bash
docker-compose -f ./docker-compose.production.yml up -d
```
If you want to stop the application, then run this command:
```bash
docker-compose down
```
When a new feature of a service is delivered and you need the new version of if, run this command:
This command will build new images for the running containers.
```bash
docker-compose -f ./docker-compose.production.yml up -d --build
```

### Local enviroment
To run the services locally without headache and without setting the variables, run this command instead:
```bash
docker-compose up -d
```
If you want to stop the application, then run this command:
```bash
docker-compose down
```
When a new feature of a service is delivered and you need the new version of if, run this command:
This command will build new images for the running containers.
```bash
docker-compose up -d --build
```