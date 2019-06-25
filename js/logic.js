// Initialize variables and functions
var earthquakeInfo = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var fillColor = '';

function getColor(d) {
    return d > 5 ? '#b80000' :
    d > 4 ? '#c60d00' :
    d > 3 ? '#d44e00' :
    d > 2 ? '#e28d00' :
    d > 1 ? '#f1c900' :
    '#ffff00';
}

// fetch data in geojson format
d3.json(earthquakeInfo, function(response) {
    
    // create overlay layer
    var earthquakes = L.geoJSON(response.features, {
        // bind a popup to each feature before adding it to the geojson layer
        onEachFeature: function(feature, layer){
        layer.bindPopup(`<h3>${feature.properties.place}</h3>
        <p>${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p>`);
        },

        // dynamically style the markers based on feature characteristics
        // style: function (feature){
        //     fillColor = getColor(feature.properties.mag);
            // if (feature.properties.mag >= 5) {
            //     fillColor = "#b80000";
            // } else if (feature.properties.mag >= 4) {
            //     fillColor = "#c60d00";
            // } else if (feature.properties.mag >= 3) {
            //     fillColor = "#d44e00";
            // } else if (feature.properties.mag >= 2) {
            //     fillColor = "#e28d00";
            // } else if (feature.properties.mag >= 1) {
            //     fillColor = "#F1C900";
            // } else {
            //     fillColor = "#ffff00";
            // }
        // },

        // make the markers circles and style them dynamically based on feature characteristics
        pointToLayer: function(feature, layer) {
            return new L.CircleMarker(layer, {
                radius: feature.properties.mag * 3,
                color: 'orange',
                weight: 1,
                fillColor: getColor(feature.properties.mag),
                opacity: 0.7,
                fillOpacity: 0.6
            });
        },
           
    });

    // create baselayer options
    var lightmap = L
        .tileLayer(
            "https://api.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
            {
                id: 'mapbox.light',
                accessToken: API_KEY
            });

    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGhpbGluc2tpIiwiYSI6ImNqeDNtdmxiczAwcXAzeXJ1ZG5xOGN1b2UifQ.uij4FrWeAslHU7mk7UJnfw");

    // create objects to hold the base and overlay layers
    var baseMaps = {
        "Light Map": lightmap,
        "Dark Map": darkmap
    };

    var overlayMaps = {
        "Earthquakes" : earthquakes
    };

    // Create a new map
    var myMap = L.map("map", {
        center: [38.18, -95.71],
        zoom: 5,
        layers: [lightmap, earthquakes]
    });

    // create a layer control containing the base and overlay layers
    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);

    // Set up the legend
    var legend = L.control({ position: "bottomright" });
    
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend");
            grades = [0,1,2,3,4,5],
            labels = [];
        
        // loop through the density intervals and generate a label and corresponding colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i>' +
                grades[i] + (grades[i+1] ? '&ndash;' + grades[i+1] + '<br>' : '+');
        }
        return div;
    };

    // Add the legend to the map
    legend.addTo(myMap);

});