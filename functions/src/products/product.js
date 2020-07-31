const product = require(".")

const Product = {
  name: "",
  description: "",
  active: true, // Whether the product is available for purchase
  metadata: {}, // Set of key-value pairs that you can attach to an object
  caption: "", // A short one-line description of the product
  images: [], // optional A list of up to 8 URLs of images for this product
  statement_descriptor: "", // An arbitrary string to be displayed on your customer’s credit card or bank statement.
  type: "service",

  init({ name, description }) {
    this.name = name
    this.description = description
    this.type = "good"

    return this
  },
}

function productFactory() {
  return Object.create(Product)
}

/**
 * Creates a new product, passed object should be constructed using the productFactory.
 *
 * @param {*} product
 * @param {*} ctx
 * @returns
 */
function createProduct(product, ctx) {
  return new Promise(resolve => {
    ctx.stripe.products.create(product, (err, product) =>
      resolve([product, err])
    )
  })
}

/**
 * Fetches active=bool products marked as goods.
 *
 * @param {boolean} [active=true]
 * @param {*} ctx
 * @returns
 */
function getProducts(active = true, ctx) {
  return new Promise(resolve => {
    ctx.stripe.products.list(
      {
        active,
        type: "good",
      },
      (err, products) => resolve([products.data, err])
    )
  })
}

/**
 * Retrieves a specific product by ID.
 *
 * @param {*} productId
 * @param {*} ctx
 * @returns
 */
function getProduct(productId, ctx) {
  return new Promise(resolve => {
    ctx.stripe.products.retrieve(productId, (err, product) =>
      resolve([product, err])
    )
  })
}

/**
 * Removes product by ID
 *
 * @param {*} productId
 * @param {*} ctx
 * @returns
 */
function deleteProduct(productId, ctx) {
  return new Promise(resolve => {
    ctx.stripe.products.del(productId, err => resolve(err))
  })
}

module.exports = {
  createProduct,
  productFactory,
  getProducts,
  deleteProduct,
  getProduct,
}
