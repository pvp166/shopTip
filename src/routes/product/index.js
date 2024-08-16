
const express= require('express');
const productController = require('@src/controllers/product.controller');
const  asyncHandler = require('@src/helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

router.use(authenticationV2);

router.post('', asyncHandler(productController.createProduct));
router.put('/publish/:id', asyncHandler(productController.publishProductByShop));
router.put('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))
router.get('/draft/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))

module.exports = router;