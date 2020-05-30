const assert = require("assert")
const admin = require("firebase-admin")

module.exports = async ({ orderId, user }, ctx) => {
  assert(orderId, "OrderId must be set")

  const { lineItems, stripeAccount } = await ctx.db
    .ref(`orders/${orderId}`)
    .once("value")
    .then(s => s.val())

  const { name } = await ctx.db
    .ref(`shops/${stripeAccount}`)
    .once("value")
    .then(s => s.val())

  const session = await ctx.stripe.checkout.sessions.create(
    {
      line_items: lineItems,
      mode: "payment",
      metadata: { orderId, updated_at: Date.now() },
      payment_method_types: ["card"],
      payment_intent_data: {
        description: `Thanks for ordering from ${name}!`,
        statement_descriptor: `${name}!`,
        setup_future_usage: "on_session",
        receipt_email: user.email,
        application_fee_amount: ctx.config.stripe.application_fee_amount,
      },
      client_reference_id: user.uid,
      customer_email: user.email,
      success_url: `${ctx.config.baseUrl}/order/${orderId}`,
      cancel_url: `${ctx.config.baseUrl}/order/${orderId}`,
    },
    { stripeAccount }
  )

  await ctx.db.ref(`orders`).child(orderId).update({ sessionId: session.id })

  // Poll for incoming payment on session
  // waitForPayment({ session, stripeAccount }, ctx)

  // Return session to user so they can proceed to pay
  return session
}

async function waitForPayment({ session, stripeAccount }, ctx) {
  const event = await ctx.stripe.events
    .list(
      {
        type: "checkout.session.completed",
        created: {
          gte: Math.floor(session.metadata.updated_at / 1000),
        },
      },
      { stripeAccount }
    )
    .then(({ data }) => data.filter(event => event.data.id === session.id))

  if (event) {
    return ctx.db.ref("orders").child(session.metadata.orderId).update({
      status: "PAID",
      updated_at: admin.database.ServerValue.TIMESTAMP,
    })
  } else {
    setTimeout(() => waitForPayment({ session, stripeAccount }, ctx), 2000)
  }
}
