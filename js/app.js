$('#filter-menu-toggle').click(function () {
    $('.slider').toggleClass('mobile');
    $('.slider').toggleClass('desktop');
    // $('.slider').removeClass('toggled');
});
$('#reset').click(function () {
    $('.slider').removeClass('mobile');
    $('.slider').removeClass('desktop');
    // $('.slider').removeClass('toggled');
    // $('#userSearch').val("");
    $('#reset').removeClass('activated');
});

//////////////////////////////////////////////////////////////////////////////////////
// Select Markers on click
var $window = $(window);

function markerOnClick(e) {

    var windowsize = $window.width();
    // less than and has class
    if (windowsize > 450) {
        $('.slider').removeClass('mobile');
        $('.slider').addClass('desktop');
    }// less than and no class
    else if (windowsize < 450) {
        $('.slider').removeClass('desktop');
        $('.slider').addClass('mobile');
    }
    if (!$(this).hasClass("activated")) {
        //console.log('activated');
        $('.filter').removeClass('activated');
        $(this).addClass('activated');
    } else {
        $(this).removeClass('activated');
        //console.log('not activated');
    }
};

var startDateQuery = '7/28/16 12:01:00 AM';
var endDateQuery = '7/28/16 11:59:00 PM';

var satellite = L.esri.basemapLayer('Imagery');
var roads = L.esri.basemapLayer('ImageryTransportation');
var topographic = L.esri.basemapLayer('Topographic');

var myService1 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_7_28_16/FeatureServer/0';
var myService2 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_8_24_16/FeatureServer/0';
var myService3 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_8_28_16/FeatureServer/0';

// var myService1 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_7_28_16/FeatureServer/0';
// var myService2 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_8_24_16/FeatureServer/0';
// var myService3 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_8_28_16/FeatureServer/0';

var query;
var circles;
var trucks;
var service;
var time1;
var time2;
var times = [];

var active = L.layerGroup();
var line1 = L.layerGroup();
var line2 = L.layerGroup();
var line3 = L.layerGroup();
var icons = L.layerGroup();

function removeAllLayers() {
    active.clearLayers();
    circleGroup.clearLayers();
};


var basemaps = {
    "Satellite": satellite,
    "Roads": roads,
    "Topographic": topographic
}

var overlayMaps = {
    "7/28/16": line1,
    "8/24/16": line2,
    "8/28/16": line3,
    "POIs": icons
};

var map = L.map('map', {
    center: [32.30106302536928, -103.501510620117],
    zoom: 10,
    layers: [topographic, line1, line2, line3, icons]
});

var circleGroup = L.layerGroup().addTo(map);

// Add a layer control element to the map
layerControl = L.control.layers(basemaps, overlayMaps, { position: 'bottomleft' });
layerControl.addTo(map);

function slideChange(time1, time2, service) {

    // service = service

    if (typeof query !== 'undefined')
        // your code here.
        removeAllLayers();

    query = L.esri.query({
        url: service
    });

    query.where("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')");

    query.run(function (error, pings) {
        trucks = L.geoJSON(pings, {
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<h3>' + layer.feature.properties.date_cst2 +
                    '</h3>Unit ID: ' + layer.feature.properties.unit_id +
                    '<br>Ping ID: ' + layer.feature.properties.ping_id +
                    '<br>Lat: ' + layer.feature.properties.lat +
                    '<br>Long: ' + layer.feature.properties.long + '</p>');
            }
        });
        trucks.addTo(active);
        map.fitBounds(trucks.getBounds());

    });

    active.addTo(map);
};


//7/28/16
$("#slider-range1").slider({
    range: true,
    min: 0,
    max: 1440,
    step: 30,
    values: [0, 1440],
    slide: function (e, ui) {
        var hours1 = Math.floor(ui.values[0] / 60);
        var minutes1 = ui.values[0] - (hours1 * 60);
        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            hours1 = 12;
            minutes1 = minutes1;
        }
        time1 = '7/28/16 ' + hours1 + ':' + minutes1
        $('.slider-time1_1').html(time1);
        var hours2 = Math.floor(ui.values[1] / 60);
        var minutes2 = ui.values[1] - (hours2 * 60);
        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
            if (hours2 == 12) {
                hours2 = hours2;
                minutes2 = minutes2 + " PM";
            } else if (hours2 == 24) {
                hours2 = 11;
                minutes2 = "59 PM";
            } else {
                hours2 = hours2 - 12;
                minutes2 = minutes2 + " PM";
            }
        } else {
            hours2 = hours2;
            minutes2 = minutes2 + " AM";
        }
        //7/28/16 10:43 AM
        time2 = '7/28/16 ' + hours2 + ':' + minutes2
        $('.slider-time1_2').html(time2);
        // console.log("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
        // console.log("date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "'")
        service = myService1;
        slideChange(time1, time2, service)
    }
});

//8/24/16
$("#slider-range2").slider({
    range: true,
    min: 0,
    max: 1440,
    step: 15,
    values: [0, 1440],
    slide: function (e, ui) {
        var hours1 = Math.floor(ui.values[0] / 60);
        var minutes1 = ui.values[0] - (hours1 * 60);
        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            hours1 = 12;
            minutes1 = minutes1;
        }
        time1 = '8/24/16 ' + hours1 + ':' + minutes1
        $('.slider-time2_1').html(time1);
        var hours2 = Math.floor(ui.values[1] / 60);
        var minutes2 = ui.values[1] - (hours2 * 60);
        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
            if (hours2 == 12) {
                hours2 = hours2;
                minutes2 = minutes2 + " PM";
            } else if (hours2 == 24) {
                hours2 = 11;
                minutes2 = "59 PM";
            } else {
                hours2 = hours2 - 12;
                minutes2 = minutes2 + " PM";
            }
        } else {
            hours2 = hours2;
            minutes2 = minutes2 + " AM";
        }
        //7/28/16 10:43 AM
        time2 = '8/24/16 ' + hours2 + ':' + minutes2
        $('.slider-time2_2').html(time2);
        service = myService2;
        slideChange(time1, time2, service)
    }
});

//8/28/16
$("#slider-range3").slider({
    range: true,
    min: 0,
    max: 1440,
    step: 15,
    values: [0, 1440],
    slide: function (e, ui) {
        var hours1 = Math.floor(ui.values[0] / 60);
        var minutes1 = ui.values[0] - (hours1 * 60);
        if (hours1.length == 1) hours1 = '0' + hours1;
        if (minutes1.length == 1) minutes1 = '0' + minutes1;
        if (minutes1 == 0) minutes1 = '00';
        if (hours1 >= 12) {
            if (hours1 == 12) {
                hours1 = hours1;
                minutes1 = minutes1 + " PM";
            } else {
                hours1 = hours1 - 12;
                minutes1 = minutes1 + " PM";
            }
        } else {
            hours1 = hours1;
            minutes1 = minutes1 + " AM";
        }
        if (hours1 == 0) {
            hours1 = 12;
            minutes1 = minutes1;
        }
        time1 = '8/28/16 ' + hours1 + ':' + minutes1
        $('.slider-time3_1').html(time1);
        var hours2 = Math.floor(ui.values[1] / 60);
        var minutes2 = ui.values[1] - (hours2 * 60);
        if (hours2.length == 1) hours2 = '0' + hours2;
        if (minutes2.length == 1) minutes2 = '0' + minutes2;
        if (minutes2 == 0) minutes2 = '00';
        if (hours2 >= 12) {
            if (hours2 == 12) {
                hours2 = hours2;
                minutes2 = minutes2 + " PM";
            } else if (hours2 == 24) {
                hours2 = 11;
                minutes2 = "59 PM";
            } else {
                hours2 = hours2 - 12;
                minutes2 = minutes2 + " PM";
            }
        } else {
            hours2 = hours2;
            minutes2 = minutes2 + " AM";
        }
        //7/28/16 10:43 AM
        time2 = '8/28/16 ' + hours2 + ':' + minutes2
        $('.slider-time3_2').html(time2);
        service = myService3;
        slideChange(time1, time2, service)
    }
});

//add lines to map
var route1 = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/line_7_28_16/FeatureServer/0',
    style: function (feature) {
        var c, o;
        o = 0.75;
        c = '#0067c5';
        return { color: c, opacity: o, weight: 5 };
    }
}).addTo(map);
route1.addTo(line1);

var route2 = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/line_8_24_16/FeatureServer/0',
    style: function (feature) {
        var c, o;
        o = 0.75;
        c = '#21c579';
        return { color: c, opacity: o, weight: 5 };
    }
}).addTo(map);
route2.addTo(line2);


var route3 = L.esri.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/line_8_28_16/FeatureServer/0',
    style: function (feature) {
        var c, o;
        o = 0.75;
        c = '#ff5ccb';
        return { color: c, opacity: o, weight: 5 };
    }
}).addTo(map);
route3.addTo(line3);


$("#clearMap").click(function () {
    removeAllLayers();
    $('#collapseOne').collapse("hide")
    $('#collapseTwo').collapse("hide")
    $('#collapseThree').collapse("hide")
    console.log(times);
});

var heatmap1 = L.esri.Heat.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_7_28_16/FeatureServer/0',
    radius: 12
}).addTo(map);
// heatmap.addTo(active);

var heatmap2 = L.esri.Heat.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_8_24_16/FeatureServer/0',
    radius: 12
}).addTo(map);
// heatmap.addTo(active);

var heatmap3 = L.esri.Heat.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_8_28_16/FeatureServer/0',
    radius: 12
}).addTo(map);
// heatmap.addTo(active);


///////////////////////////////////////////////////////////////////////////////////////
// select features using turf within
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var drawControl = new L.Control.Draw({
    position: 'topleft',
    draw: {
        polyline: false,
        polygon: false,
        marker: false,
        circlemarker: false,
        circle: false,
        rectangle: {
            shapeOptions: {
                color: 'red'
            },
            allowIntersection: false,
            drawError: {
                color: 'orange',
                timeout: 1000
            },
            showArea: true,
            metric: false,
            repeatMode: true
        }
    },
    edit: {
        featureGroup: drawnItems
    }
}).addTo(map);

var boundingBoxes;
var markers;
var features;
var d1;
var d2;
var difference;
var hours;
var minutes;

function empty() {
    drawnItems = new L.FeatureGroup();
    times.length = 0;
    circleGroup.clearLayers();
};

map.on('draw:drawstart', function (e) {
    empty();
});

map.on('draw:created', function (e) {

    var type = e.layerType,
        layer = e.layer;

    if (type === 'rectangle') {

        drawnItems.addLayer(layer);
        boundingBoxes = drawnItems.toGeoJSON();

        markers = L.esri.query({
            url: service
        }).within(boundingBoxes.features[0]).where("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')");

        markers.run(function (err, samples, raw) {
            features = samples.features;
            // loop through the collection of census block points
            for (i = 0; i < features.length; i++) {
                // if the point is inside (or contained by, the bigger box) draw it in red
                if (turf.inside(features[i], boundingBoxes.features[0])) {
                    circles = L.geoJSON(features[i], {
                        pointToLayer: function (geoJsonPoint, latlng) {
                            return L.circleMarker(latlng, {
                                color: '#ff0066'
                            });
                        },
                        onEachFeature: function (feature, layer) {
                            pings = layer.feature.properties.date_cst
                            // times.push(time.substr(time.length - 8).trim())
                            times.push(pings);
                        }
                    }).addTo(circleGroup);
                }
            }
            times.sort();
            console.log(times);
            d1 = new Date(times[0]);
            // console.log(d1);
            d2 = new Date(times[times.length - 1]);
            // console.log(d2);

            difference = new Date(d2 - d1);

            hours = Math.floor(difference / 36e5)
            minutes = Math.floor(difference % 36e5 / 60000)
            document.getElementById("hours").innerHTML = hours
            document.getElementById("minutes").innerHTML = minutes
            $('#collapseOne').collapse("hide")
            $('#collapseTwo').collapse("hide")
            $('#collapseThree').collapse("hide")
        });
        // map.fitBounds(circles.getBounds());

    };

});


// load GeoJSON from an external file.  
//Replace URL below to point to your GeoJSON
$.getJSON("js/zone_names_all.geojson", function (data) {

    var truckIcon = L.divIcon({
        html: '<i class="fa fa-truck fa-2x" style="color: black"></i>',
        className: 'myDivIcon'
    })


    // add GeoJSON layer to the map once the file is loaded
    var pois = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Create Bike Icon Marker
            var marker = L.marker(latlng, { icon: truckIcon });
            //To show the fields in your data, replace the field names in the {} to match your data
            marker.bindPopup(feature.properties.name);
            return marker;
        }
        //add data layer containing bike crash data to the map
    }).addTo(map);
    pois.addTo(icons)
});