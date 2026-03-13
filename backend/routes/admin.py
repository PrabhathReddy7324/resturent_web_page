from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, AdminUser, Dish, Category, ContactMessage
import bcrypt

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    """Authenticate admin and return JWT token."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'error': 'Invalid credentials'}), 401

    user = AdminUser.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    # Verify bcrypt password
    if not bcrypt.checkpw(password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({'token': token, 'username': user.username})


# ── Dish management (admin only) ─────────────────────────────────────────────

@admin_bp.route('/api/admin/dishes', methods=['GET'])
@jwt_required()
def admin_get_dishes():
    """Return ALL dishes (incl. unavailable) for admin dashboard."""
    dishes = Dish.query.order_by(Dish.created_at.desc()).all()
    return jsonify([d.to_dict() for d in dishes])


@admin_bp.route('/api/admin/dishes', methods=['POST'])
@jwt_required()
def admin_create_dish():
    """Create a new dish."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    errors = {}
    name = data.get('name', '').strip()
    description = data.get('description', '').strip()
    price = data.get('price')
    category_id = data.get('category_id')

    if not name:
        errors['name'] = 'Name is required'
    if not description:
        errors['description'] = 'Description is required'
    if price is None or float(price) <= 0:
        errors['price'] = 'Valid price is required'
    if not category_id:
        errors['category_id'] = 'Category is required'
    if errors:
        return jsonify({'errors': errors}), 422

    dish = Dish(
        name=name,
        description=description,
        price=float(price),
        category_id=int(category_id),
        image_url=data.get('image_url', ''),
        is_available=data.get('is_available', True),
        is_special=data.get('is_special', False)
    )
    db.session.add(dish)
    db.session.commit()
    return jsonify(dish.to_dict()), 201


@admin_bp.route('/api/admin/dishes/<int:dish_id>', methods=['PUT'])
@jwt_required()
def admin_update_dish(dish_id):
    """Update any field of an existing dish."""
    dish = Dish.query.get(dish_id)
    if not dish:
        return jsonify({'error': 'Dish not found'}), 404

    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    if 'name' in data:
        dish.name = data['name'].strip()
    if 'description' in data:
        dish.description = data['description'].strip()
    if 'price' in data:
        dish.price = float(data['price'])
    if 'category_id' in data:
        dish.category_id = int(data['category_id'])
    if 'image_url' in data:
        dish.image_url = data['image_url']
    if 'is_available' in data:
        dish.is_available = bool(data['is_available'])
    if 'is_special' in data:
        dish.is_special = bool(data['is_special'])

    db.session.commit()
    return jsonify(dish.to_dict())


@admin_bp.route('/api/admin/dishes/<int:dish_id>', methods=['DELETE'])
@jwt_required()
def admin_delete_dish(dish_id):
    """Permanently delete a dish."""
    dish = Dish.query.get(dish_id)
    if not dish:
        return jsonify({'error': 'Dish not found'}), 404

    db.session.delete(dish)
    db.session.commit()
    return jsonify({'success': True})


# ── Category management ───────────────────────────────────────────────────────

@admin_bp.route('/api/admin/categories', methods=['POST'])
@jwt_required()
def admin_create_category():
    """Create a new menu category."""
    data = request.get_json()
    name = data.get('name', '').strip()
    if not name:
        return jsonify({'error': 'Name is required'}), 422
    cat = Category(name=name, display_order=data.get('display_order', 99))
    db.session.add(cat)
    db.session.commit()
    return jsonify(cat.to_dict()), 201


# ── Contact messages ──────────────────────────────────────────────────────────

@admin_bp.route('/api/admin/messages', methods=['GET'])
@jwt_required()
def admin_get_messages():
    """Return all contact form submissions."""
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify([m.to_dict() for m in messages])
