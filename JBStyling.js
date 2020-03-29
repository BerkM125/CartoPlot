var mymap = L.map('mapid').setView([47.5301, -122.0326], 13);
var bindstring = "Issaquah";
var mapClickState = 0;
var linestate, linestate2;
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

function plotdraggablepoint() {
    var locationfield = document.getElementById("locationfield");
    var latitude, longitude;
    if (document.getElementById("locationfield2").value != 0 && document.getElementById("locationfield3").value != 0) {
        latitude = document.getElementById("locationfield2").value;
        longitude = document.getElementById("locationfield3").value;
    } else {
        latitude = 47.5301;
        longitude = -122.0326;
    }
    mymap.setView([latitude, longitude], 13);
    bindstring = locationfield.value;
    var marker = L.marker([latitude, longitude], {
        riseOnHover: true,
        draggable: true
    }).addTo(mymap);
    marker.bindTooltip(bindstring, {
        className: 'tooltipclass'
    }).openTooltip();
}

function startRuler() {
    //Circle pick-and-drop ruler
    /*document.getElementById("onRulerEnabled").style.color = "rgba(255,255,255,1)";

    var circle = L.circle([47.6163, -122.0356], 600, {
        riseOnHover: true
    }).addTo(mymap);
    var circle2 = L.circle([47.5301, -122.0326], 600, {
        riseOnHover: true
    }).addTo(mymap);
    var line, line2;
    var points = [circle.getLatLng(), circle2.getLatLng()];
    mymap.setView(circle.getLatLng(), 12);
    line = L.polyline(points, {
        color: 'red',
        weight: 3,
        opacity: 0,
        smoothFactor: 1
    }).addTo(mymap);
    line2 = L.polyline(points, {
        color: 'red',
        weight: 3,
        opacity: 0,
        smoothFactor: 1
    }).addTo(mymap);
    circle.on({
        mousedown: function() {
            if (mapClickState === 0) {
                mymap.on('mousemove', function(e) {
                    points = [circle.getLatLng(), circle2.getLatLng()];
                    if (linestate2 === 0) {
                        mymap.removeLayer(line);
                        mymap.removeLayer(line2);
                        line = L.polyline(points, {
                            color: 'red',
                            weight: 3,
                            opacity: 0.5,
                            smoothFactor: 1
                        }).addTo(mymap);
                        linestate2 += 1;
                    } else {
                        mymap.removeLayer(line);
                        line2 = L.polyline(points, {
                            color: 'red',
                            weight: 3,
                            opacity: 0.5,
                            smoothFactor: 1
                        }).addTo(mymap);
                        linestate2 = 0;
                    }
                    circle.setLatLng(e.latlng);
                });
                mapClickState = 1;
            } else if (mapClickState === 1) {
                mapClickState = 0;
                mymap.removeEventListener('mousemove');
                circle.bindTooltip(L.GeometryUtil.length([circle.getLatLng(), circle2.getLatLng()]).toString() + " Meters", {
                    className: 'tooltipclass'
                }).openTooltip()
            }
        }
    });
    circle2.on({
        mousedown: function() {
            if (mapClickState === 0) {
                mymap.on('mousemove', function(e) {
                    points = [circle.getLatLng(), circle2.getLatLng()];
                    if (linestate === 0) {
                        mymap.removeLayer(line);
                        mymap.removeLayer(line2);
                        line = L.polyline(points, {
                            color: 'red',
                            weight: 3,
                            opacity: 0.5,
                            smoothFactor: 1
                        }).addTo(mymap);
                        linestate += 1;
                    } else {
                        mymap.removeLayer(line);
                        line2 = L.polyline(points, {
                            color: 'red',
                            weight: 3,
                            opacity: 0.5,
                            smoothFactor: 1
                        }).addTo(mymap);
                        linestate = 0;
                    }
                    circle2.setLatLng(e.latlng);
                });
                mapClickState = 1;
            } else if (mapClickState === 1) {
                mapClickState = 0;
                mymap.removeEventListener('mousemove');
                circle2.bindTooltip(L.GeometryUtil.length([circle.getLatLng(), circle2.getLatLng()]).toString() + " Meters", {
                    className: 'tooltipclass'
                }).openTooltip()
            }
        }
    });

    document.getElementById("onRulerEnabled").style.color = "rgba(255,255,255,0)";*/
}

// Close sidebar when ESC pressed
document.onkeydown = function(event) {
    event = event || window.event;
    if (event.keyCode == 27) {
        document.getElementById("slider").checked = false;
    }
};

function sidebarUpdate() {
    slider = document.getElementById("slider").checked;
    console.log(slider);
    if (slider) {
        document.getElementById("togglerLabel").innerHTML = "✖ Tools";
    } else {
        document.getElementById("togglerLabel").innerHTML = "☰ Tools";
    }
}
