const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('path');
const authRout = require('./routes/auth');
const analyticsRout = require('./routes/analytics');
const categoryRout = require('./routes/category');
const orderRout = require('./routes/order');
const positionRout = require('./routes/position');

const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoURI, {
  useUnifiedTopology: true, 
  useNewUrlParser: true,
  useCreateIndex: true,  
  useFindAndModify: false  
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(passport.initialize());
require('./middleware/passport')(passport);

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/auth', authRout);
app.use('/api/analytics', analyticsRout);
app.use('/api/category', categoryRout);
app.use('/api/order', orderRout);
app.use('/api/position', positionRout);

if (process.env.NODE_ENV = 'production') {
  app.use(express.static('client/dist/client'));

  app.get('*', (req,res) => {
    res.sendFile(
      path.resolve(
        __dirname, 'client', 'dist', 'client', 'index.html'
      )
    )
  });
}
 
module.exports = app;