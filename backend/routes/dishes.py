from flask import Blueprint, jsonify, request
from models import db, Dish, Category

dishes_bp = Blueprint('dishes', __name__)


@dishes_bp.route('/api/dishes', methods=['GET'])
def get_dishes():
    """Return all available dishes, optionally filtered by category_id."""
    category_id = request.args.get('category', type=int)
    query = Dish.query.filter_by(is_available=True)
    if category_id:
        query = query.filter_by(category_id=category_id)
    dishes = query.order_by(Dish.name).all()
    return jsonify([d.to_dict() for d in dishes])


@dishes_bp.route('/api/dishes/specials', methods=['GET'])
def get_specials():
    """Return all dishes marked as special and available."""
    specials = Dish.query.filter_by(is_special=True, is_available=True).order_by(Dish.name).all()
    return jsonify([d.to_dict() for d in specials])


@dishes_bp.route('/api/dishes/<int:dish_id>', methods=['GET'])
def get_dish(dish_id):
    """Return a single dish by ID."""
    dish = Dish.query.get(dish_id)
    if not dish:
        return jsonify({'error': 'Dish not found'}), 404
    return jsonify(dish.to_dict())


@dishes_bp.route('/api/categories', methods=['GET'])
def get_categories():
    """Return all menu categories ordered by display_order."""
    categories = Category.query.order_by(Category.display_order).all()
    return jsonify([c.to_dict() for c in categories])
