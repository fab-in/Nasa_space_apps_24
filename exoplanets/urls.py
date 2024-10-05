from django.urls import path
from .views import get_all_exoplanets_data, get_important_exoplanet_data

urlpatterns = [
    path('exoplanets/', get_all_exoplanets_data, name='get_all_exoplanets_data'),
    path('exoplanets/<str:planet_name>/', get_important_exoplanet_data, name='get_important_exoplanet_data'),
]
