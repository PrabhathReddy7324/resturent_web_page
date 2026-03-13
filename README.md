# BellaCucina Restaurant Website

A full-stack, production-ready restaurant website built with a modern tech stack. Features a stunning customer-facing UI and a secure admin panel for daily menu management.

## Tech Stack

- **Frontend:** React 18, React Router v6, Vite
- **Backend:** Flask, SQLAlchemy, Flask-JWT-Extended, bcrypt
- **Database:** SQLite (ready to migrate to PostgreSQL for production)
- **Styling:** Custom CSS design system (no external CSS frameworks)

## Features

### Public Website
- 🏠 **Home Page**: Hero banner, featured dishes, and essential restaurant information.
- 📜 **Menu Page**: View all available dishes with category filters.
- ⭐ **Specials Page**: Dedicated viewing area for chef's special items.
- ℹ️ **Dish Details**: High-resolution image, full description, and price.
- ✉️ **Contact Page**: Working contact form, Google Maps embed, and opening hours.

### Admin Panel
- 🔒 **Secure Auth**: JWT-based login using bcrypt hashed passwords.
- 📊 **Dashboard**: Manage the entire menu from a central table.
- ✏️ **Full CRUD**: Add, edit, or delete any dish easily.
- 👁️ **Quick Toggles**: Switch dish availability and special status with one click.
- 📩 **View Messages**: Read customer inquiries submitted via the contact form.

## Quick Start (Local Development)

### 1. Start the Backend API

```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
python seed.py  # Run once to create DB and seed 20 sample dishes/admin user
python app.py   # Starts backend on http://localhost:5000
```

### 2. Start the Frontend App

```bash
# In a new terminal window
cd frontend
npm install
npm run dev     # Starts frontend on http://localhost:5173
```

### 3. Accessing the App

- **Public Site:** [http://localhost:5173](http://localhost:5173)
- **Admin Panel:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

**Default Admin Credentials:**
- Username: `kpr@123`
- Password: `kpr#7324`

## Deployment via Render.com

This project is structured specifically to be easily deployable on [Render](https://render.com) using their free tier.

**Backend Service:** Map the Root Directory to `backend`, Build Command to `pip install -r requirements.txt`, and Start Command to `gunicorn app:app`. Connect the DATABASE_URL environment variable if using an external Postgres instance.

**Frontend Static Site:** Map the Root Directory to `frontend`, Build Command to `npm install && npm run build`, and Publish Directory to `dist`. Set `VITE_API_URL` to your backend service URL.
