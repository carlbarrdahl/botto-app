const syncStripeProducts = require("./")

const { context, mockDb, values } = require("../../test/utils")

test("Sync Stripe products", async () => {
  const params = { user: values.auth }
  const res = await syncStripeProducts(params, context)

  // Get shop
  expect(context.db.ref).toHaveBeenCalledWith(`users/${params.user.uid}`)

  // Get Stripe products
  expect(context.stripe.skus.list).toHaveBeenCalledWith(
    { active: true, expand: ["data.product"] },
    { stripeAccount: values.shops.stripeAccount }
  )

  // Set shop products
  expect(context.db.ref).toHaveBeenCalledWith(
    `shops/${values.users.stripeAccount}/skus`
  )
  expect(mockDb.set).toHaveBeenCalledWith(values.skus)

  expect(res).toEqual(values.skus)
})
