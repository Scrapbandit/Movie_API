
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      morgan = require('morgan')
      

const app = express();

app.use(bodyParser.json());
 
app.use(morgan('common')); //add morgan middlewar library


let users = [
  {
    id: 1,
    username: "0val",
    email: "val.moul@gmail.com",
    password: "vt@rt2022!",
    birthday: "17/06/1990",
    favorites: [],
  },
  {
    id: 2,
    username: "stan1",
    email: "stan.mont@gmail.com",
    password: "Stgf022g34",
    birthday: "13/12/1984",
    favorites: [],
  }
];

let topMovies = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    year: '2001',
    genre: {
      name: "fantasy",
      description: "",
    },
    director: {
      name: "Christopher Nolan",
      birth: "1970",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  },
  {
    title: 'Lord of the Rings',
    year: '2003',
    genre: {
      name: "Fantasy",
      description: "",
    },
    director: {
      name: "Peter Jackson",
      birth: "1962",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  },
  {
    title: 'Inception',
    year: '2010',
    genre: {
      name: "Science-Fiction",
      description: "",
    },
    director: {
      name: "Danny Devito",
      birth: "1940",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  },
  {
    title: 'Gatsby',
    year: '2013',
    genre: {
      name: "Drama",
      description: "",
    },
    director: {
      name: "Mike Ronson",
      birth: "1962",
      death: "-",
      bio: "",
    },
    actors: {},
    imgURL: "",
  }
];



// Gets the list of data about ALL users

app.get('/users', (req, res) => {
  res.json(users);
});
// Gets the data about a single user, by name

app.get('/users/:name', (req, res) => {
  res.json(users.find((user) =>
    { return user.name === req.params.name }));
});

// Adds data for a new user to our list of users.
app.post('/users', (req, res) => {
  let newUser = req.body;

  if (!newUser.name) {
    const message = 'Missing name in request body';
    res.status(400).send(message);
  } else {
    newuser.id = uuid.v4();
    users.push(newuser);
    res.status(201).send(newuser);
  }
});

// Deletes a user from our list by ID
app.delete('/users/:id', (req, res) => {
  let user = users.find((user) => { return user.id === req.params.id });

  if (user) {
    users = users.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('user ' + req.params.id + ' was deleted.');
  }
});


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movies club!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
}); 

//(Read) responds with a json of the specific movie asked for genre

app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.genre.name === title).genre;

  if (genre) {
    res.status (200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
}); 

app.use(express.static('public')); //serves “documentation.html” file from the public folder

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});