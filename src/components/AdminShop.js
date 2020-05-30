import React from "react"
import { useDatabase, useDatabaseObjectData } from "reactfire"

import { useUser } from "../hooks/useUser"
import { useState } from "react"

const AdminShop = props => {
  const user = useUser()
  const [state, setState] = useState({ name: "" })
  const ref = useDatabase().ref(`shops/${user.stripeAccount}`)
  const shop = useDatabaseObjectData(ref)

  function handleChange(e) {
    setState({ [e.target.name]: e.target.value })
    ref.child(e.target.name).set(e.target.value)
  }
  return (
    <>
      <div>
        <label>
          Name:
          <input name="name" value={shop.name} onChange={handleChange} />
        </label>
      </div>
      <div>{shop.email}</div>
      <div>{shop.stripe_user_id}</div>
      <div>{shop.id}</div>
      <ul>
        {(shop.skus || []).map(({ id, product, currency, price }) => (
          <li key={id}>
            <h3>{product.name}</h3>
            <div>{formatPrice(price, currency)}</div>
            <div>{product.description}</div>
          </li>
        ))}
      </ul>
    </>
  )
}

function formatPrice(val, currency) {
  return (val / 100).toLocaleString("sv-SE", {
    style: "currency",
    currency,
  })
}

export default AdminShop
