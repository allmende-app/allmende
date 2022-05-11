# allmende

Monorepo for allmende 2022

## Server

### Requirements
- Docker
- Docker Compose
```bash
docker-compose up -d --build
```
This command will start a Redis (Session DB) and a Mongo (DB for everything) containers. Addtionally, the command will build the server image by using the Dockerfile inside the "server" folder. The Dockerfile's function is a blueprint for the building progress. After the building is completed, the container will be started with the recently builded image with the environment variables inside the compose-file. If the server code changes, use this command because it will rebuild the image and the container.

### Routes
Locally, the application is accessible via the port "3000".
Following routes are available:
#### Users
- http://localhost:PORT/api/users/register (POST)
- http://localhost:PORT/api/users/login (POST)
- http://localhost:PORT/api/users/logout (DELETE)
- http://localhost:PORT/api/users/ (GET)
- http://localhost:PORT/api/users/:ID (GET)
#### Posts
- http://localhost:PORT/api/posts/ (POST)
- http://localhost:PORT/api/posts?tag=:TAG&page=:PAGE(GET)

#### Bonus Tip!
If you're using MacOS or Windows, use Docker Desktop. Unfortunately, Linux Distributions don't have this application. Docker Desktop provides a convenient GUI for managing images and containers. 