const { statusCodes, reasonStatusCode } = require('@src/utils/httpStatusCode.js');

class SuccessResponse {
    constructor({message, statusCode = statusCodes.OK, reason = reasonStatusCode.OK, metadata= {}}) {
        this.message = !message ? reason : message;
        this.status = statusCode;
        this.metadata = metadata
    }
    send(res, headers = {}){
        console.log(this.status);
        return res.status(this.status).json(this)
    }
}

class OK extends SuccessResponse {
    constructor({message, metadata}){
        super({message, metadata})
    }
}

class Created extends SuccessResponse {
    constructor({options = {}, message, statusCode= statusCodes.CREATED, reason = reasonStatusCode.CREATED, metadata}){
        super({message, statusCode, reason, metadata});
        this.options = options
    }
}


module.exports = {OK, Created, SuccessResponse}