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
        d.precipitation = +d.actual_precipitation;
        d.city = d.city.trim().toLowerCase();
    });

    const cityDropdown = document.getElementById("cityDropdown");
    const monthDropdown = document.getElementById("monthDropdown");
    const trendlineToggle = document.getElementById("trendlineToggle");

    function updateCharts() {
        const selectedCity = cityDropdown.value.toLowerCase();
        const selectedMonth = monthDropdown.value;

        let filteredData = data.filter(d => d.city === selectedCity);
        if (selectedMonth !== "all") {
            filteredData = filteredData.filter(d => d.date.getMonth().toString() === selectedMonth);
        }

        document.getElementById("tempTitle").textContent = `${capitalize(selectedCity)}: Average Temperature Over Time`;
        document.getElementById("precipTitle").textContent = `${capitalize(selectedCity)}: Daily Precipitation Over Time`;

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

        if (trendlineToggle.checked && dataToUse.length > 1) {
            const xVals = dataToUse.map(d => d.date.getTime());
            const yVals = dataToUse.map(d => d.avg_temp);

            const xMean = d3.mean(xVals);
            const yMean = d3.mean(yVals);
            const slope = d3.sum(xVals.map((x, i) => (x - xMean) * (yVals[i] - yMean))) /
                          d3.sum(xVals.map(x => Math.pow(x - xMean, 2)));
            const intercept = yMean - slope * xMean;

            const xExtent = d3.extent(xVals);
            const trendlineData = [
                { date: new Date(xExtent[0]), avg_temp: intercept + slope * xExtent[0] },
                { date: new Date(xExtent[1]), avg_temp: intercept + slope * xExtent[1] }
            ];

            const trendline = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.avg_temp));

            svg1.append("path")
                .datum(trendlineData)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr("stroke-dasharray", "5,5")
                .attr("d", trendline);
        }
    }

    function drawPrecipChart(dataToUse) {
        svg2.selectAll("*").remove();

        const x = d3.scaleTime()
            .domain(d3.extent(dataToUse, d => d.date))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataToUse, d => d.precipitation)])
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

    function capitalize(s) {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    monthDropdown.addEventListener("change", updateCharts);
    cityDropdown.addEventListener("change", updateCharts);
    trendlineToggle.addEventListener("change", updateCharts);

    updateCharts();
});





