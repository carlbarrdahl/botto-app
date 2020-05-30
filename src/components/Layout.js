/** @jsx jsx */
import { jsx } from "theme-ui"
import { Link } from "@reach/router"

const navItems = [
  { title: "home", href: "/" },
  //   { title: "account", href: "/account" },
  { title: "orders", href: "/orders" },
]
const Layout = props => {
  return (
    <main>
      <header>
        <nav sx={{ display: "flex", justifyContent: "space-around" }}>
          {navItems.map(link => (
            <Link key={link.href} to={`${link.href}`}>
              {link.title}
            </Link>
          ))}
        </nav>
      </header>
      {props.children}
    </main>
  )
}

export default Layout
