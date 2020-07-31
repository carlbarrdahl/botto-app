const SKU_STATUS = {
  IN_STOCK: "in_stock",
  OUT_OF_STOCK: "out_of_stock",
}

function createSku(
  ctx,
  stripeAccount,
  productId,
  attributes,
  price,
  currency,
  status
) {
  return ctx.stripe.skus
    .create(
      {
        attributes,
        price,
        currency,
        inventory: { type: "bucket", value: status },
        product: productId,
      },
      { stripeAccount }
    )
    .then(sku => [sku, null])
    .catch(err => [null, err])
}

function listSkus(ctx, stripeAccount) {
  return ctx.stripe.skus
    .list(
      {
        active: true,
        expand: ["data.product"],
      },
      { stripeAccount }
    )
    .then(skus => [skus.data, null])
    .catch(err => [null, err])
}

function getSku(ctx, stripeAccount, id) {
  return ctx.stripe.sku
    .retrieve(id, { stripeAccount })
    .then(sku => [sku, null])
    .catch(err => [null, err])
}

function updateSku(ctx, stripeAccount, id, price, status) {
  return ctx.stripe.skus
    .update(
      id,
      {
        price,
        inventory: {
          value: status,
        },
      },
      { stripeAccount }
    )
    .then(sku => [sku, null])
    .catch(err => [null, err])
}

function deleteSku(ctx, stripeAccount, id) {
  return ctx.stripe.skus.del(id, { stripeAccount }).catch(err => err.statusCode)
}

module.exports = {
  createSku,
  listSkus,
  getSku,
  updateSku,
  deleteSku,
  SKU_STATUS,
}
