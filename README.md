# like-util

Repetitive codes that I always use.

![](https://img.shields.io/npm/v/like-util.svg) ![](https://img.shields.io/npm/dt/like-util.svg) ![](https://img.shields.io/github/license/LuKks/like-util.svg)

```javascript
// crypto
const { createHash, createHmac, passwordHash } = require('like-util')
const { randomBytes, randomHex, randomFloat, randomInt } = require('like-util')

// network
const { ip2int, int2ip } = require('like-util')

// errors
const { ErrorHandler } = require('like-util')

// date
const { dateToSeconds, dateToLocale } = require('like-util')

// others
const { sleep, isObjectEqual } = require('like-util')

// shared object
const { shared } = require('like-util')
const shared = require('like-util/shared')
```

## Install
```
npm i like-util
```

## Examples
#### crypto
```javascript
// hashing
createHash('sha1', 'secret text') // => '43de199bc1b7196be767cce745baece4dc95fbf2'
createHmac('sha1', 'secret key', 'secret text') // => '85c15fbb5b1c3afbd645f99977a260c4984086f8'

// password hash
const hashed = await passwordHash('hwy123') // 108 len EcM4...3Fr4+I=
const result = await passwordHash('hwy123', hashed) // EcM4...3Fr4+I= (same output)
const match = hashed === result // true

// All are cryptographically secure:
await randomBytes(4) // => <Buffer 52 62 03 01>
await randomHex(4) // => 'f3a66fa0' (bytes to hex are double in size)
await randomFloat() // => 0.29868882046557754
await randomInt(0, 3) // => 0, 1 or 2
```

Notice that `randomInt(min, max)`: `min` is inclusive and `max` is exclusive\
`randomFloat()` is like `Math.random()`: 0 (inclusive) and 1 (exclusive)

#### network
```javascript
ip2int('142.250.188.14') // => 2398796814
int2ip(2398796814) // => '142.250.188.14'

ip2int('113.5.67.242') // => 1896170482
int2ip(-2398796814) // => '113.5.67.242'
```

#### Date
```javascript
dateToSeconds() // => 1647838051

dateToLocale() // => '21/03/2022, 01:47:21'
dateToLocale({ year: false, second: false }) // => '21/03, 01:47'
dateToLocale({ time: 1647838051337, millis: true }) // => '21/03/2022, 01:47:31.337'
```

#### Others
```javascript
await sleep(1000)

isObjectEqual({ a: 1, b: 2 }, { a: 1, b: 2 }) // => true
isObjectEqual({ a: 1, b: 2 }, { b: 2, a: 1 }) // => true (still true)
isObjectEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } }) // => true
isObjectEqual({ a: 1, b: 2 }, { a: 1, b: 2, c: 3 }) // => false

const obj = { a: 1, b: function () {} }
isObjectEqual(obj, JSON.parse(JSON.stringify(obj))) // => false
```

#### Shared object
It's just a quick access for an object.\
At the start-up of your app, you can initialize it and then use it:
```javascript
// app.js
const shared = require('like-util/shared')
shared.web3 = new Web3()

// route.js
const { web3 } = require('like-util/shared')
// ...
```

#### `ErrorHandler`, optionally with `yup`
It can help you handling errors in your HTTP server:
```javascript
const express = require('express')
require('express-async-errors')
const { ErrorHandler } = require('like-util')
const yup = require('yup')

const app = express()

// I really like yup, it's very easy to create schemas for requests
const schema = yup.object().shape({
  email: yup.string().default('').min(5).max(128),
  password: yup.string().default('').min(4),
  repassword: yup.string().default('').oneOf([yup.ref('password')])
})

app.post('/signup', async function (req, res) {
  // We don't need to try-catch,
  // in case there is an error at validation, it will send status 400
  const body = await schema.validate(req.body)

  if (body.password !== body.repassword) {
    throw ErrorHandler(400, 'The passwords are not equals')
  }

  // Let's say this operation throws an error which is a critical error,
  // it will send status 500 with a generic message to avoid leaking internal errors
  await db.insert('users', { ... })

  res.send('ok')
})

app.use(ErrorHandler.middleware) // handle errors

app.listen(3000, () => console.log('listening'))
```

## Tests
```
There are no tests yet
```

## License
Code released under the [MIT License](https://github.com/LuKks/like-util/blob/master/LICENSE).
