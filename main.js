// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1 = d3.select("#lineChart1")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    const svg2 = d3.select("#lineChart2")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
const parseDate = d3.timeParse("%Y-%m-%d");

d3.csv("weather.csv").then(data => { 
    data.forEach(d => {
        d.date = parseDate(d.date.trim());
        d.avg_temp = +d.avg_temp;
        d.city = d.city.trim(); // cleans up invisible whitespace
    });

    // 2.b: ... AND TRANSFORM DATA
    const seattleData = data.filter(d => d.city.toLowerCase() === "seattle");
    window.seattleData = seattleData;
    console.log("Filtered Seattle data:", seattleData.slice(0, 5));

    // 3.a: SET SCALES FOR CHART 1
    const x = d3.scaleTime()
        .domain(d3.extent(seattleData, d => d.date))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([d3.min(seattleData, d => d.avg_temp) - 5, d3.max(seattleData, d => d.avg_temp) + 5])
        .range([height, 0]);

    // 4.a: PLOT DATA FOR CHART 1
    const line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.avg_temp));

    svg1.append("path")
        .datum(seattleData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // 5.a: ADD AXES FOR CHART 1
    svg1.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    svg1.append("g")
        .call(d3.axisLeft(y));

    // 6.a: ADD LABELS FOR CHART 1
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


    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2


    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


});