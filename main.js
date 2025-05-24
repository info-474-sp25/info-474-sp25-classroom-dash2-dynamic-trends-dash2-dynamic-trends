// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_RENAME = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2_RENAME = d3.select("#lineChart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load CSV
d3.csv("weather.csv").then(data => {
    // Parse and clean data
    data = data.map(d => {
        return {
            year: parseInt(d.record_max_temp_year),
            temp: +d.record_max_temp
        };
    }).filter(d => !isNaN(d.year) && !isNaN(d.temp));

    // Sort by year
    data.sort((a, b) => a.year - b.year);

    //keep every 5th year
    data = data.filter((d, i) => i % 10 === 0);

    // Define x and y scales
    const x = d3.scaleLinear()
    .domain([1870, 2020])  // <-- FIXED DOMAIN from 1870 to 2020
    .range([0, width]);

    const y = d3.scaleLinear()
        .domain([50, 120]) // Fixed y-axis range
        .range([height, 0]);

    // Line function
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.temp));

    // Append path
    svg1_RENAME.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#2D789E")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Axes
    svg1_RENAME.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg1_RENAME.append("g")
        .call(d3.axisLeft(y));

    // Labels
    svg1_RENAME.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");

    svg1_RENAME.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Record Max Temperature (°F)");


        const legend1 = svg1_RENAME.append("g")
.attr("transform", `translate(${width - 150}, ${-30})`);

legend1.append("rect")
.attr("x", 0)
.attr("y", 0)
.attr("width", 20)
.attr("height", 10)
.attr("fill", "#2D789E");

legend1.append("text")
.attr("x", 30)
.attr("y", 10)
.attr("alignment-baseline", "middle")
.style("font-size", "12px")
.text("Record Max Temp");




});






    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2


    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


