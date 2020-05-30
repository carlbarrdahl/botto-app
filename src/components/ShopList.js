import React from "react"
import { useDatabase, useDatabaseListData } from "reactfire"
import { Link } from "@reach/router"

const ShopList = ({}) => {
  const ref = useDatabase().ref(`shops`)
  const shops = useDatabaseListData(ref)

  return (
    <>
      <ul>
        {(shops || []).map(({ name, stripeAccount, skus }) => (
          <li key={stripeAccount}>
            <Link to={`/shop/${stripeAccount}`}>
              <h3>{name}</h3>
              <div># products {skus.length}</div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default ShopList
