"use strict";

const ProductService = require("@src/services/product.service");
const { Created, SuccessResponse } = require("@src/core/success.response");
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new Product success!!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list success!!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get publish success!!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product Success!!",
      metadata: await ProductService.publishProductByShop(
      {
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "unPublish Product Success!!",
      metadata: await ProductService.unPublishProductByShop(
      {
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "get list getAllPublishForShop Success!!",
      metadata: await ProductService.getListSearchProduct(req.params),
    }).send(res);
  };
}

module.exports = new ProductController();
