import React from "react"
import { navigate } from "@reach/router"
import { useFetch } from "../hooks/useFetch"

export default ({ lineItems, stripeAccount, ...props }) => {
  const { request } = useFetch()
  function placeOrder() {
    request(`/api/placeOrder`, {
      method: "POST",
      body: JSON.stringify({ lineItems, stripeAccount }),
    })
      .then(order => navigate(`/order/${order.id}`))
      .catch(console.error)
  }

  return (
    <button {...props} onClick={placeOrder}>
      Place order
    </button>
  )
}
