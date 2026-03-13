import { useEffect, useState } from 'react'
import DishCard from '../components/DishCard'
import api from '../api/api'

export default function Menu() {
  const [dishes, setDishes] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/dishes'), api.get('/categories')])
      .then(([dishRes, catRes]) => {
        setDishes(dishRes.data)
        setCategories(catRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeCategory
    ? dishes.filter(d => d.category_id === activeCategory)
    : dishes

  return (
    <main>
      <div className="page-hero">
        <div className="container">
          <div className="gold-line" />
          <h1 className="section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Our Menu</h1>
          <p className="section-subtitle" style={{ margin: '0.75rem auto 0', textAlign: 'center' }}>
            Explore our full selection of freshly prepared dishes, crafted from the finest ingredients.
          </p>
        </div>
      </div>

      <section className="section" style={{ paddingTop: '2rem' }}>
        <div className="container">
          {/* Category Tabs */}
          <div className="category-tabs">
            <button
              className={`category-tab${activeCategory === null ? ' active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-tab${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">🍽️</div>
              <h3 className="empty-state__title">No dishes in this category</h3>
              <p>Try selecting a different category or check back soon.</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--color-text-faint)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                Showing {filtered.length} dish{filtered.length !== 1 ? 'es' : ''}
              </p>
              <div className="dish-grid">
                {filtered.map(d => <DishCard key={d.id} dish={d} />)}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}
