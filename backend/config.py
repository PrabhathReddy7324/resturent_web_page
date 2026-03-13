import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'restaurant-super-secret-key-change-in-prod-2026')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'restaurant-super-secret-key-change-in-prod-2026')
    JWT_ACCESS_TOKEN_EXPIRES = 28800  # 8 hours in seconds
    
    db_url = os.environ.get('DATABASE_URL', 'sqlite:///restaurant.db')
    if db_url.startswith('postgres://'):
        db_url = db_url.replace('postgres://', 'postgresql://', 1)
        
    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    DEBUG = os.environ.get('DEBUG', 'True') == 'True'
