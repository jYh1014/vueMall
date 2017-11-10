var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
var index = require('./routes/index');
var users = require('./routes/users');
var goods = require('./routes/goods');
var ejs = require('ejs')

var app = express();
var dbUrl = 'mongodb://vue_mall_runner:18210385076@127.0.0.1:27017/db_mall'
var env = process.env.NODE_ENV || 'development'
if(env === 'development'){
  dbUrl = 'mongodb://localhost/db_mall'
}
mongoose.connect(dbUrl)
mongoose.connection.on('connected',function(){
    console.log('connect success')
})

mongoose.connection.on('disconnected',function(){
    console.log('disconnect')
})

mongoose.connection.on('error',function(){
    console.log('connect fail')
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.engine('.html',ejs.__express)
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));

//拦截用户未登录
app.use(function(req,res,next){
  
  if(req.cookies.userId){
    
    next()
  }else{
    if(req.originalUrl == '/users/login' || req.originalUrl == '/users/logout' || req.originalUrl == '/users/signUp' || req.originalUrl.indexOf('/goods/list') >-1){
      next()
    }else{
      res.json({
        status:'10001',
        result:'用户未登录'
      })
    }
  }
})

app.use('/', index);
app.use('/users', users);
app.use('/goods', goods);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// app.listen(3000)
module.exports = app;
