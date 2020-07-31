const { listSkus } = require("../sku")

module.exports = async ({ user }, ctx) => {
  const { stripeAccount } = await ctx.db
    .ref(`users/${user.uid}`)
    .once("value")
    .then(snap => snap.val())

  const skus = await listSkus(context, stripeAccount)
  const data = skus.filter(sku => sku.product.active)

  ctx.db.ref(`shops/${stripeAccount}/skus`).set(data)

  return data
}
