import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/api'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.username || !form.password) {
      setError('Please enter your username and password.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/admin/login', form)
      login(res.data.token)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at 50% 30%, rgba(232,184,75,0.06) 0%, transparent 60%), var(--color-bg)',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>BellaCucina</div>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Admin Portal</p>
        </div>

        <div className="card" style={{ padding: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Sign In</h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Enter your credentials to access the admin dashboard.
          </p>

          {error && <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className="form-input"
                value={form.username}
                onChange={handleChange}
                placeholder="kpr@123"
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                className="form-input"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-faint)', marginTop: '1.5rem' }}>
          Default: kpr@123 / kpr#7324
        </p>
      </div>
    </main>
  )
}
