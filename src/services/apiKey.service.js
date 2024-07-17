const apiKeyModel = require('@src/models/apiKey.model');
const crypto = require('node:crypto')
class ApiKeyService {
    static findById = async (key) => {
        const objKey = await apiKeyModel.findOne({ key, status: true}).lean();
        return objKey;
    }}
module.exports = ApiKeyService