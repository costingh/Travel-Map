# Travel-Map
This is an app that makes use of mapbox api to render the world map. On this map users can pin locations that they have visited, rate them, add description and others.
Users can login, register and search for a location on the map.

![Demo Image](https://github.com/costingh/Travel-Map/blob/master/demo.png?raw=true)

### Description

Tech stack: 
* Node.js
* MongoDB
* Express.js
* React

## Available Scripts

First of all, you should create a free account on mapbox website. You need an api key. Once you're done, navigate to fronted directoru=y and create a .env file.
Add to it the following line:

```bash
REACT_APP_MAPBOX = <api-key>
```

Then, you will also need a database to connect the server to. For this one, you can create an account on mongoDB. From there create a cluster. You will need some credentials to create a database, so keep them in mind. 
Navigate to backend directory and create a .env file and add in it the following line of code, where <username>, <password> and <databaseName> must be replaced with your credentials:

```bash
MONGO_URL = mongodb+srv://<username>:<password>@cluster0.kjcdw.mongodb.net/<databaseName>?retryWrites=true&w=majority
```

To run this project locally, you need to navigate in the project directory, where start.sh file is and open two terminals. 
In one terminal the frontend server must be runned, and in the other, the backend server.

```bash
// Terminal 1
cd frontend
yarn start
```

```bash
// Terminal 2
cd backend
yarn start
```
