# allmende server

The server serves the public facing API for the client, handles authentication, and the business logic.

## Requirements
- Docker
- Docker Compose
- Node >= 16 and npm

### Local enviroment with server build
```bash
docker-compose up -f ../docker-compose.yml -d --build
```
This command will start a Redis (Session DB) and a Mongo (DB for everything) containers. Addtionally, the command will build the server image by using the Dockerfile inside the "server" folder. The Dockerfile's function is a blueprint for the building progress. After the building is completed, the container will be started with the recently builded image with the environment variables inside the compose-file. If the server code changes, use this command because it will rebuild the image and the container.

### Local development 
If you consider to develop on the backend code and want to run the server locally without to run the server as an isolated container, then use this command.
```bash
docker-compose -f docker-compose.local.yml up -d
npm run install
npm run dev
```
The first command will starts two databases containers (mongo and redis) with their omitted ports and environment variables.
The other two commands will install the required dependecies for the server and starts the server locally. The locally started server is equipped with nodemon, which means that it has a hot-reload function. Whenever you change code, the server will be restarted automatically.

## Routes
Locally, the application is accessible via the port "3000".
Following routes are available:
### Users
#### POST - Register
- http://localhost:PORT/api/users/register
##### Body
- user: Object (User)

| Property | Type  | required |
| -------  | ----  | ---      |
| username | string| yes      |
| email    | string| yes      |
| password | string| yes      |
| confirmPassword| string| yes|

##### Response 
- user: Object (User without password) | 200

#### POST - Login
- http://localhost:PORT/api/users/login (POST)
##### Body
- user: Object (User)

| Property | Type  | required |
| -------  | ----  | ---      |
| username | string| yes      |
| email    | string| optional |
| password | string| yes      |

##### Response
- 200

#### DELETE - Logout
- http://localhost:PORT/api/users/logout (DELETE)
##### Response
- string | 200

#### GET - Get own profile
- http://localhost:PORT/api/users/ (GET)
##### Response
- user: Object (User without password) | 200

#### GET - Get profile of user
- http://localhost:PORT/api/users/{username} (GET)
##### Parameter {username}
- type: string - username of specific user
##### Response
- user: Object (User without password) | 200

### Posts
- http://localhost:PORT/api/posts/ (POST)
- http://localhost:PORT/api/posts?tag=:TAG&page=:PAGE(GET)

### Comments
- http://localhost:PORT/api/comments/:id (POST) - create a comment for a specific post
- http://localhost:PORT/api/comments/:id (GET) - get a list of comments by a post id
- http://localhost:PORT/api/comments/:id (DELETE) - delete a comment by its id
- http://localhost:PORT/api/comments/:id (PUT) - change a comment by its id
- http://localhost:PORT/api/comments/comment/:id (GET) - get a comment by its id

#### Bonus Tip!
If you're using MacOS or Windows, use Docker Desktop. Unfortunately, Linux Distributions don't have this application. Docker Desktop provides a convenient GUI for managing images and containers.
