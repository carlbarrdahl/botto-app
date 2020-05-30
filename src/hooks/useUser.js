import * as rf from "reactfire"

export const useUser = () => {
  const user = rf.useUser()
  return rf.useDatabaseObjectData(rf.useDatabase().ref(`users/${user.uid}`))
}
