

// Import middleware libraries: Morgan, body-parser, and uuid
const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'),
      morgan = require('morgan');

// Import Mongoose, models.js and respective models defined in model.js
   
const mongoose = require('mongoose'),
      Models = require('./models.js');

const Movies = Models.Movie,
       Users = Models.User;

const { check, validationResult } = require('express-validator');

/* Connecting to MongoDB */
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
 
// Load express framework
const app = express();

// Use body-parser middleware function

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Import and use CORS, set allowed origins

const cors = require('cors');
app.use(cors({}));

let auth = require('./auth')(app);

// Require passport module & import passport.js file 
const passport = require('passport');
require('./passport');

/**
 * Logs basic request data in terminal using Morgan middleware library
 */
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

/**
 * GET: Returns a list of ALL movies to the user
 * Request body: Bearer token
 * @returns array of movie objects
 * @requires passport
 */

app.get('/users',  
(req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: Returns data on a single user (user object) by username
 * Request body: Bearer token
 * @param Username
 * @returns user object
 * @requires passport
 */
app.get('/users/:Username',
 (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * POST: Allows new users to register; Username, Password & Email are required fields!
 * Request body: Bearer token, JSON with user information
 * @returns user object
 */
app.post('/users',
 [
  check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ],
(req, res) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
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

/**
 * PUT: Allow users to update their user info (find by username)
 * Request body: Bearer token, updated user info
 * @param Username
 * @returns user object with updates
 * @requires passport
 */
app.put('/users/:Username', 
passport.authenticate('jwt', {session: false}),
 (req, res) => {   // Validation logic
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: hashedPassword,
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

/**
 * POST: Allows users to add a movie to their list of favorites
 * Request body: Bearer token
 * @param username
 * @param movieId
 * @returns user object
 * @requires passport
 */
app.post('/users/:Username/movies/:MovieID',
 passport.authenticate('jwt', {session: false}),
  (req, res) => {
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

/**
 * DELETE: Allows existing users to deregister
 * Request body: Bearer token
 * @param Username
 * @returns success message
 * @requires passport
 */
app.delete('/users/:Username',
 passport.authenticate('jwt', {session: false}), 
 (req, res) => {
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


/**
 * GET: Returns welcome message for '/' request URL
 * @returns Welcome message
 */
app.get('/', 
(req, res) => {
  res.send('Welcome to my movies club!');
});

/**
 * GET: Returns App documentation for '/documentation' request URL
 * @returns App documentation
 */
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

/**
 * GET: Returns a list of ALL movies to the user
 * Request body: Bearer token
 * @returns array of movie objects
 * @requires passport
 */
app.get('/movies', passport.authenticate('jwt', { session: false }),
(req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
/**
 * GET: Returns data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
 * Request body: Bearer token
 * @param movieId
 * @returns movie object
 * @requires passport
 */
app.get('/movies/:Title', 
passport.authenticate('jwt', {
  session: false
}),
 (req, res) => {
  Movies.findOne({ Title: req.params.Title }) // Find the movie by title
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: Returns data about a genre (description) by name/title (e.g., “Fantasy”)
 * Request body: Bearer token
 * @param Name (of genre)
 * @returns genre object
 * @requires passport
 */app.get("/movies/genre/:Name",
passport.authenticate('jwt', {
  session: false
}),
 (req, res) => {
    Movies.findOne({ "Genre.Name": req.params.Name })
      .then((movie) => {
        if (!movie) {
          return res.json(null);
        }
        return res.json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err);
      });
  }
);


/**
 * GET: Returns data about a director (bio, birth year, death year) by name
 * Request body: Bearer token
 * @param Name (of director)
 * @returns director object
 * @requires passport
 */
app.get('/director/:Name', passport.authenticate('jwt', {
  session: false
}), (req, res) => {
  Movies.findOne({
          'Director.Name': req.params.Name
      })
      .then((movie) => {
          res.json(movie.Director);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

/**
 * DELETE: Allows users to remove a movie from their list of favorites
 * Request body: Bearer token
 * @param Username
 * @param movieId
 * @returns user object
 * @requires passport
 */
app.delete('/users/:Username/movies/:MovieID',
 passport.authenticate('jwt', {session: false}),
  (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
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

/**
 * Serves sstatic content for the app from the 'public' directory
 */
app.use(express.static('public')); 

/**
 * handles errors
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

/**
 * defines port, listening to port 8000
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});