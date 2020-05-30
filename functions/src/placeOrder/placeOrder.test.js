const placeOrder = require("./")

const { context, mockDb, values } = require("../../test/utils")

test("Place order", async () => {
  const params = {
    lineItems: [{ price: "sku", quantity: 1 }],
    stripeAccount: "shop_id",
    user: { uid: "uid" },
  }
  const res = await placeOrder(params, context)
  // expect(context.db.ref).toHaveBeenCalledWith(`shops/${params.stripeAccount}`)

  const order = {
    created_at: {
      ".sv": "timestamp",
    },
    id: "key",
    lineItems: params.lineItems,
    stripeAccount: params.stripeAccount,
    status: "CREATED",
    uid: params.user.uid,
  }
  expect(mockDb.set).toHaveBeenCalledWith(order)
  expect(mockDb.set).toHaveBeenCalledWith(order.id)

  expect(res).toEqual(order)
})
