document.addEventListener("DOMContentLoaded", () => {

    const rows = 4;
    const cols = 6;

    const grid = [];
    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            row.push(null);
        }
        grid.push(row);
    }

    function placeWidget(widgetID, startRow, startCol, rowSpan, colSpan) {
        for (let r = startRow; r < startRow + rowSpan; r++) {
            for (let c = startCol; c < startCol + colSpan; c++) {
                grid[r][c] = widgetID;
            }
        }
    }

    function canPlaceWidget(startRow, startCol, rowSpan, colSpan) {
        for (let r = startRow; r < startRow + rowSpan; r++) {
            for (let c = startCol; c < startCol + colSpan; c++) {
                if (r >= rows || c >= cols || grid[r][c] !== null) {
                    return false; // ocupado o fuera del grid
                }
            }
        }
        return true;
    }

    function setWidgetLive(widget, row, col) {
        widget.classList.forEach(cls => {
            if (cls.startsWith('lib-size-')) {
                widget.classList.remove(cls);
                const newCls = cls.replace('lib-size', 'grid-size');
                widget.classList.add(newCls);
            }
        });

        widget.dataset.live = "true";

        const sizeClass = Array.from(widget.classList).find(c => c.startsWith('grid-size'));
        if (!sizeClass) return;

        const match = sizeClass.match(/grid-size-(\d)x(\d)/);
        const rowSpan = Number(match[1]);
        const colSpan = Number(match[2]);

        for (let r = row; r < row + rowSpan; r++) {
            for (let c = col; c < col + colSpan; c++) {
                grid[r][c] = widget.id;
            }
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const Widget = document.getElementById("prueba");
        setWidgetLive(Widget, 0, 0);
    });

    



    const button = document.getElementById("load-weather");
    const cityInput = document.getElementById("city");
    const suggestionsBox = document.getElementById("suggestions");
    const inputWrapper = document.querySelector(".input-wrapper");

    let currentTempC = null;
    let currentMaxC = null;
    let currentMinC = null;

    const tempValue = document.querySelector(".value");
    const tempMax = document.querySelector(".max");
    const tempMin = document.querySelector(".min");
    const tempEmoji = document.querySelector(".emoji");

    function cToF(c) {
        return (c * 9/5 + 32).toFixed(1);
    }

    function updateTemperaturesDisplay(){
        const unit = document.getElementById("unit").value;

        if (currentTempC === null) return;

        if (unit === "C") {
            tempValue.textContent = `${currentTempC}°`;
            tempMax.textContent = `Máx: ${currentMaxC}°`;
            tempMin.textContent = `Mín: ${currentMinC}°`;
        } else {
            const tempF = cToF(currentTempC);
            const maxF = cToF(currentMaxC);
            const minF = cToF(currentMinC);

            tempValue.textContent = `${tempF}°`;
            tempMax.textContent = `Máx: ${maxF}°`;
            tempMin.textContent = `Mín: ${minF}°`;
        }
    }

    document.getElementById("unit").addEventListener("change", () => {
        updateTemperaturesDisplay();
    });

    function loadWeather() {
        const city = cityInput.value;

        fetch(`/weather?city=${encodeURIComponent(city)}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    tempValue.textContent = data.error;
                    return;
                }

                const temp = data.current_weather.temperature;
                const max = data.daily.temperature_2m_max[0];
                const min = data.daily.temperature_2m_min[0];

                currentTempC = temp;
                currentMaxC = max;
                currentMinC = min;

                let emoji = "";
                if (temp > 25) emoji = "☀️";
                else if (temp < 18) emoji = "❄️";
                else if (temp >= 18 && temp <= 25) emoji = "🌤️";

                tempValue.textContent = `${currentTempC}°`;
                tempEmoji.textContent = `${emoji}`;
                tempMax.textContent = `Máx: ${currentMaxC}°`;
                tempMin.textContent = `Mín: ${currentMinC}°`;
            })
            .catch(() => {
                tempValue.textContent = "Error al cargar el clima";
            });
    }

    button.addEventListener("click", loadWeather);

    cityInput.addEventListener("input", () => {
        const query = cityInput.value;

        if (query.length < 2) {
            suggestionsBox.innerHTML = "";
            inputWrapper.classList.remove("active");
            return;
        }

        fetch(`/cities?q=${encodeURIComponent(query)}`)
            .then(res => res.json())
            .then(cities => {
                suggestionsBox.innerHTML = "";

                if (cities.length === 0) {
                    inputWrapper.classList.remove("active");
                    return;
                }

                cities.forEach(city => {
                    const div = document.createElement("div");
                    div.className = "suggestion";
                    div.textContent = `${city.name}, ${city.country}`;

                    div.addEventListener("click", () => {
                        cityInput.value = city.name;
                        suggestionsBox.innerHTML = "";
                        inputWrapper.classList.remove("active");
                    });

                    suggestionsBox.appendChild(div);
                });

                inputWrapper.classList.add("active");
            });
    });

    cityInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            loadWeather();
            suggestionsBox.innerHTML = "";
            inputWrapper.classList.remove("active");
        }
    });

    cityInput.addEventListener("blur", () => {
        setTimeout(() => {
            suggestionsBox.innerHTML = "";
            inputWrapper.classList.remove("active");
        }, 100);
    });

    const configBtn = document.getElementById("toggle.config");
    const configPanel = document.getElementById("config");
    const body = document.body;

    configBtn.addEventListener("click", () => {
        configPanel.classList.toggle("open");
    });

    body.addEventListener("click", (event) => {
        if (configPanel.classList.contains("open")) {
            if (!configPanel.contains(event.target) && event.target !== configBtn) {
                configPanel.classList.remove("open");
        }
        }
    });
});