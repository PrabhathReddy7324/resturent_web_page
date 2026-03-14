import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/api'

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal__title">Confirm Delete</h2>
        <p className="modal__body">{message}</p>
        <div className="modal__actions">
          <button className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [dishes, setDishes] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dishes')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const showFeedback = (msg, type = 'success') => {
    setFeedback({ msg, type })
    setTimeout(() => setFeedback(null), 3000)
  }

  useEffect(() => {
    fetchDishes()
  }, [])

  const fetchDishes = () => {
    setLoading(true)
    api.get('/admin/dishes')
      .then(r => setDishes(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const fetchMessages = () => {
    api.get('/admin/messages')
      .then(r => setMessages(r.data))
      .catch(console.error)
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'messages') fetchMessages()
  }

  const toggleField = async (dish, field) => {
    try {
      const res = await api.put(`/admin/dishes/${dish.id}`, { [field]: !dish[field] })
      setDishes(d => d.map(x => x.id === dish.id ? res.data : x))
    } catch {
      showFeedback('Update failed', 'error')
    }
  }

  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/dishes/${deleteTarget.id}`)
      setDishes(d => d.filter(x => x.id !== deleteTarget.id))
      showFeedback(`"${deleteTarget.name}" deleted.`)
    } catch (err) {
      console.error('Delete failed:', err.response?.status, err.response?.data || err.message)
      showFeedback('Delete failed', 'error')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__logo">🍽️ BellaCucina</div>
        <button className={`admin-nav-link${activeTab === 'dishes' ? ' active' : ''}`} onClick={() => handleTabChange('dishes')}>📋 Dishes</button>
        <button className={`admin-nav-link${activeTab === 'messages' ? ' active' : ''}`} onClick={() => handleTabChange('messages')}>✉️ Messages</button>
        <div style={{ flex: 1 }} />
        <button className="admin-nav-link" onClick={() => { logout(); navigate('/admin/login') }}>🚪 Logout</button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {feedback && (
          <div className={`alert ${feedback.type === 'error' ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1.5rem', position: 'sticky', top: 0, zIndex: 10 }}>
            {feedback.msg}
          </div>
        )}

        {activeTab === 'dishes' && (
          <>
            <div className="admin-header">
              <h1 className="admin-title">Manage Dishes</h1>
              <Link to="/admin/dishes/new" className="btn btn-primary btn-sm">+ Add Dish</Link>
            </div>

            {loading ? (
              <div className="spinner-wrap"><div className="spinner" /></div>
            ) : (
              <div className="admin-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Available</th>
                      <th>Special</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dishes.length === 0 && (
                      <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>No dishes yet. Add your first dish!</td></tr>
                    )}
                    {dishes.map(dish => (
                      <tr key={dish.id}>
                        <td>
                          {dish.image_url
                            ? <img src={dish.image_url} alt={dish.name} className="admin-img-thumb" onError={e => { e.target.style.display = 'none' }} />
                            : <div className="admin-img-thumb" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🍽️</div>
                          }
                        </td>
                        <td style={{ fontWeight: 500, maxWidth: 200 }}>{dish.name}</td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{dish.category_name}</td>
                        <td style={{ color: 'var(--color-primary)', fontWeight: 600 }}>${dish.price.toFixed(2)}</td>
                        <td>
                          <label className="toggle" title={dish.is_available ? 'Hide from menu' : 'Show on menu'}>
                            <input type="checkbox" checked={dish.is_available} onChange={() => toggleField(dish, 'is_available')} />
                            <span className="toggle__slider" />
                          </label>
                        </td>
                        <td>
                          <label className="toggle" title={dish.is_special ? 'Remove from specials' : 'Mark as special'}>
                            <input type="checkbox" checked={dish.is_special} onChange={() => toggleField(dish, 'is_special')} />
                            <span className="toggle__slider" />
                          </label>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to={`/admin/dishes/${dish.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                            <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(dish)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'messages' && (
          <>
            <div className="admin-header">
              <h1 className="admin-title">Contact Messages</h1>
              <button className="btn btn-ghost btn-sm" onClick={fetchMessages}>Refresh</button>
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '2.5rem' }}>No messages yet.</td></tr>
                  )}
                  {messages.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 500 }}>{m.name}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{m.email}</td>
                      <td style={{ color: 'var(--color-text-muted)' }}>{m.phone || '—'}</td>
                      <td style={{ maxWidth: 300, color: 'var(--color-text-muted)', fontSize: '0.82rem' }}>{m.message}</td>
                      <td style={{ color: 'var(--color-text-faint)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {deleteTarget && (
        <ConfirmModal
          message={`Are you sure you want to permanently delete "${deleteTarget.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  )
}
