"""
Seed the database with sample categories, dishes, and the default admin account.
Run once: python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

import bcrypt
from app import create_app
from models import db, Category, Dish, AdminUser

app = create_app()

CATEGORIES = [
    {'name': 'Starters', 'display_order': 1},
    {'name': 'Mains', 'display_order': 2},
    {'name': 'Desserts', 'display_order': 3},
    {'name': 'Drinks', 'display_order': 4},
]

DISHES = [
    # Starters
    {'name': 'Crispy Calamari', 'description': 'Golden-fried calamari rings served with marinara sauce and a squeeze of lemon. Light, crispy, and utterly irresistible.', 'price': 8.99, 'category': 'Starters', 'image_url': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600', 'is_special': True},
    {'name': 'Bruschetta al Pomodoro', 'description': 'Toasted rustic bread rubbed with garlic, topped with ripe tomatoes, fresh basil, and a drizzle of extra-virgin olive oil.', 'price': 6.99, 'category': 'Starters', 'image_url': 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600'},
    {'name': 'Spinach & Artichoke Dip', 'description': 'Warm, creamy dip with spinach and artichoke hearts, served with toasted ciabatta slices.', 'price': 9.49, 'category': 'Starters', 'image_url': 'https://images.unsplash.com/photo-1576506295286-5cda18df43e7?w=600'},
    {'name': 'Chicken Tikka Skewers', 'description': 'Perfectly marinated chicken tikka skewers grilled to perfection, served with mint chutney and pickled onions.', 'price': 11.99, 'category': 'Starters', 'image_url': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600', 'is_special': True},
    {'name': 'Caesar Salad', 'description': 'Crisp romaine lettuce, house-made Caesar dressing, shaved Parmesan, and golden croutons.', 'price': 7.99, 'category': 'Starters', 'image_url': 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=600'},

    # Mains
    {'name': 'Grilled Salmon Fillet', 'description': 'Atlantic salmon grilled to perfection, served with lemon-dill butter, seasonal vegetables, and a side of garlic mashed potatoes.', 'price': 24.99, 'category': 'Mains', 'image_url': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600', 'is_special': True},
    {'name': 'Slow-Braised Beef Short Rib', 'description': 'Fall-off-the-bone beef short ribs slow-braised in red wine and herbs, served with creamy polenta and roasted root vegetables.', 'price': 28.99, 'category': 'Mains', 'image_url': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600', 'is_special': True},
    {'name': 'Margherita Pizza', 'description': 'Classic Neapolitan pizza with San Marzano tomatoes, fresh mozzarella, and fragrant basil on a hand-stretched crispy crust.', 'price': 15.99, 'category': 'Mains', 'image_url': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600'},
    {'name': 'Butter Chicken', 'description': 'Tender chicken pieces simmered in a rich, velvety tomato-butter sauce with aromatic spices. Served with basmati rice and naan.', 'price': 17.99, 'category': 'Mains', 'image_url': 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600', 'is_special': True},
    {'name': 'Pasta Carbonara', 'description': 'Spaghetti tossed with guanciale, eggs, Pecorino Romano, and freshly cracked black pepper. Authentically Roman.', 'price': 16.99, 'category': 'Mains', 'image_url': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600'},
    {'name': 'Veggie Buddha Bowl', 'description': 'A nourishing bowl of quinoa, roasted chickpeas, avocado, roasted sweet potato, cucumber, and tahini dressing.', 'price': 13.99, 'category': 'Mains', 'image_url': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600'},
    {'name': 'Lamb Rogan Josh', 'description': 'Slow-cooked lamb in a fragrant Kashmiri chili and whole-spice gravy. Served with jeera rice and garlic naan.', 'price': 19.99, 'category': 'Mains', 'image_url': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600'},

    # Desserts
    {'name': 'Chocolate Lava Cake', 'description': 'Warm dark chocolate fondant with a flowing molten centre, served with Madagascar vanilla bean ice cream.', 'price': 8.49, 'category': 'Desserts', 'image_url': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600', 'is_special': True},
    {'name': 'Tiramisu', 'description': 'Classic Italian dessert with espresso-soaked ladyfingers, mascarpone cream, and a generous dusting of cocoa powder.', 'price': 7.99, 'category': 'Desserts', 'image_url': 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600'},
    {'name': 'New York Cheesecake', 'description': 'Dense, creamy cheesecake on a buttery graham cracker crust, topped with a fresh berry compote.', 'price': 7.49, 'category': 'Desserts', 'image_url': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600'},
    {'name': 'Mango Sorbet', 'description': 'Refreshingly light house-made mango sorbet, served with fresh mint and a slice of fresh mango.', 'price': 5.99, 'category': 'Desserts', 'image_url': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600'},

    # Drinks
    {'name': 'Fresh Lemonade', 'description': 'Hand-squeezed lemonade with a hint of mint and ginger. Sweetened to your preference.', 'price': 3.99, 'category': 'Drinks', 'image_url': 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600'},
    {'name': 'Mango Lassi', 'description': 'Chilled yoghurt and Alphonso mango blended to a smooth, sweet, and slightly tangy perfection.', 'price': 4.49, 'category': 'Drinks', 'image_url': 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=600'},
    {'name': 'Masala Chai', 'description': 'Traditional spiced Indian tea brewed with cardamom, cinnamon, ginger, and full-cream milk. Soothing and aromatic.', 'price': 2.99, 'category': 'Drinks', 'image_url': 'https://images.unsplash.com/photo-1563006695-fb0f40ece41c?w=600'},
    {'name': 'Sparkling Water', 'description': 'Ice-cold San Pellegrino sparkling mineral water. 500ml or 750ml.', 'price': 2.49, 'category': 'Drinks', 'image_url': 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600'},
]

with app.app_context():
    # Create tables
    db.create_all()

    # Create categories
    cat_map = {}
    for cat_data in CATEGORIES:
        existing = Category.query.filter_by(name=cat_data['name']).first()
        if not existing:
            cat = Category(name=cat_data['name'], display_order=cat_data['display_order'])
            db.session.add(cat)
            db.session.flush()
            cat_map[cat_data['name']] = cat.id
        else:
            cat_map[cat_data['name']] = existing.id

    # Create dishes
    for dish_data in DISHES:
        existing = Dish.query.filter_by(name=dish_data['name']).first()
        if not existing:
            dish = Dish(
                name=dish_data['name'],
                description=dish_data['description'],
                price=dish_data['price'],
                category_id=cat_map[dish_data['category']],
                image_url=dish_data.get('image_url', ''),
                is_available=dish_data.get('is_available', True),
                is_special=dish_data.get('is_special', False)
            )
            db.session.add(dish)

    # Create default admin
    existing_admin = AdminUser.query.filter_by(username='admin').first()
    if not existing_admin:
        hashed = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt(rounds=12))
        admin = AdminUser(username='admin', password_hash=hashed.decode('utf-8'))
        db.session.add(admin)

    db.session.commit()
    print("✅ Database seeded successfully!")
    print("   Categories:", len(CATEGORIES))
    print("   Dishes:", len(DISHES))
    print("   Admin: admin / admin123")
