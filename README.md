# CelestiMaps 🌌

**NASA Space Apps 2024 - ExoSky Challenge**

CelestiMaps is an interactive visualization tool that allows users to explore the night sky from the perspective of an exoplanet. It provides both 2D and 3D celestial data renderings and features a third-person camera for immersive exploration.

---

## Features
- **Exoplanet Perspective**: Visualize stars visible from a chosen exoplanet.
- **Third-Person Camera**: Explore the star field from various angles.
- **2D Star Rendering**: Create and save custom constellations.
- **(Future Addition)**: 3D clickable mapping of exoplanets.

---

## Tech Stack
- **Frontend**: React + Vite, Three.js for 3D rendering.
- **Backend**: Django REST framework.

---

## Project Structure

```
NASA_SPACE_APPS_24/
│
├── backend/              # Django backend
│   ├── exoplanet_api/    # Django app for API
│   ├── exoplanets/       # Django project
│   ├── db.sqlite3        # SQLite database
│   ├── manage.py         # Django management script
│   ├── requirements.txt  # Python dependencies
│   └── vercel.json       # Vercel config for deployment (backend)
│
└── frontend/             # Vite + React frontend
    ├── dist/             # Build directory (auto-generated)
    ├── node_modules/     # Node.js dependencies
    ├── public/           # Static files
    ├── src/              # Source code for React components
    ├── .env              # Environment variables for the frontend
    ├── index.html        # Root HTML file
    ├── package.json      # Node.js dependencies and scripts
    └── vercel.json       # Vercel config for deployment (frontend)
```

---

## Setup Instructions

### Backend Setup (Django)
1. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```
2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```
3. **Run database migrations**:
   ```bash
   python manage.py migrate
   ```
4. **Start the backend server**:
   ```bash
   python manage.py runserver
   ```
   Access it at `http://127.0.0.1:8000/`.

### Frontend Setup (Vite React)
1. **Install dependencies**:
   Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. **Start the frontend server**:
   ```bash
   npm run dev
   ```
   Access it at `http://127.0.0.1:5173/`.

### Running Both
Run the Django backend and React frontend in parallel. Ensure the backend URL is correctly set in the frontend's `.env`.

---

## Deployment
Both backend and frontend are configured for Vercel deployment. Update `vercel.json` files as needed for production.

---

## License
This project is licensed under the MIT License.

---

This README provides a guide for running and deploying CelestiMaps. Feel free to update or expand it as needed.
