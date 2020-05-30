import { useUser } from "reactfire"

const BASE_URL = process.env.GATSBY_BASE_URL

export function useFetch() {
  const { accessToken } = useUser().toJSON().stsTokenManager
  const request = (path, opts) =>
    fetch(BASE_URL + path, {
      ...opts,
      headers: {
        authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }).then(async res => {
      const json = await res.json()
      if (!res.ok) {
        throw json
      }
      return json
    })

  return { request }
}
