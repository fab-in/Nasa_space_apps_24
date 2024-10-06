from django.urls import path
from .views import *

urlpatterns = [
    path('exoplanets/', get_all_exoplanets_data, name='get_all_exoplanets_data'),
    path('exoplanets/<str:planet_name>/', get_important_exoplanet_data, name='get_important_exoplanet_data'),
    # Add ra, dec, and dist as float parameters to the stars URL
    path('stars/<str:planet_data>/', fetch_star_data, name='fetch_star_data'),
]
