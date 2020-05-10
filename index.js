/*
 like-util (https://npmjs.com/package/like-util)
 Copyright 2020 Lucas Barrena
 Licensed under MIT (https://github.com/LuKks/like-util)
*/

'use strict';

let like = {};

['crypto', 'database', 'date', 'error', 'network', 'others'].forEach(folder => {
  like[folder] = require('./' + folder);
});

module.exports = like;
