import requests
from django.http import JsonResponse

# Existing function to get all exoplanets
def get_all_exoplanets_data(request):
    url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync'
    query = """
    SELECT pl_name
    FROM ps
    """
    params = {
        'query': query,
        'format': 'json',
    }
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        if data:
            exoplanets = [{"Exoplanet": planet_data.get('pl_name', 'N/A')} for planet_data in data]
            return JsonResponse(exoplanets, safe=False)
        else:
            return JsonResponse({"error": "No data found for exoplanets."}, status=404)
    else:
        return JsonResponse({"error": f"Failed to retrieve data. Status code: {response.status_code}"}, status=500)

# New function to get important exoplanet data
def get_important_exoplanet_data(request, planet_name):
    url = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync'
    query = f"""
    SELECT pl_name, ra, dec, pl_orbper, pl_orbsmax, pl_bmassj, pl_radj, sy_dist
    FROM ps
    WHERE pl_name = '{planet_name}'
    """
    params = {
        'query': query,
        'format': 'json',
    }
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        if data:
            planet_data = data[0]
            return JsonResponse({
                    "name": planet_data.get('pl_name', 'N/A'),
                    "ra": planet_data.get('ra', 'N/A'),
                    "dec": planet_data.get('dec', 'N/A'),
                    "orbital_period": planet_data.get('pl_orbper', 'N/A'),
                    "semi_major_axis": planet_data.get('pl_orbsmax', 'N/A'),
                    "mass": planet_data.get('pl_bmassj', 'N/A'),
                    "radius": planet_data.get('pl_radj', 'N/A'),
                    "distance": planet_data.get('sy_dist', 'N/A'),
                }
            )   
        else:
            return JsonResponse({"error": f"No data found for the exoplanet {planet_name}."}, status=404)
    else:
        return JsonResponse({"error": f"Failed to retrieve data. Status code: {response.status_code}"}, status=500)
