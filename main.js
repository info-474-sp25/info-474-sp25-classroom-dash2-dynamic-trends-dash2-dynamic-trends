// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 150, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_precip = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
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

// (If applicable) Tooltip element for interactivity
// const tooltip = ...

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    // 2.b: ... AND TRANSFORM DATA

    console.log(data); // Check data

    const parseDate = d3.timeParse("%m/%d/%Y");
    const formatMonthYear = d3.timeFormat("%Y-%m"); // ChatGPT used to help write code for parsing and formatting month data from the date column. 
    const parseMonthYear = d3.timeParse("%Y-%m");

    data.forEach(d => {
        d.date = parseDate(d.date);
        d.actual_precipitation = +d.actual_precipitation;
    });

    data.filter(d => 
        d.date != null
        && d.actual_precipitation != null
    );  
    
    const dataMap1 = d3.rollups(data,
        v => d3.mean(v, d => d.actual_precipitation),
        d => d.city,
        d => formatMonthYear(d.date)
    );

    const cityDataArr = Array.from(dataMap1, ([city, values]) => ({
        city,
        values: values
            .map(([monthStr, avgPrecip]) => ({
                month: parseMonthYear(monthStr),  // ChatGPT used to help write values code.
                avgPrecip
            }))
            .sort((a, b) => a.month - b.month)
    }));

    // 3.a: SET SCALES FOR CHART 1

    let xMonth = d3.scaleTime() 
    .domain(d3.extent(data, d => d.date)) // ChatGPT used to help write this line (used .extent instead of .max).
    .range([0, width]);

    let yAvgPrecip = d3.scaleLinear()
        .domain([0, d3.max(cityDataArr.flatMap(d => d.values.map(v => v.avgPrecip)))]) // ChatGPT used to help write this line. 
        .range([height, 0]);

    // 4.a: PLOT DATA FOR CHART 1

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(cityDataArr.map(d => d.city));

    const line = d3.line()
        .x(d => xMonth(d.month))  
        .y(d => yAvgPrecip(d.avgPrecip));

    cityDataArr.forEach(cityEntry => {
        svg1_precip.append("path")
        .datum(cityEntry.values)
        .attr("d", line)
        .attr("stroke", color(cityEntry.city))
        .attr("stroke-width", 4)
        .attr("fill", "none");
    });

    // 5.a: ADD AXES FOR CHART 1
    
    svg1_precip.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xMonth).tickFormat(d3.timeFormat("%b %Y"))); // ChatGPT used to write this line of code, getting tickFormat correct with time. 

    svg1_precip.append("g")
    .call(d3.axisLeft(yAvgPrecip));

    // 6.a: ADD LABELS FOR CHART 1

    svg1_precip.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + (margin.bottom / 2))
        .text("Month");

    svg1_precip.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left / 2)
        .attr("x", -height / 2)
        .text("Avg. Actual Precipitation (in)");

    // ChatGPT used to help write legend code.
        const legend = svg1_precip.append("g")
        .attr("transform", `translate(${width + 20}, 0)`);
    
    cityDataArr.forEach((d, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 12)
            .attr("height", 12)
            .attr("fill", color(d.city));
    
        legend.append("text")
            .attr("x", 18)
            .attr("y", i * 20 + 10)
            .text(d.city)
            .style("font-size", "12px")
            .attr("alignment-baseline", "middle");
    });

    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2

    
    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 2


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


});