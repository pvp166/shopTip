const { statusCodes, reasonStatusCode } = require('@src/utils/httpStatusCode.js');

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.CONFLICT, statusCode = statusCodes.CONFLICT) {
        super(message, statusCode)
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.FORBIDDEN, statusCode = statusCodes.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = reasonStatusCode.UNAUTHORIZED, statusCode = statusCodes.UNAUTHORIZED) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = reasonStatusCode.NotFoundError, statusCode = statusCodes.NOT_FOUND) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = reasonStatusCode.FORBIDDEN, statusCode = statusCodes.F) {
        super(message, statusCode)
    }
}
module.exports = {
    ConflictRequestError,
    ErrorResponse,
    BadRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
} 