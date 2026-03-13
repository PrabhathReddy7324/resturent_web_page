import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/api'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'

export default function DishDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dish, setDish] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    api.get(`/dishes/${id}`)
      .then(r => setDish(r.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="spinner-wrap" style={{ minHeight: '100vh' }}><div className="spinner" /></div>

  if (notFound || !dish) return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'var(--navbar-h)' }}>
      <div className="empty-state">
        <div className="empty-state__icon">🍽️</div>
        <h1 className="empty-state__title">Dish Not Found</h1>
        <p>This dish doesn't exist or may have been removed.</p>
        <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/menu')}>Back to Menu</button>
      </div>
    </main>
  )

  return (
    <main style={{ paddingTop: 'var(--navbar-h)', minHeight: '100vh' }}>
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: '2rem' }}
        >
          ← Back
        </button>

        {!dish.is_available && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            ⚠️ This dish is currently unavailable. Please check back soon.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'start' }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
            <img
              src={dish.image_url || PLACEHOLDER}
              alt={dish.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => { e.target.src = PLACEHOLDER }}
            />
            {dish.is_special && (
              <div style={{
                position: 'absolute', top: '1rem', left: '1rem',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                color: '#1a1814', padding: '0.4rem 0.9rem',
                borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700,
              }}>
                ⭐ Chef's Special
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <span className="tag-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
              {dish.category_name}
            </span>
            <h1 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', marginBottom: '1rem' }}>
              {dish.name}
            </h1>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 700, marginBottom: '1.5rem' }}>
              ${dish.price.toFixed(2)}
            </div>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.8, fontSize: '0.97rem', marginBottom: '2rem' }}>
              {dish.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              <span className={`badge ${dish.is_available ? 'badge-green' : 'badge-red'}`}>
                {dish.is_available ? '✓ Available' : '✕ Unavailable'}
              </span>
              {dish.is_special && <span className="badge badge-gold">⭐ Special</span>}
              <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                {dish.category_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1.1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
