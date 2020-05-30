module.exports = async ({ payload, sig }, ctx) => {
  let event
  try {
    event = ctx.stripe.webhooks.constructEvent(
      payload,
      sig,
      ctx.config.stripe.endpointSecret
    )
  } catch (err) {
    throw new Error(`Webhook Error: ${err.message}`)
  }

  console.log("Incoming Stripe webhook", event)
  /* 
  - Handle new account subscriptions
  - Send emails
  */
  return Promise.resolve()
}
