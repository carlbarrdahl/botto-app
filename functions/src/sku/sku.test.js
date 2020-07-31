const { createSku } = require(".")
const { context } = require("../../test/utils")

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
