import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', exact: true },
  { to: '/menu', label: 'Menu' },
  { to: '/specials', label: 'Specials' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          Bella<span>Cucina</span>
        </Link>

        <ul className={`navbar__links${open ? ' open' : ''}`}>
          {links.map(({ to, label, exact }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) => `navbar__link${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/menu"
              className="navbar__link navbar__cta"
              onClick={() => setOpen(false)}
            >
              Order Now
            </NavLink>
          </li>
        </ul>

        <button
          className="navbar__hamburger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(o => !o)}
        >
          <span style={open ? { transform: 'rotate(45deg) translate(4px, 5px)' } : {}} />
          <span style={open ? { opacity: 0, transform: 'scaleX(0)' } : {}} />
          <span style={open ? { transform: 'rotate(-45deg) translate(4px, -5px)' } : {}} />
        </button>
      </div>
    </nav>
  )
}
