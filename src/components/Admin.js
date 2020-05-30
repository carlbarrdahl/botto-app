import React from "react"

import ConnectStripe from "../components/ConnectStripe"
import SyncProducts from "../components/SyncProducts"
import Shop from "../components/AdminShop"

export default () => {
  console.log("ADMIN")
  return (
    <>
      <ConnectStripe />
      <SyncProducts />
      <Shop />
    </>
  )
}
