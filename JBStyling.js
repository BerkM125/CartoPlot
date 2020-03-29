var mymap = L.map('mapid').setView([47.5301, -122.0326], 13);
var bindstring = "Issaquah";
var mapClickState = 0;
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);

function plotdraggablepoint() {
  var locationfield = document.getElementById("locationfield");
  var latitude, longitude;
  latitude = document.getElementById("locationfield2").value;
  longitude = document.getElementById("locationfield3").value;
  mymap.setView([latitude, longitude], 13);
  bindstring = locationfield.value;
  var marker = L.marker([latitude, longitude], {
    riseOnHover: true,
    draggable: false
  }).addTo(mymap);
  marker.bindTooltip(bindstring, {
    className: 'tooltipclass'
  }).openTooltip();
  var circle = L.circle([latitude, longitude], 100, {
    riseOnHover: true
  }).addTo(mymap);
}

function startRuler() {

  var circle = L.circle([47.6163, -122.0356], 600, {
    riseOnHover: true
  }).addTo(mymap);
  var circle2 = L.circle([47.5301, -122.0326], 600, {
    riseOnHover: true
  }).addTo(mymap);
  var line, line2, linestate;
  var points = [circle.getLatLng(), circle2.getLatLng()];
  mymap.setView(circle.getLatLng(), 13);
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
          circle.setLatLng(e.latlng);
        });
        mapClickState = 1;
      } else if (mapClickState === 1) {
        mapClickState = 0;
        mymap.removeEventListener('mousemove');
      }
    }
  });
  circle2.on({
    mousedown: function() {
      if (mapClickState === 0) {
        mymap.on('mousemove', function(e) {
          points = [circle.getLatLng(), circle2.getLatLng()];
          if (linestate === 0) {
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
      console.log(layer)
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
