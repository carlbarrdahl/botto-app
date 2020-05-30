import React, { useState, useEffect } from "react"
import { Router } from "@reach/router"
import { SuspenseWithPerf } from "reactfire"

import PrivateRoute from "../components/PrivateRoute"
import Admin from "../components/Admin"
import Layout from "../components/Layout"
import Shop from "../components/Shop"
import Order from "../components/Order"
import Orders from "../components/Orders"
import ShopList from "../components/ShopList"

const IndexPage = () => (
  <Layout>
    <ShopList />
  </Layout>
)
const ShopPage = ({ stripeAccount }) => (
  <Layout>
    <Shop stripeAccount={stripeAccount} />
  </Layout>
)

const OrdersPage = () => (
  <Layout>
    <Orders />
  </Layout>
)

const OrderPage = ({ orderId }) => (
  <Layout>
    <Order orderId={orderId} />
  </Layout>
)

export default () => {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(false)
  })
  return loading ? (
    <pre>loading...</pre>
  ) : (
    <SuspenseWithPerf
      traceId={"firebase-user-wait"}
      fallback={<p>loading...</p>}
    >
      <Router>
        <PrivateRoute component={IndexPage} path="/" />
        <PrivateRoute component={Admin} path="/admin" />
        <PrivateRoute component={ShopPage} path="/shop/:stripeAccount" />
        <PrivateRoute component={OrderPage} path="/order/:orderId" />
        <PrivateRoute component={OrdersPage} path="/orders" />
      </Router>
    </SuspenseWithPerf>
  )
}
