var mymap = L.map('mapid').setView([47.5301, -122.0326], 13);
var mapClickState = 0;
var linestate, linestate2;
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mymap);
var freeFormState = 1;
var locationArray = [L.latLng(47.5301, -122.0326), L.latLng(47.6163, -122.0356)];
var locationTableIndex = 2; //There are 2 items in the array already.

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
var locationht = new HashTable({"issaquah": 0, "sammamish": 1});
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
	}
	else {
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
