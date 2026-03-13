import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand-name">BellaCucina</div>
            <p className="footer__tagline">
              A celebration of flavour, crafted with passion and the finest ingredients.
              Dine with us and experience something unforgettable.
            </p>
          </div>
          <div>
            <div className="footer__heading">Navigate</div>
            <ul className="footer__links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/specials">Specials</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer__heading">Visit Us</div>
            <div className="footer__contact-item">📍 42 Gourmet Lane, Food District, City 110001</div>
            <div className="footer__contact-item">📞 +91 98765 43210</div>
            <div className="footer__contact-item">✉️ hello@bellacucina.com</div>
            <div className="footer__contact-item" style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--color-text-faint)' }}>
              Mon – Fri: 11am – 11pm<br />
              Sat – Sun: 10am – 12am
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p className="footer__copyright">© {year} BellaCucina. All rights reserved.</p>
          <p className="footer__copyright">Made with ❤️ for food lovers</p>
        </div>
      </div>
    </footer>
  )
}
