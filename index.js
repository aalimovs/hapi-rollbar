'use strict';

const Joi = require('joi');
const Hoek = require('hoek');
const Rollbar = require('rollbar');

const internals = {};

internals.optionsSchema = Joi.object({
	token: Joi.string().required(),
	environment: Joi.string().required(),
	codeVersion: Joi.string().required(),
}).required();

exports.register = function (server, options, next) {
	Joi.assert(options, internals.optionsSchema, 'Invalid options');

	Rollbar.init(options.token, {
		environment: options.environment,
		codeVersion: options.codeVersion,
	});

	server.on('request-error', function (request, error) {
		Rollbar.handleErrorWithPayloadData(error, {
			level: 'error',
			msg: error.message,
			req_id: request.id,
			stack: error.stack,
			error: error,
		}, Hoek.merge(request, {
			url: request.url.path, // overwrite url for Rollbar, since request.url is an object making Rollbar show url as [object Object]
		}));
	});

	return next();
};

exports.register.attributes = {
	pkg: require('./package.json'),
};
