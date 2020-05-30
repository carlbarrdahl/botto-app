/** @jsx jsx */
import { jsx } from "theme-ui"
import React from "react"
import { loadStripe } from "@stripe/stripe-js"
import { useFetch } from "../hooks/useFetch"

const GATSBY_STRIPE_PK = process.env.GATSBY_STRIPE_PK

function useCheckout({ orderId, stripeAccount }) {
  const { request } = useFetch()
  const payOrder = async () => {
    const session = await request("/api/payOrder", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    })
    const stripePromise = loadStripe(GATSBY_STRIPE_PK, {
      stripeAccount,
    })
    const stripe = await stripePromise
    stripe.redirectToCheckout({ sessionId: session.id }).then(result => {
      console.log(result)
    })
  }
  return { payOrder }
}

export default ({ orderId, stripeAccount }) => {
  const { payOrder } = useCheckout({ orderId, stripeAccount })

  return <button onClick={payOrder}>Pay order</button>
}
