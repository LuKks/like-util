# like-util

Repetitive codes that I always use.

![](https://img.shields.io/npm/v/like-util.svg) ![](https://img.shields.io/npm/dt/like-util.svg) ![](https://img.shields.io/github/license/LuKks/like-util.svg)

```javascript
const { createHash, createHmac, scrypt, randomBytes, passwordHash } = require('like-util/crypto');
const { randomHex, randomFloat, randomInt, randomId, randomString, randomAlpha } = require('like-util/crypto');
const { db } = require('like-util/database');
const { millis, seconds } = require('like-util/date');
const { yup, ErrorHandler } = require('like-util/error');
const { request, ip2int, int2ip } = require('like-util/network');
const { sleep, isObjectEqual } = require('like-util/others');
```

## Install
```
npm i like-util
```

## Features
#### crypto
```javascript
createHash(algo: String, text: String): String
createHmac(algo: String, text: String, key: String): String
scrypt(password, salt, keylen): Buffer
randomBytes(size: Number): Buffer
passwordHash(secret: String, verify?: String): Buffer
randomHex(len: Number): String
randomFloat(): Number
randomInt(min: Number, max: Number): Number
randomId(): String
randomString(alphabet: String, len: Number): String
randomAlpha(len: Number): String
```

#### database
```javascript
db: Object
```

#### date
```javascript
millis(): Number
seconds(): Number
```

#### error
```javascript
yup: Object (library 'npmjs.com/yup')
ErrorHandler(statusCode: Number, message: String): undefined
ErrorHandler.middleware(err, req, res, next): undefined
```

#### network
```javascript
request: Object (library 'npmjs.com/request-promise-native')
ip2int(ip: String): Number
int2ip(int: Number): String
```

#### others
```javascript
sleep(ms: Number): Number
isObjectEqual(a: Object|Array, b: Object|Array): Boolean
```

## Examples
#### How to use the very useful `db` object?
It's just a quick access for an object.\
At the start-up of your app, you can initialize it:
```javascript
const like = require('like-util');
const mongodb = require('mongodb'); // or use node-mysql2, like-mysql, etc

mongodb.MongoClient.connect('mongodb://...', function (err, client) {
  if (err) throw err;
  like.database.db = client.db(database); // initialization
  // it's ready to use
});

```
And after that, you can use it in any other places:
```javascript
const { db } = require('like-util/database');
db.users.insertOne({ username: 'lukks' });
```

#### What about `ErrorHandler`?
It can help you handling errors in your HTTP server:
```javascript
const express = require('express');
const { ErrorHandler } = require('like-util/error');
require('express-async-errors'); // I strongly recommend this library
const app = express();

app.post((req, res) => {
  let isUsernameUsed = true;
  if (isUsernameUsed) {
    // easy way to throw a simple validation error
    throw ErrorHandler(400, 'The username is already used, pick another one');
  }
});

app.use(ErrorHandler.middleware); // handle errors

app.listen(3000, () => console.log('listening'));
```

#### Combining `ErrorHandler` and `yup`
```javascript
const express = require('express');
const { yup, ErrorHandler } = require('like-util/error');
require('express-async-errors'); // I strongly recommend this library
const app = express();

// I really like yup, it's very easy to create schemas for requests
const schema = yup.object().shape({
  email: yup.string().default('').min(5).max(128),
  password: yup.string().default('').min(4),
  repassword: yup.string().default('').oneOf([yup.ref('password')])
});

app.post(async (req, res) => {
  // we don't need to try-catch, we have express-async-errors and ErrorHandler
  let body = await schema.validate(req.body);

  if (body.password !== body.repassword) {
    throw ErrorHandler(400, 'The passwords are not equals');
  }
});

app.use(ErrorHandler.middleware); // handle errors

app.listen(3000, () => console.log('listening'));
```

## Tests
```
There are no tests yet
```

## License
Code released under the [MIT License](https://github.com/LuKks/like-util/blob/master/LICENSE).
