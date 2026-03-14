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

    # Create tables on first run
    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
