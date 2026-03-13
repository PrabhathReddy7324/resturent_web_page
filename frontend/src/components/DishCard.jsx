import { useNavigate } from 'react-router-dom'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600'

export default function DishCard({ dish }) {
  const navigate = useNavigate()
  const img = dish.image_url || PLACEHOLDER

  return (
    <article
      className="card dish-card"
      onClick={() => navigate(`/dish/${dish.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${dish.name}`}
      onKeyDown={e => e.key === 'Enter' && navigate(`/dish/${dish.id}`)}
    >
      <div className="dish-card__img-wrap">
        <img
          src={img}
          alt={dish.name}
          className="dish-card__img"
          loading="lazy"
          onError={e => { e.target.src = PLACEHOLDER }}
        />
        {dish.is_special && <span className="dish-card__special-badge">⭐ Special</span>}
      </div>
      <div className="dish-card__body">
        <h3 className="dish-card__name">{dish.name}</h3>
        <p className="dish-card__desc">{dish.description}</p>
        <div className="dish-card__footer">
          <span className="dish-card__price">${dish.price.toFixed(2)}</span>
          <span className="dish-card__more">View details →</span>
        </div>
      </div>
    </article>
  )
}
