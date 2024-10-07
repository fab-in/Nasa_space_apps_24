# CelestiMaps 🌌

**NASA Space Apps 2024 - ExoSky Challenge**

CelestiMaps is an interactive visualization tool that allows users to explore the night sky from the perspective of an exoplanet. Using a third-person camera, it renders stars visible from the chosen exoplanet, and offers both 2D and 3D representations of celestial data.

## Features
- **Exoplanet Perspective**: Enter the name of an exoplanet to visualize all stars visible from that planet.
- **Third-Person Camera**: Explore the star field from different angles using an intuitive third-person camera view.
- **2D Star Rendering**: View and create custom constellations in 2D, with options to save them.
- **(Future Addition)**: 3D mapping of exoplanets—clickable planets displaying their names.

## Tech Stack
- **Frontend**: React + Vite, Three.js for 3D rendering
- **Backend**: Django REST framework

## Setup Instructions

1. **Backend**
    - Navigate to the backend folder and start the server:
      ```bash
      cd backend
      python manage.py runserver
      ```

2. **Frontend**
    - In a separate terminal, navigate to the frontend folder and start the development server:
      ```bash
      cd frontend
      npm run dev
      ```

## License
This project is licensed under the MIT License.
