const {
  product,
  electronic,
  furniture,
  clothing,
} = require("../../models/product.model");

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const getListSearchProduct =  async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product.find({
    isPublish: true,
    $text: {$search: regexSearch},
  }, {score: {meta: 'textScore'}}).sort({score: {$meta: 'textScore'}}).lean()
  return results;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });

  foundShop.isDraft = false;
  foundShop.isPublish = true;
  return await foundShop.save();
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: product_shop,
    _id: product_id,
  });

  foundShop.isDraft = true;
  foundShop.isPublish = false;
  return await foundShop.save();
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const queryProduct = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findAllProducts = async() => {
  
}

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  getListSearchProduct,
  findAllProducts
};
