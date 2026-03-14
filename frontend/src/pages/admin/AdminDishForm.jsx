import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../api/api'

const EMPTY = { name: '', description: '', price: '', category_id: '', image_url: '', is_available: true, is_special: false }

/**
 * Convert Google Drive sharing URLs to direct image URLs.
 * Supports formats like:
 *   https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 *   https://drive.google.com/open?id=FILE_ID
 *   https://drive.google.com/uc?id=FILE_ID
 */
function toDirectImageUrl(url) {
  if (!url) return url
  const trimmed = url.trim()

  // Match: /file/d/FILE_ID/
  const fileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`

  // Match: ?id=FILE_ID or &id=FILE_ID
  const idMatch = trimmed.match(/drive\.google\.com\/.*[?&]id=([a-zA-Z0-9_-]+)/)
  if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`

  return trimmed
}

export default function AdminDishForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data))
      .catch(console.error)

    if (isEdit) {
      api.get(`/dishes/${id}`)
        .then(r => {
          const d = r.data
          setForm({
            name: d.name,
            description: d.description,
            price: String(d.price),
            category_id: String(d.category_id),
            image_url: d.image_url || '',
            is_available: d.is_available,
            is_special: d.is_special,
          })
        })
        .catch(() => navigate('/admin/dashboard'))
    }
  }, [id, isEdit, navigate])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0) e.price = 'Enter a valid price'
    if (!form.category_id) e.category_id = 'Select a category'
    return e
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    let val = type === 'checkbox' ? checked : value
    // Auto-convert Google Drive links to direct image URLs
    if (name === 'image_url' && typeof val === 'string') {
      val = toDirectImageUrl(val)
    }
    setForm(f => ({ ...f, [name]: val }))
    if (errors[name]) setErrors(err => ({ ...err, [name]: undefined }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const v = validate()
    if (Object.keys(v).length > 0) { setErrors(v); return }
    setSubmitting(true)

    const payload = {
      ...form,
      price: parseFloat(form.price),
      category_id: parseInt(form.category_id),
    }

    try {
      if (isEdit) {
        await api.put(`/admin/dishes/${id}`, payload)
      } else {
        await api.post('/admin/dishes', payload)
      }
      navigate('/admin/dashboard')
    } catch (err) {
      setFeedback('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">🍽️ BellaCucina</div>
        <button className="admin-nav-link active" onClick={() => navigate('/admin/dashboard')}>📋 Dishes</button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <h1 className="admin-title">{isEdit ? 'Edit Dish' : 'Add New Dish'}</h1>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/dashboard')}>← Back to Dashboard</button>
        </div>

        {feedback && <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>{feedback}</div>}

        <div className="card" style={{ maxWidth: 680, padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="name">Dish Name *</label>
                <input id="name" name="name" type="text" className={`form-input${errors.name ? ' error' : ''}`} value={form.name} onChange={handleChange} placeholder="e.g. Grilled Salmon Fillet" />
                {errors.name && <p className="form-error">{errors.name}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="price">Price (USD) *</label>
                <input id="price" name="price" type="number" step="0.01" min="0" className={`form-input${errors.price ? ' error' : ''}`} value={form.price} onChange={handleChange} placeholder="12.99" />
                {errors.price && <p className="form-error">{errors.price}</p>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="category_id">Category *</label>
                <select id="category_id" name="category_id" className={`form-input${errors.category_id ? ' error' : ''}`} value={form.category_id} onChange={handleChange}>
                  <option value="">Select a category…</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.category_id && <p className="form-error">{errors.category_id}</p>}
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="description">Description *</label>
                <textarea id="description" name="description" className={`form-input${errors.description ? ' error' : ''}`} value={form.description} onChange={handleChange} placeholder="Describe this dish — ingredients, preparation style, serving suggestions…" rows={4} />
                {errors.description && <p className="form-error">{errors.description}</p>}
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="image_url">Image URL (optional)</label>
                <input id="image_url" name="image_url" type="url" className="form-input" value={form.image_url} onChange={handleChange} placeholder="https://example.com/dish-photo.jpg" />
                {form.image_url && (
                  <img
                    src={form.image_url}
                    alt="Preview"
                    style={{ marginTop: '0.75rem', height: 120, borderRadius: 'var(--radius-md)', objectFit: 'cover', width: '100%' }}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                )}
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="toggle">
                  <input type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} />
                  <span className="toggle__slider" />
                </label>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Available on menu</span>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="toggle">
                  <input type="checkbox" name="is_special" checked={form.is_special} onChange={handleChange} />
                  <span className="toggle__slider" />
                </label>
                <span style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>Feature as Special</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/dashboard')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Dish'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
