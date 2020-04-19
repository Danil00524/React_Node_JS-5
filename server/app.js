const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const http = require('http');
const socket = require('socket.io');
const app = express();


const db = require(path.join(__dirname, './db'));
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => console.error(err))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', require('./routes'));

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '..', 'front-end', 'build')))
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'front-end', 'build', 'index.html'))
  })
}

const server = http.createServer();
const io = socket(server);

let connectedUsers = {};

io.on('connection', socket => {
  let user = {
    id: socket.id,
    username: socket.handshake.headers.username
  };
  connectedUsers[socket.id] = user;
  socket.emit('all users', connectedUsers);
  io.sockets.emit('new user', user);
  socket.on('chat message', function(msg, user) {
    socket.broadcast.to(user).emit('chat message', msg, socket.id);
  });
  socket.on('disconnect', function() {
    io.sockets.emit('delete user', socket.id);
    delete connectedUsers[socket.id];
  });
});

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

server.listen(port);
console.log(`Example app listening on port ${port}!`);

module.exports = app;
