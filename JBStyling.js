var mymap = L.map('mapid').setView([47.5301, -122.0326], 13);
var bindstring = "Issaquah";
var mapClickState = 0;
var linestate, linestate2;
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

function plotdraggablepoint() {
  var locationfield = document.getElementById("locationfield");
  var latitude, longitude;
  if (document.getElementById("locationfield2").value == "" || document.getElementById("locationfield3").value == "") {
    alert("You need to put both latitude and longitude in order to plot");
    return;
  }
  latitude = document.getElementById("locationfield2").value;
  longitude = document.getElementById("locationfield3").value;

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

function plotOnClick() {
  mymap.on('click', function(event) {
    marker = L.marker(event.latlng, {
      draggable: true,
      riseOnHover: true
    }).addTo(mymap);
    mymap.removeEventListener("click");
  });
}

function startRuler() {
  document.getElementById("onRulerEnabled").style.color = "rgba(255,255,255,1)";

  let point1;
  let point2;
  let line;

  mymap.on('click', function(event) {
    if (point1 == undefined) {
      point1 = L.marker(event.latlng, {
        draggable: false,
        riseOnHover: true
      }).addTo(mymap);
    } else {
      point2 = L.marker(event.latlng, {
        draggable: false,
        riseOnHover: true
      }).addTo(mymap);

      mymap.removeLayer(line);
      points = [point1.getLatLng(), point2.getLatLng()];
      line = L.polyline(points, {
        color: 'red',
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1
      }).addTo(mymap).bindPopup((Math.round(L.GeometryUtil.length([point1.getLatLng(), point2.getLatLng()]) * 100) / 100).toString() + " Meters", {
        className: 'popUp',
        closeOnClick: false,
        autoClose: false
      }).openPopup();

      mymap.removeEventListener("click");
      mymap.removeEventListener("mousemove");
      document.getElementById("onRulerEnabled").style.color = "rgba(255,255,255,0)";
    }
  });

  mymap.on("mousemove", function(event) {
    if (line != undefined) {
      mymap.removeLayer(line);
    }
    if (point1 != undefined) {
      points = [point1.getLatLng(), event.latlng];
      line = L.polyline(points, {
        color: 'red',
        opacity: 0.5,
        smoothFactor: 1
      }).addTo(mymap);
    }
  });
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
