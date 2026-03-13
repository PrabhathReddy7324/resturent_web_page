from flask import Blueprint, jsonify, request
from models import db, ContactMessage

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('/api/contact', methods=['POST'])
def submit_contact():
    """Save a contact form submission to the database."""
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON'}), 400

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    phone = data.get('phone', '').strip()
    message = data.get('message', '').strip()

    # Validate required fields
    errors = {}
    if not name:
        errors['name'] = 'Name is required'
    if not email:
        errors['email'] = 'Email is required'
    if not message:
        errors['message'] = 'Message is required'

    if errors:
        return jsonify({'errors': errors}), 422

    contact = ContactMessage(name=name, email=email, phone=phone, message=message)
    db.session.add(contact)
    db.session.commit()

    return jsonify({'success': True, 'message': 'Your message has been received! We will get back to you soon.'}), 201
