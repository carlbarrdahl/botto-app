const { createSku, listSkus } = require(".")
const { context } = require("../../test/utils")

describe("sku", () => {
  test("create sku", async () => {
    const [sku] = await createSku(
      "product-id",
      { meta: "attr" },
      15,
      "sek",
      "in_stock",
      context
    )

    expect(sku.id).toEqual("sku_id")
  })

  test("list skus", async () => {
    const [skus] = await listSkus(context)

    expect(skus[0].id).toEqual("sku_id")
  })
})
