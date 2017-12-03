/**
 * Created by borzou on 9/27/16.
 */

import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import swagger from 'tbe-swagger2-express';
import routes from './routes/index';
import api from './routes/api';
import config from './config';
const pack = require('./package.json');

const app = express();
const hDomain = (process.env.HOST_DOMAIN) ? process.env.HOST_DOMAIN : config.swaggerDomain;
console.info('Informing Swagger client of host domain: '+hDomain);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
let swagSchema = 'http';
if(process.env.NODE_ENV==='production' || process.env.NODE_ENV==='QA'){
	app.use(logger('tiny'));
	swagSchema = 'https';
}
else app.use(logger('dev'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views'));

app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, DELETE, PUT, PATCH, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, api_key, Authorization');
	next();
});

app.use(swagger.init(app, {
	apiVersion: pack.version,
	swaggerVersion: '2.0',
	host: hDomain,
	basePath: '/api',
	swaggerURL: '/docs',
	swaggerJSON: '/api-docs',
	swaggerUI: './public/swagger',
	schemes: [swagSchema],
	info: {
		version: pack.version,
		title: 'United Effects Product Authorization',
		description: 'UE Product registers products to have licenses and users registered against. All endpoints require ADMIN access except those with webhook control.'
	},
	tags: [
		{
			name: 'Health',
			description: 'Logs and Health'
		},
		{
			name: 'Product Management',
			description: 'New Products'
		},
		{
			name: 'Validate',
			description: 'Validate a Access'
		}
	],
	securityDefinitions: {
		'api_key': {
			'type': 'apiKey',
			'name': 'api_key',
			'in': 'header'
		}
	},
	paths: ['./services/yaml/api.yml']
}));

app.use('/', routes);
app.use('/api', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers
// will print stacktrace
if (process.env.NODE_ENV !== 'production') {
	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.json('error', {
		message: err.message,
		error: {}
	});
});

let uncaught = 0;

process.on('uncaughtException', function(err) {
	uncaught++;
	if(uncaught < 20) {
		console.error(' UNCAUGHT EXCEPTION - Uncaught #: '+uncaught+'. Notifications will stop after 20 exceptions. Restart this container after that.');
		console.error('[Inside \'uncaughtException\' event] ' + err.stack || err.message);
	}else process.exit(1);
});

export default app;