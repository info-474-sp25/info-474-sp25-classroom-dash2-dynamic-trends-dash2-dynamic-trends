// 1: SET GLOBAL VARIABLES
const margin = { top: 50, right: 150, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG containers for both charts
const svg1_temp = d3.select("#lineChart1") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const svg2_precip = d3.select("#lineChart2") // If you change this ID, you must change it in index.html too
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// 2.a: LOAD...
d3.csv("weather.csv").then(data => {
    // 2.b: ... AND TRANSFORM DATA
    // ChatGPT used to help separate data transformations for each viz which resolved conflicts.
    const data_temp = data.map(d => ({
        year: parseInt(d.record_max_temp_year),
        temp: +d.record_max_temp
    })).filter(d => !isNaN(d.year) && !isNaN(d.temp))
      .sort((a, b) => a.year - b.year)
      .filter((d, i) => i % 10 === 0);

    const data_precip = data.map(d => ({
        city: d.city,
        date: d3.timeParse("%m/%d/%Y")(d.date),
        actual_precipitation: +d.actual_precipitation
    })).filter(d => d.date && !isNaN(d.actual_precipitation));

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
    svg1_temp.append("path")
        .datum(data_temp)
        .attr("fill", "none")
        .attr("stroke", "#2D789E")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Axes
    svg1_temp.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg1_temp.append("g")
        .call(d3.axisLeft(y));

    // Labels
    svg1_temp.append("text")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");

    svg1_temp.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Record Max Temperature (°F)");

    const formatMonthYear = d3.timeFormat("%Y-%m"); // ChatGPT used to help write code for parsing and formatting month data from the date column. 
    const parseMonthYear = d3.timeParse("%Y-%m");
    
    const dataMap2 = d3.rollups(data_precip,
        v => d3.mean(v, d => d.actual_precipitation),
        d => d.city,
        d => formatMonthYear(d.date)
    );

    const cityDataArr = Array.from(dataMap2, ([city, values]) => ({
        city,
        values: values
            .map(([monthStr, avgPrecip]) => ({
                month: parseMonthYear(monthStr),  // ChatGPT used to help write values code.
                avgPrecip
            }))
            .sort((a, b) => a.month - b.month)
    }));



    // Legend(chatgpt)
    const legend = svg1_RENAME.append("g")
        .attr("transform", `translate(${width - 150}, ${-30})`); // Adjust position as needed

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 20)
        .attr("height", 10)
        .attr("fill", "#2D789E");

    legend.append("text")
        .attr("x", 30)
        .attr("y", 10)
        .attr("alignment-baseline", "middle")
        .style("font-size", "12px")
        .text("Record Max Temp");

      
          






    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2

    let xMonth = d3.scaleTime() 
    .domain(d3.extent(data_precip, d => d.date)) // ChatGPT used to help write this line (used .extent instead of .max).
    .range([0, width]);

    let yAvgPrecip = d3.scaleLinear()
        .domain([0, d3.max(cityDataArr.flatMap(d => d.values.map(v => v.avgPrecip)))]) // ChatGPT used to help write this line. 
        .range([height, 0]);

    // 4.b: PLOT DATA FOR CHART 2

    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(cityDataArr.map(d => d.city));

    const line2 = d3.line()
        .x(d => xMonth(d.month))  
        .y(d => yAvgPrecip(d.avgPrecip));

    cityDataArr.forEach(cityEntry => {
        svg2_precip.append("path")
        .datum(cityEntry.values)
        .attr("d", line2)
        .attr("stroke", color(cityEntry.city))
        .attr("stroke-width", 4)
        .attr("fill", "none");
    });

    // 5.b: ADD AXES FOR CHART 2
    
    svg2_precip.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xMonth).tickFormat(d3.timeFormat("%b %Y"))); // ChatGPT used to write this line of code, getting tickFormat correct with time. 

    svg2_precip.append("g")
    .call(d3.axisLeft(yAvgPrecip));

    // 6.b: ADD LABELS FOR CHART 2

    svg2_precip.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height + (margin.bottom / 2))
        .text("Month");

    svg2_precip.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left / 2)
        .attr("x", -height / 2)
        .text("Avg. Actual Precipitation (in)");

    // ChatGPT used to help write legend code.
        const legend = svg2_precip.append("g")
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
});
    // 7.b: ADD INTERACTIVITY FOR CHART 2


