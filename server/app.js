const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const passport = require("passport");

const app = express();

const db = require(path.join(__dirname, './db'));
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => console.error(err))

app.use(passport.initialize());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
app.use(
  session({
    store: new FileStore(),
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '..', 'front-end', 'build')))
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'front-end', 'build', 'index.html'))
  })
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT ? process.env.PORT : 3000;

app.listen(port, function () {
  console.log(`Example app listening on port ${port}!`);
});

module.exports = app;
