const assert = require("assert")
const admin = require("firebase-admin")

module.exports = ({ lineItems = [], stripeAccount, user }, ctx) => {
  assert(stripeAccount, "StripeAccount must be set")
  assert(lineItems.length, "LineItems must not be empty")

  const { key: orderId } = ctx.db.ref(`orders`).push()

  const order = {
    id: orderId,
    uid: user.uid,
    lineItems,
    stripeAccount,
    status: "CREATED",
    created_at: admin.database.ServerValue.TIMESTAMP,
  }

  return Promise.all([
    ctx.db.ref(`orders/${order.id}`).set(order),
    ctx.db.ref(`users/${order.uid}/orders/${order.id}`).set(order.id),
  ]).then(() => order)
}
