


const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      morgan = require('morgan');
const { send } = require('process');
      mongoose = require('mongoose'),
      Models = require('./models.js');

const Movies = Models.Movie,
       Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

      

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);
 
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
    Title: "Interstellar",
    Description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    Genre: {
      Name: "Sci-Fi",
      Description: " speculative fiction which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life. It has been called the literature of ideas, and it often explores the potential consequences of scientific, social, and technological innovations."
    },
  
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Nolan is an American director, producer, and screenwriter.",
      Birth: "1970-07-30"
    },
    ImagePath: "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRf61mker2o4KH3CbVE7Zw5B1-VogMH8LfZHEaq3UdCMLxARZAB",
    Featured: true
  },
  {
    Title: "The Hobbit",
    Description: "A reluctant Hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home, and the gold within it from the dragon Smaug.",
    Genre: {
      Name: "Fantasy",
      Description: "speculative fiction involving magical elements, typically set in a fictional universe and sometimes inspired by mythology and folklore. Its roots are in oral traditions, which then became fantasy literature and drama. From the twentieth century, it has expanded further into various media, including film, television, graphic novels, manga, animated movies and video games."
    },
  
    Director: {
      Name: "Peter Jackson",
      Bio: "Peter Jackson is an American director, producer, and screenwriter.",
      Birth: "1961-10-31"
    },
    ImagePath: "https://resizing.flixster.com/bvVhpq1XDXo409UQ07ZgFrsIlZ0=/206x305/v2/https://flxt.tmsimg.com/assets/p9458059_p_v8_ac.jpg",
    Featured: true
  },
  {
    Title: "Inception",
    Description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
    Genre: {
      Name: "Sci-Fi",
      Description: " speculative fiction which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life. It has been called the literature of ideas, and it often explores the potential consequences of scientific, social, and technological innovations."
    },
  
    Director: {
      Name: "Christopher Nolan",
      Bio: "Christopher Nolan is an American director, producer, and screenwriter.",
      Birth: "1970-07-30"
    },
    ImagePath: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg",
    Featured: true
  }
];

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

//creat new user

app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
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

//add movie to users favorite
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
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

app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//(Read) responds with a json of the specific movie asked for genre
app.get("movies/genre/:Name", (req, res) => {
    movies.find({ "Genre.Name": req.params.Name })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err);
      });
  }
);
// app.get('/genre/:Name', (req, res) => {
//     Movies.findOne({ 'Genre.Name': req.params.Name })
//     .then((movie) => {
//       if(movie){ 
//          res.json(movie.Genre.Description);
//     }else{
//       res.status(400).send('Genre not found.');
//     };
//     })  
//     .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + error);
//     });
// });

app.use(express.static('public')); //serves “documentation.html” file from the public folder

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});