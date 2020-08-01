const {
  createSku,
  listSkus,
  getSku,
  deleteSku,
  updateSku,
  SKU_STATUS,
} = require(".")
const { context } = require("../../test/utils")

describe("sku", () => {
  test("create sku", async () => {
    const [sku, _] = await createSku(
      context,
      "a-connected-stripe-acc",
      "product-id",
      { meta: "attr" },
      15,
      "sek",
      "in_stock"
    )

    expect(sku.id).toEqual("sku_id")
  })

  test("list skus", async () => {
    const [skus, _] = await listSkus(context)

    expect(skus[0].id).toEqual("sku_id")
  })

  test("get sku", async () => {
    const [sku, _] = await getSku(context, "stripe-account-id", "sku_id")
    const target = {
      active: true,
      id: "sku_id",
      price: 100,
      product: { active: true, name: "product_name" },
    }

    expect(sku).toEqual(target)
  })

  test("update", async () => {
    const [sku, _] = await updateSku(
      context,
      "stripe-account-id",
      "sku_id",
      42,
      SKU_STATUS.OUT_OF_STOCK
    )

    expect(sku.price).toEqual(42)
    expect(sku.inventory.value).toEqual(SKU_STATUS.OUT_OF_STOCK)
  })

  test("delete", async () => {
    const err = await deleteSku(context, "stripe-account-id", "sku-to-remove")

    expect(err).toBeNull()
    expect(context.stripe.skus.del).toBeCalledWith("sku-to-remove", {
      stripeAccount: "stripe-account-id",
    })
  })
})
