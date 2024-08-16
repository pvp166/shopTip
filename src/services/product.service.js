const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  getListSearchProduct,
  findAllProducts,
} = require("../models/repositories/product.repo");
class ProductFactory {
  static productRegistry = {};
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];

    if (!productClass)
      throw new BadRequestError(`Invalid Product Types ${type}`);

    return new productClass(payload).createProduct();
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }
  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  static async getListSearchProduct({ keySearch }) {
    return await getListSearchProduct({ keySearch });
  }
  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublish },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_prce", "product_thumb"],
    });
  }
  static async findProduct({ keySearch }) {
    return await getListSearchProduct({ keySearch });
  }
}

class Product {
  constructor({
    product_name,
    product_price,
    product_thumbnail,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_price = product_price;
    this.product_thumbnail = product_thumbnail;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Clothing creation failed");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Product creation error");
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("Electronic creation failed");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Product creation error");

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Furniture creation failed");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Product creation error");
    return newProduct;
  }
}

//register product types
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);
module.exports = ProductFactory;
