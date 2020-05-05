var mymap = L.map('mapid').setView([47.5301, -122.0326], 13);
var mapClickState = 0;
var linestate, linestate2;

var currentMapURL = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
var satelliteLayer = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
var topoLayer = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
var osmLayer = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var mapboxLayerURL = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVya20xMjUiLCJhIjoiY2s4Z3NwY3BvMDUyMDNncWh0cHkxazF1dyJ9.EnlBFMTqmwjsZko93I8EDA';
var googleLayer = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
var mapboxLayer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVya20xMjUiLCJhIjoiY2s4Z3NwY3BvMDUyMDNncWh0cHkxazF1dyJ9.EnlBFMTqmwjsZko93I8EDA', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);

var googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

var searchOptions = {
    collapsed: true, 
    position: 'topright',
    text: 'Search',
    placeholder: 'Location name...',
};

var osmGeocoder = new L.Control.OSMGeocoder(searchOptions);
mymap.addControl(osmGeocoder);

var freeFormState = 1;
var locationArray = [L.latLng(47.5301, -122.0326), L.latLng(47.6163, -122.0356)];
var locationTableIndex = 2; //There are 2 items in the array already.
var locationht = new HashTable({"issaquah": 0, "sammamish": 1});

for(var i = locationTableIndex; i < localStorage.getItem('locationCount'); i++) {
	var locationstring = localStorage.getItem(i);
  var locationJSON = JSON.parse(locationstring);
  var locationName = (localStorage.getItem('tooltipNumber'+i));
  var tmarker = L.geoJSON(locationJSON).bindTooltip(locationName, {className: 'tooltipclass'}).openTooltip().addTo(mymap);
  var coords = [];
  console.log("Location JSON: "+locationstring);
  localStorage.setItem(i, JSON.stringify(locationJSON))
  locationArray.push(coords);
  locationht.setItem(locationstring, i);
	locationTableIndex = i+1;
}

function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }
    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    }

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) { 
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    this.clear = function()
    {
        this.items = {}
        this.length = 0;
    }
}

function plotdraggablepoint() {
  var locationfield = document.getElementById("locationfield").value;
  var latitude, longitude;
  if (document.getElementById("locationfield2").value == "" || document.getElementById("locationfield3").value == "") {
    alert("You need to put both latitude and longitude in order to plot");
    return;
  }
  latitude = document.getElementById("locationfield2").value;
  longitude = document.getElementById("locationfield3").value;

  mymap.setView([latitude, longitude], 15);
  var marker = L.marker([latitude, longitude], {
    riseOnHover: true,
    draggable: true
  }).addTo(mymap);
  if (locationfield != "") {
    marker.bindTooltip(locationfield, {
      className: 'tooltipclass'
    }).openTooltip();
  }
  locationArray.push(marker.getLatLng());
  locationht.setItem(locationfield, locationTableIndex);
  locationTableIndex += 1;
  console.log(marker.toGeoJSON()); 
	localStorage.setItem(locationTableIndex, JSON.stringify(marker.toGeoJSON()));
	localStorage.setItem('locationCount', locationTableIndex+1);
  localStorage.setItem(('tooltipNumber'+locationTableIndex), locationfield);
	console.log(localStorage.getItem(locationTableIndex));
	console.log(localStorage.getItem('locationCount'));
  console.log(localStorage.getItem('tooltipNumber'+locationTableIndex));
}

function plotOnClick() {
  mymap.on('click', function(event) {
    marker = L.marker(event.latlng, {
      draggable: true,
      riseOnHover: true
    }).addTo(mymap);
    let locationfield = document.getElementById("locationfield").value;
	locationArray.push(marker.getLatLng());
	locationht.setItem(locationfield, locationTableIndex);
	locationTableIndex += 1;
    if (locationfield != "") {
      marker.bindTooltip(locationfield, {
        className: 'tooltipclass'
      }).openTooltip();
    }
    mymap.removeEventListener("click");
  console.log(marker.toGeoJSON());
	localStorage.setItem(locationTableIndex, JSON.stringify(marker.toGeoJSON()));
	localStorage.setItem('locationCount', locationTableIndex+1);
  localStorage.setItem(('tooltipNumber'+locationTableIndex), locationfield);
	console.log(localStorage.getItem(locationTableIndex));
	console.log(localStorage.getItem('locationCount'));
  console.log(localStorage.getItem('tooltipNumber'+locationTableIndex));
  });
}

function popupLocationSearch() {
	var locationkey = prompt("Search location: ");
	var locationIn = locationht.getItem(locationkey);
	mymap.setView(locationArray[locationIn], 15);
}

function locationSearch() {
	var locationkey = document.getElementById("locationfield4").value;
	var locationIn = locationht.getItem(locationkey);
	mymap.setView(locationArray[locationIn], 15);
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
		if(clickstate === 0) {
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
				}
				else if (drawstate === 1) {
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
		}
		else if (clickstate === 1) {
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

function linearRuler () {
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
    if (point1 === undefined) {
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
	if (document.getElementById('switchinput').checked === true) {
		startFreeForm();
	}
	else {
		linearRuler();
	}
}

function removeAllLayers() {
  mymap.eachLayer(function(layer) {
    if (layer._url != currentMapURL) {
      mymap.removeLayer(layer);
    }
  });
}

function clearLocalData() {
	localStorage.clear();
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

function toMapbox () {
	mymap.removeLayer(osm);
  mymap.removeLayer(OpenTopoMap);
  mymap.removeLayer(googleHybrid);
  mymap.removeLayer(googleStreets);
  mapboxLayer.addTo(mymap);
  currentMapURL = mapboxLayerURL;
}

function toOSM () {
	mymap.removeLayer(mapboxLayer);
  mymap.removeLayer(OpenTopoMap);
  mymap.removeLayer(googleHybrid);
  mymap.removeLayer(googleStreets);
  currentMapURL = osmLayer;
	osm.addTo(mymap);
}

function toTopo () {
	mymap.removeLayer(osm);
  mymap.removeLayer(mapboxLayer);
  mymap.removeLayer(googleHybrid);
  mymap.removeLayer(googleStreets);
  currentMapURL = topoLayer;
	OpenTopoMap.addTo(mymap);
}

function toSatellite () {
  mymap.removeLayer(osm);
	mymap.removeLayer(mapboxLayer);
  mymap.removeLayer(OpenTopoMap);
  mymap.removeLayer(googleStreets);
  currentMapURL = satelliteLayer;
  googleHybrid.addTo(mymap);
}

function toGoogleMaps() {
  mymap.removeLayer(osm);
	mymap.removeLayer(mapboxLayer);
  mymap.removeLayer(OpenTopoMap);
  mymap.removeLayer(googleHybrid);
  currentMapURL = googleLayer;
  googleStreets.addTo(mymap);
}
