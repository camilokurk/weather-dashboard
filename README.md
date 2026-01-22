# Weather Dashboard

A Flask-based weather dashboard that fetches real-time weather data from the Open-Meteo API. The project implements a widget-based grid system with autocomplete city search and dynamic temperature unit conversion.

**This project is actively in development.**

## Description

Weather Dashboard pulls weather data for any city using Open-Meteo's geocoding and forecast APIs. The interface features a sliding sidebar configuration panel, city autocomplete search, and temperature conversion between Celsius and Fahrenheit. The widget system uses a custom grid allocation algorithm to place components of varying sizes on a responsive dashboard.

## Techniques

- **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)** for asynchronous HTTP requests to backend endpoints
- **[CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout)** with `grid-template-columns` and dynamic column/row spanning for widget positioning
- **[CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions)** for smooth panel slide-in/out animations
- **[Linear Gradients](https://developer.mozilla.org/en-US/docs/Web/CSS/gradient/linear-gradient)** used for backgrounds and custom dropdown arrows
- **Matrix-based collision detection** algorithm in JavaScript to manage widget placement without overlaps
- **Debounced autocomplete** with minimum query length validation
- **Event delegation** for dynamically generated suggestion elements
- **Template inclusion** using Jinja2's `{% include %}` directive

## Technologies

- **[Flask](https://flask.palletsprojects.com/)** - Python web framework
- **[Open-Meteo API](https://open-meteo.com/)** - Free weather and geocoding API (no API key required)
- **[Requests](https://requests.readthedocs.io/)** - HTTP library for Python
- **System fonts** via `system-ui, -apple-system, BlinkMacSystemFont` font stack

## Project Structure

```
weather-dashboard/
├── static/
│   ├── css/
│   └── js/
├── templates/
├── .gitignore
├── app.py
└── README.md
```

- [`static/css/`](static/css/) - Modular stylesheets: base styles, layout grid definitions, UI components, and widget-specific styles
- [`static/js/`](static/js/) - Grid allocation logic, weather data fetching, autocomplete functionality
- [`templates/`](templates/) - Jinja2 HTML templates including the main dashboard and widget library

## API Endpoints

The Flask backend exposes three routes:

- `/weather?city=<name>` - Returns current weather and daily temperature range
- `/cities?q=<query>` - Autocomplete endpoint returning matching cities (minimum 3 characters)
- `/autocomplete?query=<text>` - Alternative autocomplete format returning formatted strings

