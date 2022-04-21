


const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      morgan = require('morgan')
      mongoose = require('mongoose'),
      Models = require('./models.js');

const Movies = Models.Movie,
       Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

      

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
 
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

let movies = [
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
// // Title: {type: String, required: true},
// Description: {type: String, required: true},
// Genre: {
//   Name: String,
//   Description: String
// },
// Director: {
//   Name: String,
//   Bio: String
// },
// Actors: [String],
// ImagePath: String,
// Featured: Boolean
// });


// Gets the list of data about ALL users

app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
// Gets the data about a single user, by name

app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//UPDATE user mongoose

app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});


// Deletes a user from our list by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movies club!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

//GEt all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

app.get('/movies/:title', (req, res) => {
  const { title } = req.params;
  const movie = movies.find (movie => movie.Tilte === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send ("no such movie")
  }
}); 


//(Read) responds with a json of the specific movie asked for genre

app.get('/movies/genre/:name', (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find( movie => movie.genre.name === title).genre;

  if (genre) {
    res.status (200).json(genre);
  } else {
    res.status(400).send('no such genre')
  }
})

app.use(express.static('public')); //serves “documentation.html” file from the public folder

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});