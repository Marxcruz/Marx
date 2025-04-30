require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const localUser = require('./middleware/localUser');
var method = require('method-override');
var indexRouter = require('./routes/index');

var connectDB = require('./database/mongoConnection');

var app = express();

connectDB();

app.set('trust proxy', true);
//method-override

app.use(method('_method'))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..','public')));
const MongoStore = require('connect-mongo');

app.use(session({
  secret : 'mi secreto',
  saveUninitialized : true,
  resave : false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/historiasClinicas',
    ttl: 14 * 24 * 60 * 60, // 14 days
  }),
}));

app.use(localUser)

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(res.status(404).render('error', {title : 'Pagina no encontrada'}));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
