import React from "react"
import { useUser } from "reactfire"
import { SignInForm } from "./Auth"

const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const user = useUser()
  if (!user && location.pathname !== `/signin`) {
    return (
      <div>
        <pre>not authorized</pre>
        <SignInForm />
      </div>
    )
  }

  return <Component {...rest} />
}

export default PrivateRoute
