const express = require('express');
const app = express();
const mongoose = require('mongoose');
const saucesRoutes = require('./routes/sauces.js');
const userRoutes = require('./routes/user.js');

mongoose.connect('mongodb+srv://BntVince:<MDP>@nodejsocr.cwdjm.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);


module.exports = app;
