const {
  createProduct,
  productFactory,
  getProducts,
  getProduct,
  deleteProduct,
} = require("./product")
const { context } = require("../../test/utils")

describe("product", () => {
  test("create", async () => {
    const newProduct = productFactory({
      name: "a-new-test-product",
      description: "lorem ipsum description",
    })
    const [createdProduct] = await createProduct(context, newProduct)

    expect(createdProduct).toEqual({
      name: "a-new-test-product",
      description: "lorem ipsum description",
      active: true,
      metadata: {},
      caption: "",
      images: [],
      statement_descriptor: "",
      type: "good",
    })
  })

  test("read many", async () => {
    const [products] = await getProducts(context, "stripe-account")

    expect(products.length).toEqual(2)
    expect(products[0].name).toEqual("a-test-product-1")
    expect(products[1].name).toEqual("a-test-product-2")
  })

  test("read one", async () => {
    const [product] = await getProduct(context, "stripe-account", "id-2")

    expect(product.name).toEqual("a-test-product-2")
  })

  test("delete", async () => {
    const [products] = await getProducts(context)

    expect(products.length).toEqual(2)

    const [deleted] = await deleteProduct(context, "stripe-account", "id-2")
    const [productsNext] = await getProducts(context)

    expect(productsNext.length).toBe(1)
    expect(productsNext[0].id).toBe("id-1")
    expect(deleted).toBeTruthy()
  })
})
