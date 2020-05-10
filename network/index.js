/*
 like-util (https://npmjs.com/package/like-util)
 Copyright 2020 Lucas Barrena
 Licensed under MIT (https://github.com/LuKks/like-util)
*/

'use strict';

const request = require('request-promise-native');

function ip2int (ip) {
  ip = ip.split('.');
  return ((parseInt(ip[0], 10) << 24) >>> 0) + ((parseInt(ip[1], 10) << 16) >>> 0) + ((parseInt(ip[2], 10) << 8) >>> 0) + (parseInt(ip[3], 10) >>> 0);
}

function int2ip (int) {
  return ((int >> 24) & 255) + '.' + ((int >> 16) & 255) + '.' + ((int >> 8) & 255) + '.' + (int & 255);
}

module.exports = {
  request,
  ip2int,
  int2ip
};
