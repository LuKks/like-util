/*
 like-util (https://npmjs.com/package/like-util)
 Copyright 2020 Lucas Barrena
 Licensed under MIT (https://github.com/LuKks/like-util)
*/

'use strict';

function millis () {
  return Date.now();
}

function seconds () {
  return Math.floor(Date.now() / 1000);
}

module.exports = {
  millis,
  seconds
};
