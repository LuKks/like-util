/*
 like-util (https://npmjs.com/package/like-util)
 Copyright 2020 Lucas Barrena
 Licensed under MIT (https://github.com/LuKks/like-util)
*/

'use strict';

const util = require('util');
const crypto = require('crypto');
const nanoid = require('nanoid/async');

function createHash (algo, text) {
  return crypto.createHash(algo).update(text).digest('hex');
}

function createHmac (algo, text, key) {
  return crypto.createHmac(algo, key).update(text).digest('hex');
}

const scrypt = util.promisify(crypto.scrypt);
const randomBytes = util.promisify(crypto.randomBytes);

/*
let hashed = passwordHash('hwy123'); // 108 len EcM4...3Fr4+I=
let result = passwordHash('hwy123', hashed); // EcM4...3Fr4+I= (same output)
let success = hashed === result; // true
*/
async function passwordHash (secret, verify) {
  let salt = verify ? Buffer.from(verify, 'base64').slice(0, 16) : await randomBytes(16);
  let hash = await scrypt(secret, salt, 64);
  return Buffer.concat([salt, hash]).toString('base64');
}

function randomHex (len) {
  return randomBytes(len).then(buf => buf.toString('hex'));
}

// like Math.random(), 0 (inclusive) and 1 (exclusive)
function randomFloat () {
  return randomBytes(8).then(buffer => {
    return _int2float(parseInt(buffer.toString('hex'), 16));
  });
}

function randomInt (min, max) {
  return randomFloat().then(float => {
    return Math.floor(float * (max - min) + min);
  });
}

function randomId () {
  return nanoid.nanoid();
}

function randomString (alphabet, len) {
  return nanoid.customAlphabet(alphabet, len)();
}

function randomAlpha (len) {
  return nanoid.customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', len)();
}

module.exports = {
  createHash,
  createHmac,
  scrypt,
  randomBytes,
  passwordHash,
  randomHex,
  randomFloat,
  randomInt,
  randomId,
  randomString,
  randomAlpha
};

// helpers
function _int2float(integer) {
  return integer / Math.pow(2, 64);
}
