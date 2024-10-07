# exoplanet_api/wsgi.py

import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exoplanet_api.settings')

application = get_wsgi_application()

# Alias 'application' to 'app' for Vercel compatibility
app = application
