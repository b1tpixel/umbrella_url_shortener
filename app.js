var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var schedule = require('node-schedule')
var { Op } = require('sequelize')
var moment = require('moment')
var log4js = require('log4js')

var config = require('./config')
var apiRouter = require('./routes/url');
var models = require('./models');

let loggingLevel = 'FATAL'

if(config){
  loggingLevel = config.LOG_LEVEL ? config.LOG_LEVEL : 'fatal';
}

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'server.log'}
  },
  categories: {
    server: { appenders: ['file'], level: loggingLevel},
    default: { appenders: ['console'], level: loggingLevel}
  }
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var logger = log4js.getLogger('server');
app.use(log4js.connectLogger(logger, { level: 'auto' }));
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve(__dirname, './client/dist/client')));

app.use('/api', apiRouter);
app.get('/*', function(req, res, next) {
	models.Url.find({where: {custom:req.url.substr(1,)}}).then(result => {
		if(!result){
			res.sendFile(path.join(__dirname,'/client/dist/client/index.html'))
		} else {
      //Обновление счётчика
      models.Url.update({timesUsed: ++result.timesUsed}, {where: {id: result.id}})
			res.redirect(result.original);
		}
	})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

// scheduler
var jobRule = new schedule.RecurrenceRule();
jobRule.date = [13, 28]

var job = schedule.scheduleJob(jobRule, () => {
  app.logger.info(`Scheduled job started at ${moment()}`)
  models.Url.destroy({where: 
    {createdAt: {
      [Op.lte]: moment().subtract(15, 'days').toDate()
    }
  }})
  .then(resolve => {
    app.logger.info(`Successfully deleted ${resolve.length} records`);
  })
  .catch(reason => {
    app.logger.fatal(reason.stack);
  })
})

module.exports.logger = logger;
module.exports = app;
