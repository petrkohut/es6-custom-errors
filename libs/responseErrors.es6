class ResponseError extends Error {
    constructor(message, type, status) {
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.message = message;
        this.type = type;
        this.status = status;
    }
}

export class ForbiddenError extends ResponseError {
    constructor() {
        super('Site access denied.', 'Forbidden', 403);
    }
}

export class InvalidTokenError extends ResponseError {
    constructor() {
        super('Specified token is invalid.', 'InvalidToken', 401);
    }
}
