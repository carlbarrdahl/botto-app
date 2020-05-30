/** @jsx jsx */
import { jsx } from "theme-ui"
import React, { useState } from "react"

import PlaceOrder from "./PlaceOrder"
import { useShop } from "../hooks/useShop"

function useCart() {
  const [quantity, setQuantity] = useState({})

  const inc = pid =>
    setQuantity({ ...quantity, [pid]: (quantity[pid] || 0) + 1 })
  const dec = pid =>
    setQuantity({ ...quantity, [pid]: (quantity[pid] || 0) - 1 })

  return { inc, dec, quantity }
}

const ProductList = ({ skus = [], quantity, onInc, onDec }) => {
  return (
    <ul sx={{ listStyle: "none", m: 0, p: 0 }}>
      {skus.map(({ id, product, currency, price, image }) => {
        return (
          <li key={id} sx={{ display: "flex" }}>
            <div
              sx={{
                backgroundImage: `url(${
                  image || "https://placehold.it/90x90"
                })`,
                width: 90,
                height: 90,
                backgroundSize: "cover",
              }}
            />
            <div
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <div sx={{ px: 2 }}>
                <h3 sx={{ m: 0, fontSize: 1 }}>{product.name}</h3>

                <div sx={{ fontSize: 0 }}>{product.description}</div>
              </div>
              <div>
                {formatPrice(price, currency)}
                <div sx={{ display: "flex", alignItems: "center" }}>
                  <button disabled={!quantity[id]} onClick={() => onDec(id)}>
                    -
                  </button>
                  <div sx={{ px: 2 }}>{quantity[id] || 0}</div>
                  <button
                    disabled={quantity[id] >= 9}
                    onClick={() => onInc(id)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

const Shop = ({ stripeAccount }) => {
  const shop = useShop(stripeAccount)

  const { inc, dec, quantity } = useCart()
  const sum = sumCart(shop.skus, quantity)
  console.log(shop, quantity, sum)

  return (
    <>
      <h3>{shop.name}</h3>
      <ProductList
        skus={shop.skus}
        quantity={quantity}
        onInc={inc}
        onDec={dec}
      />
      <div>
        Total: {formatPrice(sum, "sek")}
        <PlaceOrder
          disabled={!sum}
          lineItems={mapLineItems(quantity)}
          stripeAccount={shop.stripeAccount}
        />
      </div>
    </>
  )
}

function mapLineItems(cart) {
  return Object.keys(cart)
    .filter(sku => cart[sku]) // Remove items with quantity 0
    .map(sku => ({
      price: sku,
      quantity: cart[sku],
    }))
}

function sumCart(skus = [], quantity) {
  return skus.reduce((sum, sku) => sum + sku.price * (quantity[sku.id] || 0), 0)
}
function formatPrice(val, currency) {
  return (val / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency,
  })
}

export default Shop
