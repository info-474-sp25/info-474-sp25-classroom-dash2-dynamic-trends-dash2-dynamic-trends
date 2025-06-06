// 1. SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg1 = d3.select("#lineChart1")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const svg2 = d3.select("#lineChart2")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const parseDate = d3.timeParse("%m/%d/%Y");

d3.csv("weather.csv").then(data => {
    data.forEach(d => {
        d.date = parseDate(d.date.trim());
        d.avg_temp = +d.actual_mean_temp;
        d.actual_precipitation = d.actual_precipitation?.trim();
        d.precipitation = d.actual_precipitation === "T" || d.actual_precipitation === ""
            ? 0
            : +d.actual_precipitation;
        d.city = d.city.trim().toLowerCase();
    });

    const cityDropdown = document.getElementById("cityDropdown");
    const monthDropdown = document.getElementById("monthDropdown");
    const tempTitle = document.getElementById("tempTitle");
    const precipTitle = document.getElementById("precipTitle");

    function updateCharts() {
        const selectedCity = cityDropdown.value;
        const selectedMonth = monthDropdown.value;

        const filteredCityData = data.filter(d => d.city === selectedCity);

        let filteredData = filteredCityData;
        if (selectedMonth !== "all") {
            filteredData = filteredData.filter(d => d.date.getMonth().toString() === selectedMonth);
        }

        const cityTitle = selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1);
        tempTitle.textContent = `${cityTitle}: Average Temperature Over Time`;
        precipTitle.textContent = `${cityTitle}: Daily Precipitation Over Time`;

        drawTempChart(filteredData);
        drawPrecipChart(filteredData);
    }

    function drawTempChart(dataToUse) {
        svg1.selectAll("*").remove();

        const x = d3.scaleTime()
            .domain(d3.extent(dataToUse, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([
                d3.min(dataToUse, d => d.avg_temp) - 5,
                d3.max(dataToUse, d => d.avg_temp) + 5
            ])
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.avg_temp));

        svg1.append("path")
            .datum(dataToUse)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg1.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg1.append("g")
            .call(d3.axisLeft(y));

        svg1.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .text("Date");

        svg1.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .text("Avg Temperature (°F)");
    }

    function drawPrecipChart(dataToUse) {
        svg2.selectAll("*").remove();
        dataToUse = dataToUse.filter(d => !isNaN(d.precipitation));

        const x = d3.scaleTime()
            .domain(d3.extent(dataToUse, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, Math.max(0.5, d3.max(dataToUse, d => d.precipitation))])
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d.date))
            .y(d => y(d.precipitation));

        svg2.append("path")
            .datum(dataToUse)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2)
            .attr("d", line);

        svg2.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x));

        svg2.append("g")
            .call(d3.axisLeft(y));

        svg2.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + 40)
            .text("Date");

        svg2.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -50)
            .text("Precipitation (inches)");
    }

    updateCharts();

    monthDropdown.addEventListener("change", updateCharts);
    cityDropdown.addEventListener("change", updateCharts);
});




