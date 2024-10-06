import requests
from django.http import JsonResponse
import math
from astropy.coordinates import EarthLocation, AltAz, get_sun
import pandas as pd

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
# views.py
from django.http import JsonResponse
from astroquery.gaia import Gaia
import pandas as pd
import math

def ra_dec_parallax_to_cartesian(ra_deg, dec_deg, parallax_mas):
    # Convert RA and Dec from degrees to radians
    ra_rad = math.radians(ra_deg)
    dec_rad = math.radians(dec_deg)

    # Convert parallax from milliarcseconds to distance in parsecs
    if parallax_mas <= 0:
        return None, None, None  # Skip invalid parallax values
    
    # Convert parallax from milliarcseconds to parsecs (assuming input is in mas)
    distance_parsecs = 1 / (parallax_mas / 1000)
    
    # Calculate Cartesian coordinates
    x = distance_parsecs * math.cos(dec_rad) * math.cos(ra_rad)
    y = distance_parsecs * math.cos(dec_rad) * math.sin(ra_rad)
    z = distance_parsecs * math.sin(dec_rad)

    return x, y, z

def fetch_star_data(request, planet_data):
    print(planet_data)
    
    # Parse the parameters from the query string
    params = dict(param.split('=') for param in planet_data.split('&'))
    
    # Extract ra, dec, and dist as floats
    ra = float(params.get('ra', 0))  # Default to 0 if not found
    dec = float(params.get('dec', 0))  # Default to 0 if not found
    dist = float(params.get('dist', 0))  # Default to 0 if not found
    
    # Set a row limit (optional)
    Gaia.ROW_LIMIT = 50000
    
    par = 1000 / dist
    par_margin = 100

    # Define the search range (in degrees)
    search_radius = 360 # 1 degree

    # ADQL query to get star data from Gaia using the provided exoplanet coordinates
    query = f"""
        SELECT TOP 2000 source_id, ra, dec, phot_g_mean_mag, parallax
        FROM gaiadr3.gaia_source 
        WHERE ra BETWEEN {ra - search_radius} AND {ra + search_radius} 
        AND dec BETWEEN {dec - search_radius} AND {dec + search_radius}
        AND parallax BETWEEN {par - par_margin} AND {par + par_margin}
        ORDER BY phot_g_mean_mag ASC
    """

    # Launch the query
    job = Gaia.launch_job(query)
    results = job.get_results()

    # Convert results to a Pandas DataFrame
    df = results.to_pandas()

    # Filter out rows with missing data and where parallax is less than or equal to 0
    df_valid = df.dropna(subset=['ra', 'dec', 'phot_g_mean_mag', 'parallax'])
    df_valid = df_valid[df_valid['parallax'] > 0].copy()  # Keep a copy of valid rows only


    x_exoplanet, y_exoplanet, z_exoplanet = ra_dec_parallax_to_cartesian(ra, dec, par)  # Use a large parallax value for the exoplanet (assume close distance)

    # Create empty lists for the x, y, z coordinates
    x_vals = []
    y_vals = []
    z_vals = []

    for index, row in df_valid.iterrows():
        ra = row['ra']
        dec = row['dec']
        parallax = row['parallax']
        
        # Perform conversion to Cartesian coordinates
        x_star, y_star, z_star = ra_dec_parallax_to_cartesian(ra, dec, parallax)
        
        # Translate star coordinates so the exoplanet is at the origin
        x_translated = x_star - x_exoplanet
        y_translated = y_star - y_exoplanet
        z_translated = z_star - z_exoplanet
        
        # Append the translated coordinates to the lists
        x_vals.append(x_translated)
        y_vals.append(y_translated)
        z_vals.append(z_translated)

    # Add X, Y, Z coordinates to the filtered DataFrame
    df_valid['X'] = x_vals
    df_valid['Y'] = y_vals
    df_valid['Z'] = z_vals

    # Convert the filtered DataFrame to a dictionary for JSON
    data_dict = df_valid.to_dict(orient='records')

    # Return the data as a JSON response
    return JsonResponse(data_dict, safe=False)
