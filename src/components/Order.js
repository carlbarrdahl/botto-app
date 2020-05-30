/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { Link } from "@reach/router"

import PayOrder from "./PayOrder"
import { useShop } from "../hooks/useShop"
import { useOrder } from "../hooks/useOrder"
import { useEffect } from "react"
import { useFetch } from "../hooks/useFetch"

const Order = ({ orderId }) => {
  const order = useOrder(orderId)
  const shop = useShop(order.stripeAccount)
  const { request } = useFetch()
  useEffect(() => {
    order.status === "CREATED" &&
      order.sessionId &&
      request(`/api/pollPayment`, {
        method: "POST",
        body: JSON.stringify({
          sessionId: order.sessionId,
          stripeAccount: order.stripeAccount,
        }),
      }).then(console.log)
  }, [order.sessionId])
  return (
    <>
      <Link to={`/orders`}>← Back to orders</Link>
      <h3>Order from {shop.name}</h3>
      <pre>{JSON.stringify(order, null, 2)}</pre>
      {order.status !== "PAID" ? (
        <PayOrder orderId={orderId} stripeAccount={order.stripeAccount} />
      ) : (
        <div>queue position</div>
      )}
    </>
  )
}

export default Order
