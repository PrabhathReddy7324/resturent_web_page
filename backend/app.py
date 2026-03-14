from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import db
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Allow JWT in headers
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'

    # Extensions
    CORS(app, origins=app.config['CORS_ORIGINS'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    db.init_app(app)
    JWTManager(app)

    # Register blueprints
    from routes.dishes import dishes_bp
    from routes.admin import admin_bp
    from routes.contact import contact_bp

    app.register_blueprint(dishes_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(contact_bp)

    # Create tables and seed essential data on first run
    with app.app_context():
        db.create_all()
        _init_defaults(app)

    return app


def _init_defaults(app):
    """Create admin user and default categories if they don't exist."""
    import bcrypt
    from models import AdminUser, Category

    # ── Admin user ────────────────────────────────────────────────────────
    if not AdminUser.query.first():
        pw_hash = bcrypt.hashpw('kpr#7324'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        db.session.add(AdminUser(username='kpr@123', password_hash=pw_hash))
        app.logger.info('Created default admin user.')

    # ── Default categories ────────────────────────────────────────────────
    default_categories = [
        ('Appetizers', 1),
        ('Main Course', 2),
        ('Desserts', 3),
        ('Beverages', 4),
        ('Specials', 5),
    ]
    for name, order in default_categories:
        if not Category.query.filter_by(name=name).first():
            db.session.add(Category(name=name, display_order=order))

    db.session.commit()


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
