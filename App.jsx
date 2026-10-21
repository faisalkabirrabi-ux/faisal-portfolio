import Portfolio from './Portfolio'
import Admin from './Admin'

// Tiny router: /admin shows the admin panel, everything else shows the portfolio.
export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '')
  return path === '/admin' ? <Admin /> : <Portfolio />
}
