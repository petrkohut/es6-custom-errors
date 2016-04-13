#ES6 implementation of custom errors in Express app
Tutorial about how easy is it to create your own custom error classes in ES6.

##Simple example
```es6
class CustomError extends Error {
    constructor(message, someProperty) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.someProperty = someProperty;
    }
}

class SomeError extends CustomError {
    constructor() {
        super('Some error occurred.', 'Foo');
    }
}

class SomeAnotherError extends CustomError {
    constructor() {
        super('Some another error occurred.', 'Bar');
    }
}

const err = new SomeError();
console.log(err instanceof Error);              // true
console.log(err instanceof CustomError);        // true
console.log(err instanceof SomeAnotherError);   // false
```

##Example in Express app:
libs/responseErrors.js:
```es6
'use strict'

class ResponseError extends Error {
    constructor(message, type, status) {
        super(message)
        Error.captureStackTrace(this, this.constructor)
        this.name = this.constructor.name
        this.type = type
        this.status = status
    }
}

module.exports.ForbiddenError = class extends ResponseError {
    constructor() {
        super('Site access denied.', 'Forbidden', 403)
    }
}

module.exports.InvalidTokenError = class extends ResponseError {
    constructor() {
        super('Specified token is invalid.', 'InvalidToken', 401)
    }
}
```
app.js:
```es6
'use strict'

const express = require('express')
const errors = require('./libs/responseErrors')

const app = express()

//Get item with id = 1
app.get('/items/1', (req, res, next) => {
    res.json({name: 'Foo', description: 'Bar'})
})

//Create new item
app.post('/items', (req, res, next) => {
    //Failed token validation
    next(new errors.InvalidTokenError())
})

//Handle all other requests as Forbidden
app.use((req, res, next) => {
    next(new errors.ForbiddenError())
})

//Error handler
app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    const type = err.type || 'UnknownError'
    const message = err.message || 'Something went wrong.'
    res.status(statusCode).json({type, message})
})

//Start server
const server = app.listen(3000, () => {
    console.log('Listening on port %s', server.address().port)
})
```
###Install dependencies (Express)
from [package.json](https://github.com/PetrKohut/es6-custom-errors-express-app/blob/master/package.json)
```sh
npm install
```

###Start server
```sh
npm start
```

###Test APIs to see our custom errors
```sh
curl -X GET localhost:3000/items/1
# response: {"name":"Foo","description":"Bar"}
# statusCode: 200

curl -X POST localhost:3000/items -d '{"name":"Bar","description":"Foo"}'
# response: {"type":"InvalidToken","message":"Specified token is invalid."}
# statusCode: 401

curl -X GET localhost:3000/anything
# response: {"type":"Forbidden","message":"Site access denied."}
# statusCode: 403
```
