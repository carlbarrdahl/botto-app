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
 
 * @param {*} product
 * @param {*} account
 * @returns
 */
function createProduct(ctx, product, account) {
  return ctx.stripe.products
    .create(product, { stripeAccount: account })
    .then(data => [data, null])
    .catch(err => [null, err])
}
/**
 * Fetches active=bool products marked as goods.
 
 * @param {*} ctx
 * @param {*} stripeAccount
 * @param {boolean} [active=true]
 * @returns
 */
function getProducts(ctx, stripeAccount, active = true) {
  return ctx.stripe.products
    .list(
      {
        active,
        type: "good",
      },
      { stripeAccount }
    )
    .then(products => [products.data, null])
    .catch(err => [null, err])
}

/**
 * Retrieves a specific product by ID.
 *
 * @param {*} ctx
 * @param {*} stripeAccount
 * @param {*} id
 * @returns
 */
function getProduct(ctx, stripeAccount, id) {
  return ctx.stripe.products
    .retrieve(id, { stripeAccount })
    .then(data => [data, null])
    .catch(err => [null, err])
}

/**
 * Removes product by ID
 *
 * @param {*} ctx
 * @param {*} stripeAccount
 * @param {*} id
 * @returns
 */
function deleteProduct(ctx, stripeAccount, id) {
  return ctx.stripe.products
    .del(id, { stripeAccount })
    .catch(err => [null, err.statusCode])
}

module.exports = {
  createProduct,
  productFactory,
  getProducts,
  deleteProduct,
  getProduct,
}
