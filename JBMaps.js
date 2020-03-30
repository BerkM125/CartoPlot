var mymap = L.map('mapid').setView([47.5301, -122.0326], 13);
var mapClickState = 0;
var linestate, linestate2;
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);
var freeFormState = 1;

function plotdraggablepoint() {
    var locationfield = document.getElementById("locationfield").value;
    var latitude, longitude;
    if (document.getElementById("locationfield2").value == "" || document.getElementById("locationfield3").value == "") {
        alert("You need to put both latitude and longitude in order to plot");
        return;
    }
    latitude = document.getElementById("locationfield2").value;
    longitude = document.getElementById("locationfield3").value;

    mymap.setView([latitude, longitude], 13);
    var marker = L.marker([latitude, longitude], {
        riseOnHover: true,
        draggable: true
    }).addTo(mymap);
    if (locationfield != "") {
        marker.bindTooltip(locationfield, {
            className: 'tooltipclass'
        }).openTooltip();
    }
}

function plotOnClick() {
    mymap.on('click', function(event) {
        marker = L.marker(event.latlng, {
            draggable: true,
            riseOnHover: true
        }).addTo(mymap);

        let locationfield = document.getElementById("locationfield").value;
        if (locationfield != "") {
            marker.bindTooltip(locationfield, {
                className: 'tooltipclass'
            }).openTooltip();
        }
        mymap.removeEventListener("click");
    });
}

function startFreeForm() {
    let point1;
    let point2;
    let points;
    let line;
    let drawstate = 0;
    let clickstate = 0;
    let total = 0;
    let distanceString;
    point2 = L.marker([0, 0], {
        draggable: false,
        riseOnHover: true
    });
    mymap.on('mousedown', function(event) {
        if (clickstate === 0) {
            point1 = L.marker(event.latlng, {
                draggable: false,
                riseOnHover: true
            }).addTo(mymap);
            mymap.on('mousemove', function(event) {
                if (drawstate === 0) {
                    point2 = L.marker(event.latlng, {
                        draggable: false,
                        riseOnHover: true
                    }).addTo(mymap);
                    drawstate += 1;
                } else if (drawstate === 1) {
                    points = [point2.getLatLng(), event.latlng];
                    line = L.polyline(points, {
                        color: 'red',
                        opacity: 0.5,
                        smoothFactor: 1
                    }).addTo(mymap);
                    total += L.GeometryUtil.length([point2.getLatLng(), event.latlng]);
                    point2.setLatLng(event.latlng);
                }
            });
            clickstate = 1;
        } else if (clickstate === 1) {
            distanceString = total.toString() + " Meters<br>" + (Math.round((total * 0.001) * 100) / 100).toString() + " Kilometers<br>" + (Math.round((total * 0.0006) * 100) / 100).toString() + " Miles<br>";
            point2.bindPopup(distanceString, {
                className: 'popUp',
                closeOnClick: false,
                autoClose: false
            }).openPopup();
            mymap.removeEventListener('mousemove');
            mymap.removeEventListener('mousedown');
            return;
        }
    });

}

function linearRuler() {
    document.getElementById("onRulerEnabled").style.color = "rgba(255,255,255,1)";
    document.getElementById("rulerEnabler").style.backgroundPosition = "left";

    let point1;
    let point2;
    let line;
    let point2State = 0;
    let distanceString;
    let meters;
    point2 = L.marker([0, 0], {
        draggable: false,
        riseOnHover: true
    });
    mymap.on('click', function(event) {
        if (point1 == undefined) {
            point1 = L.marker(event.latlng, {
                draggable: false,
                riseOnHover: true
            }).addTo(mymap);
        } else {
            mymap.removeLayer(line);
            points = [point1.getLatLng(), point2.getLatLng()];
            meters = (Math.round(L.GeometryUtil.length([point1.getLatLng(), point2.getLatLng()]) * 100) / 100);
            distanceString = meters.toString() + " Meters<br>" + (Math.round((meters * 0.001) * 100) / 100).toString() + " Kilometers<br>" + (Math.round((meters * 0.0006) * 100) / 100).toString() + " Miles<br>";
            line = L.polyline(points, {
                color: 'red',
                weight: 3,
                opacity: 0.5,
                smoothFactor: 1
            }).addTo(mymap).bindPopup(distanceString, {
                className: 'popUp',
                closeOnClick: false,
                autoClose: false
            }).openPopup();

            mymap.removeEventListener("click");
            mymap.removeEventListener("mousemove");
            document.getElementById("onRulerEnabled").style.color = "rgba(255,255,255,0)";
            document.getElementById("rulerEnabler").style.backgroundPosition = "right";
        }
    });
    mymap.on("mousemove", function(event) {
        if (line != undefined) {
            mymap.removeLayer(line);
        }
        if (point1 != undefined) {
            points = [point1.getLatLng(), event.latlng];
            if (point2State === 0) {
                mymap.removeLayer(point2);
                point2 = L.marker(event.latlng, {
                    draggable: false,
                    riseOnHover: true
                }).addTo(mymap);
                point2State += 1;
            } else {

                point2State = 0;
            }
            line = L.polyline(points, {
                color: 'red',
                opacity: 0.5,
                smoothFactor: 1
            }).addTo(mymap);
        }
    });
}

function startRuler() {
    /*switch(rulerDrawingMode) {
    	case 0:
    		linearRuler();
    		break;
    	case 1:
    		startFreeForm();
    		break;
    	default:
    		break;
    }*/
    if (freeFormState % 2 === 0) {
        startFreeForm();
    } else {
        linearRuler();
    }
}

function removeAllLayers() {
    mymap.eachLayer(function(layer) {
        if (layer._url != "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png") {
            mymap.removeLayer(layer);
        }
    });
}

// Close sidebar when ESC pressed
document.onkeydown = function(event) {
    event = event || window.event;
    if (event.keyCode == 27) {
        document.getElementById("slider").checked = false;
        sidebarUpdate();
    }
};

function sidebarUpdate() {
    slider = document.getElementById("slider").checked;
    if (slider) {
        document.getElementById("togglerLabel").innerHTML = "✖ Tools";
    } else {
        document.getElementById("togglerLabel").innerHTML = "☰ Tools";
    }
}

// var geojson = [];
//
// function saveMap() {
//   // getCircularReplacer is taken from https://docs.w3cub.com/javascript/errors/cyclic_object_value/
//   const getCircularReplacer = () => {
//     const seen = new WeakSet();
//     return (key, value) => {
//       if (typeof value === "object" && value !== null) {
//         if (seen.has(value)) {
//           return;
//         }
//         seen.add(value);
//       }
//       return value;
//     };
//   };
//
//   mymap.eachLayer(function(layer) {
//     geojson.push(layer);
//   });
//   geojson = JSON.stringify(geojson, getCircularReplacer());
// }
//
// function loadMap() {
//   mymap.eachLayer(function(layer) {
//     mymap.removeLayer(layer);
//   });
//
//   let jsondata = JSON.parse(geojson);
//   jsondata.forEach((element) => {
//     console.log(element)
//     layer = L.GeoJSON.geometryToLayer(element);
//     console.log(layer);
//     layer.addTo(mymap);
//   });
// }
