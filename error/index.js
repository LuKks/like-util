/*
 like-util (https://npmjs.com/package/like-util)
 Copyright 2020 Lucas Barrena
 Licensed under MIT (https://github.com/LuKks/like-util)
*/

'use strict';

const yup = require('yup');

class ErrorHandler extends Error {
  constructor (statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }

  static middleware (err, req, res, next) {
    let validation = err instanceof yup.ValidationError;
    let critical = !(err instanceof ErrorHandler || validation);

    if (critical) console.error(err.stack);
    if (res.headersSent) return next(err);
    if (validation && !err.statusCode) err.statusCode = 400;
    if (!err.statusCode) err.statusCode = 500;

    res.status(err.statusCode).json({
      error: err.statusCode,
      message: critical ? 'Internal Error' : err.message
    });
  }
}

module.exports = {
  yup,
  ErrorHandler
};
