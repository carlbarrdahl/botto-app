import {
  useDatabase,
  useDatabaseListData,
  useDatabaseObjectData,
  useUser,
} from "reactfire"

export const useOrderList = orderId => {
  const db = useDatabase()
  const user = useUser()
  return useDatabaseListData(db.ref(`users/${user.uid}/orders/`))
  //   console.log(userOrdersRef)
  //   const orders = useDatabaseListData(
  //     db.ref(`users/${user.uid}/orders/`)
  //   ).map(id => useDatabaseObjectData(db.ref(`orders/${orderId}`)))
  //   //   const userOrder = useDatabaseObjectData(userOrderRef)
  //   //   const order = useDatabaseObjectData(orderRef)

  //   return orders
}
