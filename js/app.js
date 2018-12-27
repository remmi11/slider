$('#filter-menu-toggle').click(function() {
    $('.slider').toggleClass('mobile');
    $('.slider').toggleClass('desktop');
    // $('.slider').removeClass('toggled');
});
$('#reset').click(function() {
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

//////////////////////////////////////////////////////////////////////////////////////
// Select Markers on click

// $( '.closebtn' ).click(function() {
//     //alert( "Handler for .click() called." );
    
//   });

// var $window = $(window);

// function markerOnClick() {

//     var windowsize = $window.width();
//     // less than and has class
//     if (windowsize > 450) {
//         $('.slider').removeClass('mobile');
//         $('.slider').addClass('desktop');
//     }// less than and no class
//     else if (windowsize < 450) {
//         $('.slider').removeClass('desktop');
//         $('.slider').addClass('mobile');
//     }
// }


var startDateQuery = '7/28/16 12:01:00 AM';
var endDateQuery = '7/28/16 11:59:00 PM';

var satellite = L.esri.basemapLayer('Imagery');
var roads = L.esri.basemapLayer('ImageryTransportation');
var topographic = L.esri.basemapLayer('Topographic');

var myService1 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_7_28_16/FeatureServer/0';
var myService2 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_8_24_16/FeatureServer/0';
var myService3 = 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/unique_8_28_16/FeatureServer/0';

active = L.layerGroup();
line1 = L.layerGroup();
line2 = L.layerGroup();
line3 = L.layerGroup();

function removeAllLayers() {
    active.clearLayers();
    // map.removeLayer(pings)
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

// Add a layer control element to the map
layerControl = L.control.layers(basemaps, overlayMaps, {position: 'bottomleft'});
layerControl.addTo(map);


var pings;

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
    });

    pings.addTo(active);
    active.addTo(map);

    // map.fitBounds(active);
    pings.query().bounds(function (error, latlngbounds) {
        //console.log(latlngbounds);
        map.fitBounds(latlngbounds);
    });

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
        // console.log("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
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
        // console.log("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
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
        // console.log("(date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "')")
        // console.log("date_cst BETWEEN DATE '" + time1 + "' AND DATE '" + time2 + "'")
        slideChange(time1, time2, myService3)
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


$("#clearMap").click(function () {
    removeAllLayers();
});

var heatmap1 = L.esri.Heat.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_7_28_16/FeatureServer/0',
    radius: 12
}).addTo(map);
// heatmap.addTo(active);

var heatmap2= L.esri.Heat.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_8_24_16/FeatureServer/0',
    radius: 12
}).addTo(map);
// heatmap.addTo(active);

var heatmap3 = L.esri.Heat.featureLayer({
    url: 'https://services5.arcgis.com/6gTxIFMxZdWxCrVQ/arcgis/rest/services/all_8_28_16/FeatureServer/0',
    radius: 12
}).addTo(map);
// heatmap.addTo(active);