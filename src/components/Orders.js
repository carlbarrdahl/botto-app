/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { Link } from "@reach/router"

import PayOrder from "./PayOrder"
import { useOrderList } from "../hooks/useOrderList"
import { useOrder } from "../hooks/useOrder"
import { useShop } from "../hooks/useShop"

function formatTime(date) {
  return new Date(date).toISOString()
}

const OrderItem = ({ id }) => {
  const order = useOrder(id)
  const shop = useShop(order.stripeAccount)
  return (
    <li>
      <Link to={`/order/${order.id}`} sx={{ display: "flex", flex: 1 }}>
        <div sx={{ mr: 2 }}>{shop.name}</div>
        {/* <div>{order.id}</div> */}
        <div>{order.status}</div>
        <div sx={{ ml: "auto" }}>{formatTime(order.created_at)}</div>
      </Link>
    </li>
  )
}

const OrderList = ({}) => {
  const orders = useOrderList()
  //   const order = useOrder(orderId)

  return (
    <ul sx={{ m: 0, p: 0, listStyle: "none" }}>
      {orders.map(id => (
        <OrderItem key={id} id={id} />
      ))}
    </ul>
  )
}

export default OrderList
