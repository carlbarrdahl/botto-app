module.exports = async ({ user }, ctx) => {
  const { stripeAccount } = await ctx.db
    .ref(`users/${user.uid}`)
    .once("value")
    .then(snap => snap.val())

  return ctx.stripe.skus
    .list({ active: true, expand: ["data.product"] }, { stripeAccount })
    .then(({ data }) => {
      data = data.filter(sku => sku.product.active)
      ctx.db.ref(`shops/${stripeAccount}/skus`).set(data)
      return data
    })
}
