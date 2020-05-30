const assert = require("assert")
const admin = require("firebase-admin")

module.exports = async ({ sessionId, stripeAccount }, ctx) => {
  assert(sessionId, "Session id must be set")
  console.log(sessionId, stripeAccount)
  const session = await ctx.stripe.checkout.sessions.retrieve(sessionId, {
    stripeAccount,
  })

  return await waitForPayment({ session, stripeAccount }, ctx)
}

async function waitForPayment({ session, stripeAccount }, ctx) {
  console.log("waitForPayment")
  let timeout
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
    .then(({ data }) => data.find(event => event.data.object.id === session.id))

  if (event) {
    clearTimeout(timeout)
    return ctx.db.ref("orders").child(session.metadata.orderId).update({
      status: "PAID",
      updated_at: admin.database.ServerValue.TIMESTAMP,
    })
  } else {
    timeout = setTimeout(
      () => waitForPayment({ session, stripeAccount }, ctx),
      2000
    )
  }
}
