const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.response")
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case 'Electronics':
        return new Electronic(payload).createProduct()
      case 'Clothing':
        return new Clothing(payload).createProduct()
      default:
        throw new BadRequestError(`Invalid Product Type ${type}`);
    }
  }
}

class Product {
  constructor({
    product_name,
    product_price,
    product_thumpnail,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_price = product_price;
    this.product_thumpnail = product_thumpnail;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct() {
    return await product.create(this);
  }
}

class Clothing extends Product {

  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if(!newClothing) throw new BadRequestError("Clothing creation failed");
    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError("Product creation error")
    return newProduct
  }
}

class Electronic extends Product {

  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if(!newElectronic) throw new BadRequestError("Electronic creation failed");
    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError("Product creation error")

    return newProduct
  }
}

module.exports = ProductFactory;