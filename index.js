const shared = require('./shared')
const util = require('util')
const crypto = require('crypto')
const yup = require('yup')

const scrypt = util.promisify(crypto.scrypt)
const randomBytes = util.promisify(crypto.randomBytes)

// crypto
function createHash (algo, text) {
  return crypto.createHash(algo).update(text).digest('hex')
}

function createHmac (algo, key, text) {
  return crypto.createHmac(algo, key).update(text).digest('hex')
}

/*
const hashed = passwordHash('hwy123') // 108 len EcM4...3Fr4+I=
const result = passwordHash('hwy123', hashed) // EcM4...3Fr4+I= (same output)
const success = hashed === result // true
*/
async function passwordHash (secret, verify) {
  const salt = verify ? Buffer.from(verify, 'base64').slice(0, 16) : await randomBytes(16)
  const hash = await scrypt(secret, salt, 64)
  return Buffer.concat([salt, hash]).toString('base64')
}

function randomHex (len) {
  return randomBytes(len).then(buf => buf.toString('hex'))
}

// like Math.random(), 0 (inclusive) and 1 (exclusive)
function randomFloat () {
  return randomBytes(8).then(buffer => {
    return _int2float(parseInt(buffer.toString('hex'), 16))
  })
}

function randomInt (min, max) {
  return randomFloat().then(float => {
    return Math.floor(float * (max - min) + min)
  })
}

function _int2float (integer) {
  return integer / Math.pow(2, 64)
}

// network
// ip2int('142.250.188.14') // => 2398796814
// ip2int('113.5.67.242') // => 1896170482
function ip2int (ip) {
  ip = ip.split('.')
  return ((parseInt(ip[0], 10) << 24) >>> 0) + ((parseInt(ip[1], 10) << 16) >>> 0) + ((parseInt(ip[2], 10) << 8) >>> 0) + (parseInt(ip[3], 10) >>> 0)
}

// int2ip(2398796814) // => '142.250.188.14'
// int2ip(1896170482) // => '113.5.67.242'
function int2ip (int) {
  return ((int >> 24) & 255) + '.' + ((int >> 16) & 255) + '.' + ((int >> 8) & 255) + '.' + (int & 255)
}

// errors
class ErrorHandler extends Error {
  constructor (statusCode, message) {
    super()
    this.statusCode = statusCode
    this.message = message
  }

  static middleware (err, req, res, next) {
    const validation = err instanceof yup.ValidationError
    const critical = !(err instanceof ErrorHandler || validation)

    if (critical) console.error(err.stack)
    if (res.headersSent) return next(err)
    if (!err.statusCode) err.statusCode = validation ? 400 : 500

    res.status(err.statusCode).json({
      error: err.statusCode,
      message: critical ? 'Internal Error' : err.message
    })
  }
}

// date
function dateToSeconds () {
  return Math.floor(Date.now() / 1000)
}

// dateToLocale() // => '21/03/2022, 01:47:21'
// dateToLocale({ year: false, second: false }) // => '21/03, 01:47'
// dateToLocale({ time: 1647838051337, millis: true }) // => '21/03/2022, 01:47:31.337'
function dateToLocale (o = {}) {
  const date = o.time ? new Date(o.time) : new Date()
  return date.toLocaleString(o.locale || 'en-GB', {
    hour12: o.hour12 || false,
    day: 'numeric',
    month: 'numeric',
    year: o.year === false ? undefined : 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: o.second === false ? undefined : 'numeric',
    fractionalSecondDigits: o.millis ? 3 : undefined
  })
}

// others
function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// from stackoverflow or https://gomakethings.com/check-if-two-arrays-or-objects-are-equal-with-javascript/
function isObjectEqual (value, other) {
  const type = Object.prototype.toString.call(value)
  if (type !== Object.prototype.toString.call(other)) return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false

  const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length
  const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length
  if (valueLen !== otherLen) return false

  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false
    }
  } else {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (compare(value[key], other[key]) === false) return false
      }
    }
  }

  return true

  function compare (item1, item2) {
    const itemType = Object.prototype.toString.call(item1)

    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isObjectEqual(item1, item2)) return false
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) return false
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false
      } else {
        if (item1 !== item2) return false
      }
    }
  }
}

module.exports = {
  ip2int,
  int2ip,

  createHash,
  createHmac,

  randomBytes,
  randomHex,
  randomFloat,
  randomInt,
  passwordHash,

  ErrorHandler,

  dateToSeconds,
  dateToLocale,

  sleep,
  isObjectEqual,

  shared
}
