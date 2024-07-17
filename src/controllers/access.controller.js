const AccessService = require('@src/services/access.service')
const {Created, SuccessResponse} = require('@src/core/success.response');
class AccessController {
    handleRefreshToken = async (req, res, next) => {
        new SuccessResponse({
            message: 'Refresh Token OK!',
            metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
        }).send(res);
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res);
    }
    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout OK!',
            metadata: await AccessService.logout(req)
        }).send(res);
    }
    signUp = async (req, res, next) => {
        new Created({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res);
    }
}

module.exports = new AccessController();