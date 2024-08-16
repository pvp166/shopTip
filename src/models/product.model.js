"use strict";

const { model, Schema, Types } = require("mongoose");
const slugify = require("slugify")
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_thumbnail: { type: String, required: true },
    product_description: { type: String },
    product_slug: { type: String },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true },
    product_shop: String,
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating mus be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val *10) /10
    },
    product_variations: {type: Array, default: []},
    isDraft: {type: Boolean, default: true, index: true, select: false},
    isPublish: {type: Boolean, default: false, index: true, select: false}
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

productSchema.index({product_name: 'text', product_description: 'text'})

productSchema.pre('save', function (next){
  this.product_slug = slugify(this.product_name, {lower: true})
  next()
})

//define the product type = clothing, electronics, etc

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
  },
  {
    collection: "clothes",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: { type: String },
    color: { type: String },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
  },
  {
    collection: "electronics",
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: { type: String },
    material: { type: String },
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
  },
  {
    collection: "furnitures",
    timestamps: true,
  }
)

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronic", electronicSchema),
  furniture: model("Furniture", furnitureSchema)
};
