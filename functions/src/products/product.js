const Product = {
  name: "",
  description: "",
  active: true, // Whether the product is available for purchase
  metadata: {}, // Set of key-value pairs that you can attach to an object
  caption: "", // A short one-line description of the product
  images: [], // optional A list of up to 8 URLs of images for this product
  statement_descriptor: "", // An arbitrary string to be displayed on your customer’s credit card or bank statement.
  type: "good",

  init({ name, description }) {
    this.name = name
    this.description = description

    return this
  },
}

function createProduct(product, ctx) {
  return new Promise(resolve => {
    ctx.stripe.products.create(product, (err, product) => {
      resolve([product, err])
    })
  })
}

function productFactory() {
  return Object.create(Product)
}

module.exports = {
  createProduct,
  productFactory,
}
