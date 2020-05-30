module.exports = ({ code, state, user }, ctx) => {
  // Send the authorization code to Stripe's API.
  return ctx.stripe.oauth
    .token({ grant_type: "authorization_code", code })
    .then(({ stripe_user_id }) => {
      // Update Shop
      return Promise.all([
        ctx.db.ref(`shops/${stripe_user_id}`).set({
          uid: user.uid,
          email: user.email,
          stripeAccount: stripe_user_id,
        }),
        ctx.db.ref(`users`).child(user.uid).update({
          uid: user.uid,
          email: user.email,
          stripeAccount: stripe_user_id,
        }),
      ])
    })
}
