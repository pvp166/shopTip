
const express= require('express');
const productController = require('@src/controllers/product.controller');
const  asyncHandler = require('@src/helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();


router.use(authentication);

router.post('', asyncHandler(productController.createProduct));
module.exports = router;