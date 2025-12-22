from flask import Flask, jsonify, render_template, request
import requests

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/weather")
def weather():
    city = request.args.get("city")

    geo_url = (
        "https://geocoding-api.open-meteo.com/v1/search"
        f"?name={city}&count=1&language=es&format=json"
    )

    geo_response = requests.get(geo_url)
    geo_data = geo_response.json()

    if "results" not in geo_data:
        return jsonify({"error": "Ciudad no encontrada"})
    
    lat = geo_data["results"][0]["latitude"]
    lon = geo_data["results"][0]["longitude"]
    
    weather_url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}"
        "&current_weather=true"
        "&daily=temperature_2m_max,temperature_2m_min"
        "&timezone=auto"
    )

    weather_response = requests.get(weather_url)
    weather_data = weather_response.json()

    return jsonify(weather_data)

@app.route("/autocomplete")
def autocomplete():
    query = request.args.get("query", "")

    if not query:
        return jsonify([])
    
    geo_url = (
         f"https://geocoding-api.open-meteo.com/v1/search"
        f"?name={query}&count=5&language=es&format=json"
    )

    geo_response = requests.get(geo_url)
    geo_data = geo_response.json()

    options = []
    if "results" in geo_data:
        for result in geo_data["results"]:
            name = result["name"]
            country = result.get("country", "")
            options.append(f"{name}, {country}")
        
    return jsonify(options)

@app.route("/cities")
def cities():
    query = request.args.get("q")

    if not query or len(query) < 3:
        return jsonify([])
    
    geo_url = (
        "https://geocoding-api.open-meteo.com/v1/search"
        f"?name={query}&count=5&language=es&format=json"
    )

    response = requests.get(geo_url)
    data = response.json()

    if "results" not in data:
        return jsonify([])
    
    cities = []
    for item in data ["results"]:
        cities.append({
            "name": item["name"],
            "country": item.get("country", ""),
            "lat": item["latitude"],
            "lon": item["longitude"]
        })
    return jsonify(cities)

if __name__ == "__main__":
    app.run(debug=True)