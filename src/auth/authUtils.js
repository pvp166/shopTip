const JWT = require('jsonwebtoken');
const asyncHandler = require('@src/helpers/asyncHandler');
const HEADER = require('@src/configs/constant');
const { AuthFailureError, NotFoundError } = require('../core/error.response');
const  KeyTokenService  = require('../services/keyToken.service');
const createTokenPair = async(payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        });
        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        });
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.error(`error verify::`, err);
            }else {
                console.log(`decode verify::`, decode)
            }
        });
        return { accessToken, refreshToken};
    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID];
    if(!userId) throw new AuthFailureError('Invalid Request');
    
    /*
    1- Check userId missing
    2- Get access token from header
    3- verify access token
    4- check user in dbs
    5- check keystore with this userId
    6- return next
    */
    const keyStore = await KeyTokenService.findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Noy found key store');
    const accessToken = req.headers[HEADER.AUTHORIZATION];
    if(!accessToken) throw new AuthFailureError('Invalid Request');
    try {
        const decodedUser = JWT.verify(accessToken, keyStore.publicKey);
        if(userId !== decodedUser.userId) throw new AuthFailureError('Invalid User');
        req.keyStore = keyStore;
        return next();
    }
    catch (error) {
        throw new AuthFailureError('Invalid Token');
    }
})
const verifyJWT = async (token, publicKey) => {
    return await JWT.verify(token, publicKey);
}   

module.exports = {
    createTokenPair, 
    authentication,
    verifyJWT
}