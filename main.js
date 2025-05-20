// 1. SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1 = d3.select("#lineChart1")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const svg2 = d3.select("#lineChart2")
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// 2. LOAD DATA
const parseDate = d3.timeParse("%m/%d/%Y");

d3.csv("weather.csv").then(data => {
    data.forEach(d => {
        d.date = parseDate(d.date.trim());
        d.avg_temp = +d.actual_mean_temp; 
        d.city = d.city.trim();
    });

    // 3. FILTER DATA FOR CHICAGO
    const chicagoData = data.filter(d => d.city.toLowerCase() === "chicago");
    window.chicagoData = chicagoData;
    console.log("Filtered Chicago data:", chicagoData.slice(0, 5));

    // 4. SET SCALES FOR CHART 1
    const x = d3.scaleTime()
        .domain(d3.extent(chicagoData, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([
            d3.min(chicagoData, d => d.avg_temp) - 5,
            d3.max(chicagoData, d => d.avg_temp) + 5
        ])
        .range([height, 0]);

    // 5. PLOT LINE FOR CHART 1
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.avg_temp));

    svg1.append("path")
        .datum(chicagoData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // 6. ADD AXES FOR CHART 1
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg1.append("g")
        .call(d3.axisLeft(y));

    // 7. ADD LABELS FOR CHART 1
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

    // 8. (OPTIONAL) ADD INTERACTIVITY FOR CHART 1

    // ==========================================
    // CHART 2 SETUP (Optional)
    // ==========================================

    // 4.b: SET SCALES FOR CHART 2
    // 5.b: PLOT DATA FOR CHART 2
    // 6.b: ADD AXES FOR CHART 2
    // 7.b: ADD LABELS FOR CHART 2
});
