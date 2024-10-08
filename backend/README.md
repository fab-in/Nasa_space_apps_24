# NASA Space Apps 2024 Project

This project consists of two main components:
1. **Backend**: A Django-based API for managing exoplanet data.
2. **Frontend**: A Vite-based React application using Tailwind CSS for the user interface.

## Table of Contents
- [Project Structure](#project-structure)
- [Backend Setup (Django)](#backend-setup-django)
- [Frontend Setup (React with Vite)](#frontend-setup-react-with-vite)
- [Running the Project](#running-the-project)
- [Deployment](#deployment)

---

## Project Structure

The project has the following structure:

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

## Backend Setup (Django)

### Prerequisites
- **Python 3.8+** installed
- **SQLite** (comes bundled with Django by default)
- **pip** (Python package manager)

### Step 1: Set up a virtual environment
To isolate your dependencies, it's best to create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate   # On Windows use: venv\Scripts\activate
```

### Step 2: Install dependencies
Install the required packages using `requirements.txt`:
```bash
pip install -r requirements.txt
```

### Step 3: Run database migrations
To set up the database, run the Django migrations:
```bash
python manage.py migrate
```

### Step 4: Run the Django development server
To run the backend server locally:
```bash
python manage.py runserver
```
The API will be available at `http://127.0.0.1:8000/`.

---

## Frontend Setup (React with Vite)

### Prerequisites
- **Node.js 16+** installed
- **npm** (Node package manager)

### Step 1: Install dependencies
Navigate to the `frontend/` directory and install the required Node packages:
```bash
cd frontend
npm install
```

### Step 2: Run the Vite development server
To start the React application:
```bash
npm run dev
```
This will start the frontend server, and by default, the app should be available at `http://127.0.0.1:5173/`.

### Step 3: Environment Variables
Make sure to create a `.env` file in the `frontend/` directory. This should contain any API keys or backend URLs you need for the frontend to communicate with the backend API.

Example:
```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```

---

## Running the Project

To run both the backend and frontend in parallel during development:

1. **Backend**: Run Django server in the `backend/` folder.
   ```bash
   cd backend
   python manage.py runserver
   ```
2. **Frontend**: Run Vite React server in the `frontend/` folder.
   ```bash
   cd frontend
   npm run dev
   ```

Now, the backend will be running at `http://127.0.0.1:8000/` and the frontend at `http://127.0.0.1:5173/`. You can test the full-stack application by accessing the frontend and making API calls to the Django backend.

---

## Deployment

This project is configured for deployment using **Vercel**. Both the `backend` and `frontend` folders contain their own `vercel.json` configuration files.

### Step 1: Deploy the Backend (Django)
1. Push your code to a Git repository (GitHub, GitLab, etc.).
2. In the Vercel dashboard, import your project and select the `backend/` directory.
3. Set up the following environment variables:
   - `DJANGO_SECRET_KEY`: Your Django secret key.
   - `DATABASE_URL`: URL to your production database (if using PostgreSQL, etc.).

### Step 2: Deploy the Frontend (React)
1. Push the frontend code to the same or another Git repository.
2. In the Vercel dashboard, import the project and select the `frontend/` directory.
3. Configure the frontend environment variables (e.g., API base URL for the Django backend).

After deployment, Vercel will handle building and serving both the frontend and backend.

---

### Troubleshooting
- **CORS Issues**: Ensure that CORS is properly configured in Django if the frontend is hosted on a different domain.
- **Static Files**: If you have static files (like images or CSS), make sure they are properly handled in Django using `collectstatic` for production.
