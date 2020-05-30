const connectStripe = require("./")
const { context, mockDb, values } = require("../../test/utils")

test("Connect Stripe", async () => {
  const params = { code: "code", token: "token", user: values.auth }
  const res = await connectStripe(params, context)
  expect(context.stripe.oauth.token).toHaveBeenCalledWith({
    code: params.code,
    grant_type: "authorization_code",
  })
  expect(context.db.ref).toHaveBeenCalledWith(
    `shops/${values.stripe.stripe_user_id}`
  )
  // expect(context.db.ref).toHaveBeenCalledWith(`users/${values.auth.uid}`)
  expect(mockDb.set).toHaveBeenCalledWith({
    email: values.auth.email,
    uid: values.auth.uid,
    stripeAccount: values.stripe.stripe_user_id,
  })
  expect(mockDb.set).toHaveBeenCalledWith(values.users)
  expect(res).toEqual([{}, {}])
})
