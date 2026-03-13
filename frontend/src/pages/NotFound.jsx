import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 700, color: 'rgba(232,184,75,0.15)', lineHeight: 1 }}>404</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--color-text)', marginTop: '-1rem', marginBottom: '1rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: 360, margin: '0 auto 2rem' }}>
          Looks like this page doesn't exist. Perhaps start from our menu?
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/menu" className="btn btn-ghost">View Menu</Link>
        </div>
      </div>
    </main>
  )
}
