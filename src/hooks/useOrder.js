import { useDatabase, useDatabaseObjectData, useUser } from "reactfire"

export const useOrder = orderId => {
  const db = useDatabase()
  const user = useUser()
  const userOrderRef = db.ref(`users/${user.uid}/orders/${orderId}`)
  const userOrder = useDatabaseObjectData(userOrderRef)
  const orderRef = db.ref(`orders/${orderId}`)
  const order = useDatabaseObjectData(orderRef)

  return order
}
