import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DishCard from '../components/DishCard'
import api from '../api/api'

const HOURS = [
  { day: 'Monday – Friday', time: '11:00 AM – 11:00 PM' },
  { day: 'Saturday', time: '10:00 AM – 12:00 AM' },
  { day: 'Sunday', time: '10:00 AM – 10:00 PM' },
]

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dishes/specials')
      .then(r => setFeatured(r.data.slice(0, 6)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 60% 40%, rgba(212,113,61,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(232,184,75,0.08) 0%, transparent 55%), var(--color-bg)',
        }}
      >
        {/* Background decorative text */}
        <div style={{
          position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)',
          fontFamily: 'var(--font-display)', fontSize: 'clamp(6rem, 16vw, 18rem)',
          fontWeight: 700, color: 'rgba(232,184,75,0.04)', lineHeight: 1,
          pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
        }}>
          CUCINA
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640, paddingTop: 'var(--navbar-h)' }}>
            <span className="tag-label" style={{ display: 'block', marginBottom: '1.25rem' }}>
              ✦ Est. 2018 · Award Winning Restaurant
            </span>
            <h1 className="display-title" style={{ marginBottom: '1.5rem' }}>
              Where Every Dish<br />
              <span style={{ color: 'var(--color-primary)' }}>Tells a Story</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.75, maxWidth: 480, marginBottom: '2.5rem' }}>
              Authentic flavours, carefully sourced ingredients, and a passion for cooking that shines through every single plate we serve.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/menu" className="btn btn-primary" style={{ fontSize: '1rem' }}>
                Explore Menu
              </Link>
              <Link to="/specials" className="btn btn-outline" style={{ fontSize: '1rem' }}>
                Today's Specials
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
          animation: 'bounce 2s infinite',
        }}>
          <span style={{ fontSize: '0.72rem', letterSpacing: '0.15em', color: 'var(--color-text-faint)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--color-primary), transparent)' }} />
        </div>
        <style>{`@keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-8px); } }`}</style>
      </section>

      {/* ── Stats Bar ── */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '2rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
            {[
              { num: '200+', label: 'Dishes on Menu' },
              { num: '50K+', label: 'Happy Guests' },
              { num: '12', label: 'Expert Chefs' },
              { num: '4.9★', label: 'Average Rating' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>{num}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Specials ── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="gold-line" />
              <h2 className="section-title">Chef's Specials</h2>
              <p className="section-subtitle">Handpicked highlights from our kitchen, featuring seasonal ingredients and chef-curated creations.</p>
            </div>
            <Link to="/specials" className="btn btn-outline btn-sm">See All Specials →</Link>
          </div>
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : featured.length === 0 ? (
            <div className="empty-state"><div className="empty-state__icon">🍽️</div><p>No specials today. Check the full menu!</p></div>
          ) : (
            <div className="dish-grid">
              {featured.map(d => <DishCard key={d.id} dish={d} />)}
            </div>
          )}
        </div>
      </section>

      {/* ── Hours & Location ── */}
      <section className="section" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' }}>
            <div>
              <div className="gold-line" />
              <h2 className="section-title">Opening Hours</h2>
              <div style={{ marginTop: '1.5rem' }}>
                {HOURS.map(({ day, time }) => (
                  <div key={day} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.9rem 0', borderBottom: '1px solid var(--color-border)',
                    fontSize: '0.92rem',
                  }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{day}</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="gold-line" />
              <h2 className="section-title">Find Us</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.7, marginTop: '0.5rem' }}>
                📍 42 Gourmet Lane, Food District<br />
                City – 110001<br /><br />
                📞 +91 98765 43210<br />
                ✉️ hello@bellacucina.com
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/contact" className="btn btn-primary btn-sm">Get Directions</Link>
                <Link to="/menu" className="btn btn-ghost btn-sm">View Full Menu</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
