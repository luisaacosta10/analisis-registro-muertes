// Global variables
let data = [];
let map = null;
let geoJsonLayer = null;
let selectedCountries = new Set(); // Track selected countries for comparison

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    showLoading();
    loadData();
});

// Show loading state
function showLoading() {
    ['time-series-chart', 'bar-chart', 'map-chart'].forEach(id => {
        const container = document.getElementById(id);
        container.innerHTML = '<div class="loading">Cargando datos...</div>';
    });
}

// Load and process CSV data
async function loadData() {
    try {
        data = await d3.csv('data/share-of-deaths-registered.csv', d => ({
            entidad: d.Entidad,
            codigo: d.Código,
            año: +d.Año,
            proporcion: +d['Proporción de muertes registradas']
        }));

        // Initialize visualizations
        initializeFilters();
        createTimeSeries();
        createBarChart();
        createMap();
        
        // Add trend analysis
        analyzeTrends();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Error al cargar los datos. Por favor, intente nuevamente.');
    }
}

// Initialize filter dropdowns
function initializeFilters() {
    const years = [...new Set(data.map(d => d.año))].sort();
    const countries = [...new Set(data.map(d => d.entidad))].sort();

    // Populate year select
    const yearSelect = document.getElementById('year-select');
    yearSelect.innerHTML = years.map(year => 
        `<option value="${year}">${year}</option>`
    ).join('');

    // Create multi-select for countries with checkboxes
    const countrySelect = document.getElementById('country-select');
    countrySelect.innerHTML = `
        <div class="country-checkboxes">
            ${countries.map(country => `
                <label class="checkbox-label">
                    <input type="checkbox" value="${country}" ${country === countries[0] ? 'checked' : ''}>
                    ${country}
                </label>
            `).join('')}
        </div>
        <div class="select-actions">
            <button onclick="selectAllCountries()">Seleccionar Todos</button>
            <button onclick="deselectAllCountries()">Deseleccionar Todos</button>
        </div>
    `;

    // Add event listeners
    yearSelect.addEventListener('change', updateVisualizations);
    document.querySelectorAll('#country-select input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedCountries.add(checkbox.value);
            } else {
                selectedCountries.delete(checkbox.value);
            }
            updateVisualizations();
        });
    });

    // Set default values
    yearSelect.value = years[years.length - 1];
    selectedCountries.add(countries[0]);
}

// Select/Deselect all countries
function selectAllCountries() {
    document.querySelectorAll('#country-select input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = true;
        selectedCountries.add(checkbox.value);
    });
    updateVisualizations();
}

function deselectAllCountries() {
    document.querySelectorAll('#country-select input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
        selectedCountries.delete(checkbox.value);
    });
    updateVisualizations();
}

// Analyze trends
function analyzeTrends() {
    const trends = data.reduce((acc, curr) => {
        if (!acc[curr.entidad]) {
            acc[curr.entidad] = {
                initial: curr.proporcion,
                final: curr.proporcion,
                change: 0
            };
        }
        if (curr.año < acc[curr.entidad].initial) acc[curr.entidad].initial = curr.proporcion;
        if (curr.año > acc[curr.entidad].final) acc[curr.entidad].final = curr.proporcion;
        return acc;
    }, {});

    // Calculate changes
    Object.keys(trends).forEach(country => {
        trends[country].change = trends[country].final - trends[country].initial;
    });

    // Display trends
    const trendInfo = document.createElement('div');
    trendInfo.className = 'trend-info';
    trendInfo.innerHTML = `
        <h3>Análisis de Tendencias</h3>
        <div class="trend-grid">
            ${Object.entries(trends)
                .sort((a, b) => b[1].change - a[1].change)
                .map(([country, data]) => `
                    <div class="trend-card ${data.change > 2 ? 'significant-improvement' : ''}">
                        <h4>${country}</h4>
                        <p>Cambio: ${data.change.toFixed(1)}%</p>
                        <p>Inicial: ${data.initial.toFixed(1)}%</p>
                        <p>Final: ${data.final.toFixed(1)}%</p>
                    </div>
                `).join('')}
        </div>
    `;

    document.querySelector('.visualizations').insertBefore(trendInfo, document.querySelector('.chart-container'));
}

// Time Series Chart
function createTimeSeries() {
    const container = d3.select('#time-series-chart');
    const margin = {top: 20, right: 120, bottom: 40, left: 60};
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous content
    container.html('');

    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.año))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([85, 100])  // Adjusted to focus on the range of values
        .range([height, 0]);

    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')));

    svg.append('g')
        .call(d3.axisLeft(y));

    // Add axis labels
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Proporción (%)');

    svg.append('text')
        .attr('transform', `translate(${width/2}, ${height + margin.bottom - 5})`)
        .style('text-anchor', 'middle')
        .text('Año');

    // Add grid lines
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
        );

    const line = d3.line()
        .x(d => x(d.año))
        .y(d => y(d.proporcion));

    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Filter data for selected countries
    const filteredData = data.filter(d => selectedCountries.has(d.entidad));
    const countries = [...new Set(filteredData.map(d => d.entidad))];
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add lines and points
    countries.forEach(country => {
        const countryData = filteredData.filter(d => d.entidad === country);
        
        // Add line
        svg.append('path')
            .datum(countryData)
            .attr('fill', 'none')
            .attr('stroke', color(country))
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add points
        svg.selectAll(`circle-${country}`)
            .data(countryData)
            .enter()
            .append('circle')
            .attr('cx', d => x(d.año))
            .attr('cy', d => y(d.proporcion))
            .attr('r', 4)
            .attr('fill', color(country))
            .on('mouseover', (event, d) => {
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                tooltip.html(`
                    <strong>${d.entidad}</strong><br>
                    Año: ${d.año}<br>
                    Proporción: ${d.proporcion.toFixed(1)}%
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', () => {
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            });
    });

    // Add legend
    const legend = svg.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'start')
        .selectAll('g')
        .data(countries)
        .enter().append('g')
        .attr('transform', (d, i) => `translate(${width + 10},${i * 20})`);

    legend.append('rect')
        .attr('x', 0)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', color);

    legend.append('text')
        .attr('x', 24)
        .attr('y', 9.5)
        .attr('dy', '0.32em')
        .text(d => d);
}

// Bar Chart
function createBarChart() {
    const selectedYear = +document.getElementById('year-select').value;
    const yearData = data.filter(d => d.año === selectedYear && selectedCountries.has(d.entidad))
        .sort((a, b) => b.proporcion - a.proporcion);

    const container = d3.select('#bar-chart');
    const margin = {top: 20, right: 20, bottom: 60, left: 60};
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Clear previous content
    container.html('');

    // Create SVG
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
        .domain(yearData.map(d => d.entidad))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([85, 100])  // Adjusted to focus on the range of values
        .range([height, 0]);

    // Add axes
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
        .attr('transform', 'rotate(-45)')
        .style('text-anchor', 'end');

    svg.append('g')
        .call(d3.axisLeft(y));

    // Add grid lines
    svg.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat('')
        );

    // Add axis labels
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text('Proporción (%)');

    // Add tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Add bars
    svg.selectAll('rect')
        .data(yearData)
        .enter()
        .append('rect')
        .attr('x', d => x(d.entidad))
        .attr('y', d => y(d.proporcion))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.proporcion))
        .attr('fill', '#007bff')
        .on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(200)
                .style('opacity', .9);
            tooltip.html(`
                <strong>${d.entidad}</strong><br>
                Proporción: ${d.proporcion.toFixed(1)}%
            `)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');

            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .attr('fill', '#0056b3');
        })
        .on('mouseout', (event) => {
            tooltip.transition()
                .duration(500)
                .style('opacity', 0);

            d3.select(event.currentTarget)
                .transition()
                .duration(200)
                .attr('fill', '#007bff');
        });

    // Add value labels on top of bars
    svg.selectAll('.value-label')
        .data(yearData)
        .enter()
        .append('text')
        .attr('class', 'value-label')
        .attr('x', d => x(d.entidad) + x.bandwidth() / 2)
        .attr('y', d => y(d.proporcion) - 5)
        .attr('text-anchor', 'middle')
        .text(d => d.proporcion.toFixed(1) + '%');
}

// Map Visualization
async function createMap() {
    try {
        // Remove existing map if it exists
        if (map) {
            map.remove();
        }

        // Create new map
        map = L.map('map-chart').setView([0, 0], 2);
        
        // Add tile layer with retina support
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(map);

        const selectedYear = +document.getElementById('year-select').value;
        const yearData = data.filter(d => d.año === selectedYear);

        // Create color scale
        const colorScale = d3.scaleSequential()
            .domain([85, 100])  // Adjusted to focus on the range of values
            .interpolator(d3.interpolateBlues);

        // Create legend
        const legend = L.control({position: 'bottomright'});
        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'info legend');
            const grades = [85, 88, 91, 94, 97, 100];
            
            div.style.backgroundColor = 'white';
            div.style.padding = '10px';
            div.style.borderRadius = '5px';
            
            div.innerHTML += '<h4>Proporción (%)</h4>';
            
            for (let i = 0; i < grades.length - 1; i++) {
                div.innerHTML +=
                    '<i style="background:' + colorScale(grades[i]) + '; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7"></i> ' +
                    grades[i] + '–' + grades[i + 1] + '<br>';
            }
            
            return div;
        };
        legend.addTo(map);

        // Load and add GeoJSON data
        const response = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson');
        const geojson = await response.json();

        // Add new layer
        geoJsonLayer = L.geoJSON(geojson, {
            style: feature => {
                const countryData = yearData.find(d => d.codigo === feature.properties.ISO_A3);
                const isSelected = countryData && selectedCountries.has(countryData.entidad);
                return {
                    fillColor: countryData ? colorScale(countryData.proporcion) : '#ccc',
                    weight: isSelected ? 2 : 1,
                    opacity: 1,
                    color: isSelected ? '#000' : 'white',
                    fillOpacity: isSelected ? 0.8 : 0.5
                };
            },
            onEachFeature: (feature, layer) => {
                const countryData = yearData.find(d => d.codigo === feature.properties.ISO_A3);
                if (countryData) {
                    layer.bindPopup(`
                        <div style="text-align: center;">
                            <strong>${countryData.entidad}</strong><br>
                            <span style="font-size: 1.2em;">${countryData.proporcion.toFixed(1)}%</span>
                        </div>
                    `);
                }
                
                layer.on({
                    mouseover: e => {
                        const layer = e.target;
                        layer.setStyle({
                            fillOpacity: 0.9,
                            weight: 2
                        });
                    },
                    mouseout: e => {
                        const layer = e.target;
                        const countryData = yearData.find(d => d.codigo === feature.properties.ISO_A3);
                        const isSelected = countryData && selectedCountries.has(countryData.entidad);
                        layer.setStyle({
                            fillOpacity: isSelected ? 0.8 : 0.5,
                            weight: isSelected ? 2 : 1
                        });
                    },
                    click: e => {
                        const countryData = yearData.find(d => d.codigo === feature.properties.ISO_A3);
                        if (countryData) {
                            const checkbox = document.querySelector(`input[value="${countryData.entidad}"]`);
                            if (checkbox) {
                                checkbox.checked = !checkbox.checked;
                                if (checkbox.checked) {
                                    selectedCountries.add(countryData.entidad);
                                } else {
                                    selectedCountries.delete(countryData.entidad);
                                }
                                updateVisualizations();
                            }
                        }
                    }
                });
            }
        }).addTo(map);

        // Fit bounds to selected countries
        const selectedFeatures = geojson.features.filter(feature => {
            const countryData = yearData.find(d => d.codigo === feature.properties.ISO_A3);
            return countryData && selectedCountries.has(countryData.entidad);
        });

        if (selectedFeatures.length > 0) {
            const selectedGeoJson = {
                type: 'FeatureCollection',
                features: selectedFeatures
            };
            const bounds = L.geoJSON(selectedGeoJson).getBounds();
            map.fitBounds(bounds);
        }

    } catch (error) {
        console.error('Error loading map data:', error);
        showError('Error al cargar el mapa. Por favor, intente nuevamente.');
        
        // Show error message in map container
        const mapContainer = document.getElementById('map-chart');
        mapContainer.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <p style="color: red;">Error al cargar el mapa</p>
                <button onclick="createMap()" class="retry-button">Reintentar</button>
            </div>
        `;
    }
}

// Update all visualizations
function updateVisualizations() {
    if (selectedCountries.size === 0) {
        showError('Por favor, seleccione al menos un país para visualizar.');
        return;
    }
    createTimeSeries();
    createBarChart();
    createMap();
}

// Error handling
function showError(message) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.error-message');
    existingErrors.forEach(error => error.remove());

    // Create new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Window resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateVisualizations();
    }, 250);
});
