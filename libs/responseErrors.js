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
