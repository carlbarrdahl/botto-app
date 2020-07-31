const mockDb = {
  set: jest.fn().mockResolvedValue({}),
  update: jest.fn().mockResolvedValue({}),
}
const stripeAccount = "stripe_account_id"
const values = {
  auth: { uid: "user_id", email: "email@foo.bar" },
  users: {
    uid: "user_id",
    email: "email@foo.bar",
    stripeAccount,
  },
  stripe: { stripe_user_id: stripeAccount },
  session: { id: "session_id" },
  skus: [
    {
      active: true,
      id: "sku_id",
      price: 100,
      product: { active: true, name: "product_name" },
    },
  ],
  shops: { stripeAccount },
  orders: {
    stripeAccount,
    lineItems: [],
  },
}
const context = {
  config: {
    baseUrl: "baseUrl",
  },
  auth: {
    verifyIdToken: jest.fn().mockResolvedValue(values.auth),
  },
  db: {
    ref: jest.fn(path => {
      return {
        set: mockDb.set,
        update: mockDb.update,
        child: jest.fn().mockReturnValue(mockDb),
        once: jest.fn().mockResolvedValue({
          val: () => {
            const [type] = path.split("/")
            return values[type]
          },
        }),
        push: jest.fn().mockReturnValue({ key: "key" }),
      }
    }),
  },
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue(values.session),
      },
    },
    skus: {
      list: jest.fn().mockResolvedValue({ data: values.skus }),
      create: (_, cb) => {
        return cb("err", values.skus[0])
      },
    },
    oauth: {
      token: jest.fn().mockResolvedValue(values.stripe),
    },
    webhookEndpoints: {
      create: jest.fn().mockResolvedValue(),
    },
  },
}
module.exports = { context, values, mockDb }
