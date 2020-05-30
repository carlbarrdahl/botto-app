import { useDatabase, useDatabaseObjectData } from "reactfire"

export const useShop = stripeAccount =>
  useDatabaseObjectData(useDatabase().ref(`shops/${stripeAccount}`))
