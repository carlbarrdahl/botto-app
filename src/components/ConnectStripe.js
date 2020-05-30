import React, { useEffect } from "react"
import { useLocation, navigate } from "@reach/router"
import { useFetch } from "../hooks/useFetch"

const GATSBY_STRIPE_CLIENT_ID = process.env.GATSBY_STRIPE_CLIENT_ID

const connectStripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${GATSBY_STRIPE_CLIENT_ID}&scope=read_write`

export default () => {
  const { request } = useFetch()
  const location = useLocation()

  // Check if stripe code is present in url and call API
  useEffect(() => {
    if (location.search.includes("code")) {
      request(`/api/connectStripe${location.search}`, { method: "POST" })
        .then(() => navigate("/admin"))
        .catch(console.error)
    }
  }, [location])

  return <a href={connectStripeUrl}>Connect Stripe</a>
}
