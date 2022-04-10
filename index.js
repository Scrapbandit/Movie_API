const express = require('express');
morgan = require('morgan');
const app = express();


let topMovies = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    year: '2001'
  },
  {
    title: 'Lord of the Rings',
    year: '2003'
  },
  {
    title: 'Inception',
    year: '2010'
  },
  {
    title: 'Gatsby',
    year: '2013'
  },
  {
    title: 'Dango',
    year: '2012'
  },{
    title: 'Fight club',
    year: '1999'
  },
  {
    title: 'Mad Max',
    year: '2015'
  },
  {
    title: 'Mask',
    year: '1994'
  },
  {
    title: 'Seven',
    year: '1995'
  },
  {
    title: 'Interstellar',
    year: '2014'
  }
];

app.use(morgan('common')); //add morgan middlewar library

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

app.use(express.static('public')); //serves “documentation.html” file from the public folder

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});