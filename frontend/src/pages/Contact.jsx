import { useState } from 'react'
import api from '../api/api'

const HOURS = [
  { day: 'Monday', time: '11:00 AM – 11:00 PM' },
  { day: 'Tuesday', time: '11:00 AM – 11:00 PM' },
  { day: 'Wednesday', time: '11:00 AM – 11:00 PM' },
  { day: 'Thursday', time: '11:00 AM – 11:00 PM' },
  { day: 'Friday', time: '11:00 AM – 12:00 AM' },
  { day: 'Saturday', time: '10:00 AM – 12:00 AM' },
  { day: 'Sunday', time: '10:00 AM – 10:00 PM' },
]

const initialForm = { name: '', email: '', phone: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.message.trim()) e.message = 'Message is required'
    return e
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: undefined }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }
    setSubmitting(true)
    try {
      await api.post('/contact', form)
      setStatus('success')
      setForm(initialForm)
      setErrors({})
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="gold-line" />
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Get in Touch</h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0', textAlign: 'center' }}>
            Have a question, a reservation request, or just want to say hello? We'd love to hear from you.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}>

            {/* Info Panel */}
            <div>
              <div className="card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>Restaurant Info</h2>
                {[
                  { icon: '📍', label: 'Address', value: '42 Gourmet Lane, Food District, City – 110001' },
                  { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
                  { icon: '✉️', label: 'Email', value: 'hello@bellacucina.com' },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '0.1rem' }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-primary)', marginBottom: '0.2rem' }}>{label}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hours */}
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1.25rem' }}>Opening Hours</h2>
                {HOURS.map(({ day, time }) => (
                  <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.55rem 0', borderBottom: '1px solid var(--color-border)', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{day}</span>
                    <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div>
              <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1.5rem' }}>Send Us a Message</h2>

                {status === 'success' && (
                  <div className="alert alert-success">✓ Your message has been received! We'll get back to you soon.</div>
                )}
                {status === 'error' && (
                  <div className="alert alert-error">Something went wrong. Please try again or call us directly.</div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Full Name *</label>
                      <input id="name" name="name" type="text" className={`form-input${errors.name ? ' error' : ''}`} value={form.name} onChange={handleChange} placeholder="John Doe" autoComplete="name" />
                      {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" className={`form-input${errors.email ? ' error' : ''}`} value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" />
                      {errors.email && <p className="form-error">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="phone">Phone (optional)</label>
                    <input id="phone" name="phone" type="tel" className="form-input" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" autoComplete="tel" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="message">Message *</label>
                    <textarea id="message" name="message" className={`form-input${errors.message ? ' error' : ''}`} value={form.message} onChange={handleChange} placeholder="Tell us about your inquiry, reservation request, or feedback..." rows={5} />
                    {errors.message && <p className="form-error">{errors.message}</p>}
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.95rem' }} disabled={submitting}>
                    {submitting ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              </div>

              {/* Map */}
              <div style={{ marginTop: '1.5rem', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.2090!3d28.6139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzUwLjAiTiA3N8KwMTInMzIuNCJF!5e0!3m2!1sen!2sin!4v1"
                  width="100%"
                  height="220"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 800px) {
          div[style*="grid-template-columns: 1fr 1.2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  )
}
