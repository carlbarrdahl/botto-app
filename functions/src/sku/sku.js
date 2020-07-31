const SKU_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
}

function createSku(productId, attributes, price, currency, status, ctx) {
  return new Promise(resolve =>
    ctx.stripe.skus.create(
      {
        attributes,
        price,
        currency,
        inventory: { type: "bucket", value: status },
        product: productId,
      },
      (err, sku) => resolve([sku, err])
    )
  )
}

function listSkus(ctx) {
  return new Promise(resolve =>
    ctx.stripe.skus.list(
      {
        active: true,
        expand: ["data.product"],
      },
      (err, product) => resolve([product.data, err])
    )
  )
}

function getSku(id, ctx) {
  return new Promise(resolve => {
    ctx.stripe.sku.retrieve(id, (err, sku) => resolve([sku, err]))
  })
}

function updateSku(id, price, status, ctx) {
  return new Promise(resolve =>
    ctx.stripe.skus.update(
      id,
      {
        price,
        inventory: {
          value: status,
        },
      },
      (err, sku) => resolve([sku, err])
    )
  )
}

function deleteSku(id, ctx) {
  return new Promise(resolve =>
    ctx.stripe.skus.del(id, function (err) {
      resolve(err.statusCode)
    })
  )
}

module.exports = {
  createSku,
  listSkus,
  getSku,
  updateSku,
  deleteSku,
  SKU_STATUS,
}
