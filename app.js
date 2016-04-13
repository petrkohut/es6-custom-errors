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
