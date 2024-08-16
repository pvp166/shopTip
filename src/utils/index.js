const _ = require('lodash');
const crypto = require('node:crypto');

const getInfoData = ({ fields = [], object = {}}) => {
    return _.pick(object, fields);
}

const keyGenerate = () => {
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    return {privateKey, publicKey}
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

module.exports = {
    getInfoData, keyGenerate, getSelectData
}