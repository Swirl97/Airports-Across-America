// 1. Create a map object.
var mymap = L.map('map', {
    center: [38.46, -98.68],
    zoom: 5,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add airport GeoJSON Data
// Null variable that will hold airport data
var airports = null;

// 4. build up a set of colors from colorbrewer's dark2 category
var colors = chroma.scale('dark2').mode('lch').colors(9);

// 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
for (i = 0; i < 9; i++) {
    $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
}

// Get GeoJSON and put on it on the map when it loads
airports= L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the airport object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
    },
    pointToLayer: function (feature,latlng) {
        var id = 0;
        if (feature.properties.CNTL_TWR == "Y") { id = 0; }
        else if (feature.properties.CNTL_TWR == "N")  { id = 1; }
        else {id = 2; }
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
    },
    attribution: 'Airports Data &copy; Data.gov | US-States &copy; Mike Bostock of D3 | Base Map &copy; CartoDB.DarkMatter | Made By Sarah Liu'
}).addTo(mymap);


// 6. Set function for color ramp
colors = chroma.scale('RdPu').colors(2);

// 7. Set style function that sets fill color.md property equal to airport density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.CT_CNT),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// 9. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

    // 10. Function that runs when legend is added to map
    legend.onAdd = function () {

        // Create Div Element and Populate it with HTML
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<hr><b><p> Airport Control Tower </p><b><br />';
        div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Present </p>';
        div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> None </p>';
        // Return the Legend div containing the HTML content
        return div;
    };

    // 11. Add a legend to map
    legend.addTo(mymap);

// 12. Add a scale bar to map
L.control.scale({position: 'bottomright'}).addTo(mymap);
