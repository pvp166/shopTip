const express= require('express');
const { apiKey, permission } = require('@src/auth/checkAuth');
const router = express.Router();

router.use(apiKey);
router.use(permission('0000'));

router.use('/v1/api/product', require('./product'));
router.use('/v1/api', require('./access'));

module.exports = router;