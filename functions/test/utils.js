const product = require("../src/products/product")

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
  products: [
    {
      id: "id-1",
      name: "a-test-product-1",
      description: "lorem ipsum description",
      active: true,
      metadata: {},
      caption: "",
      images: [],
      statement_descriptor: "",
      type: "good",
    },
    {
      id: "id-2",
      name: "a-test-product-2",
      description: "lorem ipsum description",
      active: true,
      metadata: {},
      caption: "",
      images: [],
      statement_descriptor: "",
      type: "good",
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
      create: jest.fn().mockResolvedValue(values.skus[0], null),
      retrieve: jest.fn().mockResolvedValue(values.skus[0], null),
      del: jest.fn().mockResolvedValue(null),
      update: (id, sku, account) =>
        Promise.resolve({ ...values.skus[0], ...sku }),
    },
    products: {
      create: (product, account) => Promise.resolve(product, null),
      list: () => Promise.resolve({ data: values.products }, null),
      retrieve: (id, acc) =>
        Promise.resolve(values.products.find(p => p.id === id)),
      del: id => {
        values.products = values.products.filter(p => p.id != id)

        return Promise.resolve({ deleted: true }, null)
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
