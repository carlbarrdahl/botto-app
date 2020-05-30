const payOrder = require(".")

const { context, mockDb, values } = require("../../test/utils")

test("Pay order", async () => {
  const params = {
    orderId: "orderId",
    user: { uid: "uid" },
  }
  const res = await payOrder(params, context)
  expect(context.stripe.checkout.sessions.create).toHaveBeenCalledWith(
    {
      line_items: values.orders.lineItems,
      mode: "payment",
      metadata: {
        orderId: params.orderId,
        updated_at: { ".sv": "timestamp" },
      },
      payment_method_types: ["card"],
      payment_intent_data: { application_fee_amount: 200 },
      success_url: `baseUrl/order/${params.orderId}`,
      cancel_url: `baseUrl/order/${params.orderId}`,
    },
    { stripeAccount: values.shops.stripeAccount }
  )
  expect(res).toEqual(values.session)
})
