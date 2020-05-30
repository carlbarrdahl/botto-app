import React from "react"
import { useFetch } from "../hooks/useFetch"

export default () => {
  const { request } = useFetch()
  function syncProducts() {
    request(`/api/syncProducts`, { method: "POST" })
      .then(console.log)
      .catch(console.error)
  }

  return <button onClick={syncProducts}>Sync products</button>
}
