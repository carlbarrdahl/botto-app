import "./src/index.css"
import React from "react"
import { FirebaseAppProvider } from "reactfire"

const firebaseConfig = {
  projectId: "botto-app",
  appId: "1:878329873096:web:74b14b7f40dc4f6c28dbfd",
  databaseURL: "https://botto-app.firebaseio.com",
  storageBucket: "botto-app.appspot.com",
  apiKey: "AIzaSyDUTwtp3Gw84NCt0Nysi-A8iN_xFhEqMEk",
  authDomain: "botto-app.firebaseapp.com",
  messagingSenderId: "878329873096",
}

export const wrapRootElement = ({ element }) => {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {element}
    </FirebaseAppProvider>
  )
}
