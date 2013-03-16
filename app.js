
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();
var hbs = require('express-hbs');

// Hook in express-hbs and tell it where known directories reside
app.engine('hbs', hbs.express3({
    partialsDir: __dirname + '/views/',
    defaultLayout: __dirname + '/views/layout.hbs'
}));

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  // TODO look up sessions to see what to put in for 'secret'
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/alarmshim', routes.alarmshim);
app.get('/chart', routes.chart);
app.get('/dashboard', routes.dashboard);
app.post('/dashboard', routes.dashboard);
app.get('/upload', routes.upload);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
