import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'

export default function Specials() {
  const [specials, setSpecials] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/dishes/specials')
      .then(r => setSpecials(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="gold-line" />
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Chef's Specials</h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0', textAlign: 'center' }}>
            Our signature and seasonal featured dishes, curated for an extraordinary dining experience.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : specials.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">⭐</div>
              <h2 className="empty-state__title">No Specials Right Now</h2>
              <p>Our chefs are working on something amazing. Check back soon!</p>
              <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/menu')}>Browse Full Menu</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {specials.map((dish, i) => (
                <article
                  key={dish.id}
                  className="card"
                  onClick={() => navigate(`/dish/${dish.id}`)}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: i % 2 === 0 ? '1fr 1.3fr' : '1.3fr 1fr',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    minHeight: 280,
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && navigate(`/dish/${dish.id}`)}
                >
                  {i % 2 === 0 ? (
                    <>
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={dish.image_url || PLACEHOLDER}
                          alt={dish.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          onError={e => { e.target.src = PLACEHOLDER }}
                          onMouseEnter={e => { e.target.style.transform = 'scale(1.05)' }}
                          onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
                        />
                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: '#1a1814', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>⭐ Special</div>
                      </div>
                      <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span className="tag-label" style={{ display: 'block', marginBottom: '0.75rem' }}>{dish.category_name}</span>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', marginBottom: '1rem', color: 'var(--color-text)' }}>{dish.name}</h2>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, fontSize: '0.93rem', marginBottom: '1.5rem' }}>{dish.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>${dish.price.toFixed(2)}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>View Details →</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span className="tag-label" style={{ display: 'block', marginBottom: '0.75rem' }}>{dish.category_name}</span>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', marginBottom: '1rem', color: 'var(--color-text)' }}>{dish.name}</h2>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.75, fontSize: '0.93rem', marginBottom: '1.5rem' }}>{dish.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-primary)' }}>${dish.price.toFixed(2)}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600 }}>View Details →</span>
                        </div>
                      </div>
                      <div style={{ position: 'relative', overflow: 'hidden' }}>
                        <img
                          src={dish.image_url || PLACEHOLDER}
                          alt={dish.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                          onError={e => { e.target.src = PLACEHOLDER }}
                          onMouseEnter={e => { e.target.style.transform = 'scale(1.05)' }}
                          onMouseLeave={e => { e.target.style.transform = 'scale(1)' }}
                        />
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', color: '#1a1814', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 700 }}>⭐ Special</div>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 700px) {
          article[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          article[style*="grid-template-columns"] > div:first-child {
            min-height: 200px;
          }
        }
      `}</style>
    </main>
  )
}
