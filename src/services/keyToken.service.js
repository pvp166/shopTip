const keyTokenModel = require("@src/models/keytoken.model");
const { ObjectId } = require('mongodb');
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = { user: userId }, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            )
            return tokens ? publicKey : null
        } catch (error) {
            return error
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({user: userId}).lean();
    }
    static deleteKeyToken = async (_id) => {
        return await keyTokenModel.deleteOne({ _id });
    }
    static findByUsedRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({refreshTokensUsed: refreshToken}).lean();  
    }
    static findByRefreshToken = async ({refreshToken}) => {
        return await keyTokenModel.findOne({refreshToken});
    }
    static deleteKeyTokenByUserId = async (_id) => {
        return await keyTokenModel.deleteOne ({user:  _id });
    }
}

module.exports = KeyTokenService 