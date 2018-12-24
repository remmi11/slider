$(function () {
    $("#legend").toggle(function () {
        $(this).animate({right:'0px'}, {queue: false, duration: 500});
    }, function () {
        $(this).animate({right:'-200px'}, {queue: false, duration: 500});
    });
});


var startDateQuery = '7/28/16 12:01:00 AM';
var endDateQuery = '7/28/16 11:59:00 PM';


var satellite = L.esri.basemapLayer('Imagery');
var roads = L.esri.basemapLayer('ImageryTransportation');
var topographic = L.esri.basemapLayer('Topographic');
var myService1 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_7_28_16/FeatureServer/0';
//var myService1 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/7_28_16(3)/FeatureServer/0';
//     url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_7_28_16/FeatureServer/0',

var myService2 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_8_24_16/FeatureServer/0';
var myService3 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_8_28_16/FeatureServer/0';

active = L.layerGroup();
line1 = L.layerGroup();
line2 = L.layerGroup();
line3 = L.layerGroup();

function removeAllLayers() {
    active.clearLayers();
    map.removeLayer(pings)
}

var basemaps = {
    "Satellite": satellite,
    "Roads": roads,
    "Topographic": topographic
}

var overlayMaps = {
    "7/28/16": line1,
    "8/24/16": line2,
    "8/28/16": line3
};

var map = L.map('map', {
    center: [32.30106302536928, -103.501510620117],
    zoom: 10,
    layers: [topographic, line1, line2, line3]
});

L.control.layers(basemaps, overlayMaps).addTo(map);


var pings
function slideChange(time1, time2, service) {

    if (typeof pings !== 'undefined')
        // your code here.
        removeAllLayers();

    pings = L.esri.featureLayer({
        url: service
    })

    pings.setWhere("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
    pings.bindPopup(function (layer) {
        return L.Util.template('<h3>{date_cst2}</h3>Unit ID: {Unit_ID}<br>Lat: {Ping_Latitude}<br>Long: {Ping_Longitude}</p>', layer.feature.properties);
    });;
    pings.addTo(map);

    pings.query().bounds(function (error, latlngbounds) {
        map.fitBounds(latlngbounds);
    });

    // var heatmap = L.esri.Heat.featureLayer({
    //     url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_7_28_16/FeatureServer/0',
    //     radius: 27,
    //     start: time1,
    //     end: time2
    // }).addTo(map);
    // heatmap.addTo(active);
};


//7/28/16
$("#slider-range1").slider({
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
        var time1 = '7/28/16 ' + hours1 + ':' + minutes1
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
        var time2 = '7/28/16 ' + hours2 + ':' + minutes2
        $('.slider-time1_2').html(time2);
        console.log("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
        // console.log("date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "'")
        slideChange(time1, time2, myService1)
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
        var time1 = '8/24/16 ' + hours1 + ':' + minutes1
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
        var time2 = '8/24/16 ' + hours2 + ':' + minutes2
        $('.slider-time2_2').html(time2);
        console.log("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
        // console.log("date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "'")
        slideChange(time1, time2, myService2)
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
        var time1 = '8/28/16 ' + hours1 + ':' + minutes1
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
        var time2 = '8/28/16 ' + hours2 + ':' + minutes2
        $('.slider-time3_2').html(time2);
        console.log("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
        // console.log("date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "'")
        slideChange(time1, time2, myService3)
    }
});
$(".closebtn").click(function () {
    $(".bs-example").slideToggle();
});


//add lines

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

// line1.on('mouseover', function () {
//     this.setText('  ►  ', { repeat: true, attributes: { fill: 'red' } });
// });

// line1.on('mouseout', function () {
//     this.setText(null);
// });

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


$("#clearMap").click(function () {
    removeAllLayers();
});