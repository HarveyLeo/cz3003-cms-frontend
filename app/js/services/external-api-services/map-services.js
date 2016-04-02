
var map;
var incidents = {
    accident: [],
    fire: [],
    gas: [],
    riot: []
};
var incidentMarkers = {
    accident: [],
    fire: [],
    gas: [],
    riot: []
};


function initMap($scope, callback) {
    /**
     * 0 for all
     * 1 for accident
     * 2 for fire
     * 3 for gas
     * 4 for riot
     */
    $scope.mapFilter = 0;
    setTimeout(function () {
        var container = document.getElementById('crisis-google-map');

        if (container != null) {
            map = new google.maps.Map(container,
                {
                    center: {lat: 1.359907, lng: 103.816726},
                    zoom: 11,
                    disableDefaultUI: true,
                    minZoom: 11
                });

            setTimeout(function() {
                // bounds of the desired area
                var allowedBounds = map.getBounds();
                var lastValidCenter = map.getCenter();

                google.maps.event.addListener(map, 'center_changed', function() {
                    if (allowedBounds.contains(map.getCenter())) {
                        // still within valid bounds, so save the last valid position
                        lastValidCenter = map.getCenter();
                        return;
                    }

                    // not valid anymore => return to last valid position
                    map.panTo(lastValidCenter);
                });


            }, 300);

            if (callback) {
                callback($scope);
            }

        }
    }, 600);
}

function resetMarkers($scope, responseData) {
    var container = document.getElementById('crisis-google-map');

    if (container != null) {
        // Clear global lists
        incidents = {
            accident: [],
            fire: [],
            gas: [],
            riot: []
        };

        for (var i = 0; i < incidentMarkers.accident.length; i++) {
            incidentMarkers.accident[i].setMap(null);
        }
        for (var i = 0; i < incidentMarkers.fire.length; i++) {
            incidentMarkers.fire[i].setMap(null);
        }
        for (var i = 0; i < incidentMarkers.gas.length; i++) {
            incidentMarkers.gas[i].setMap(null);
        }
        for (var i = 0; i < incidentMarkers.riot.length; i++) {
            incidentMarkers.riot[i].setMap(null);
        }


        incidentMarkers = {
            accident: [],
            fire: [],
            gas: [],
            riot: []
        };

        var incidentList = responseData;

        for (var i = 0; i < responseData.length; i++) {
            var incident = responseData[i];
            //console.log(incident);
            if ($scope.isPublic && incident.incident_status == 'initiated') {
                continue;
            }
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(incident.incident_latitude), lng: parseFloat(incident.incident_longitude)},
                title: incident.incident_id,
                icon: 'images/' + incident.incident_type + '-pin' + '.png'
            });

            marker.incident = incident;

            switch (incident.incident_type) {
                case "Traffic Accident":
                    incidents.accident.push(incident);
                    incidentMarkers.accident.push(marker);
                    break;
                case "Fire":
                    incidents.fire.push(incident);
                    incidentMarkers.fire.push(marker);
                    break;
                case "Gas Leak":
                    incidents.gas.push(incident);
                    incidentMarkers.gas.push(marker);
                    break;
                case "Riot":
                    incidents.riot.push(incident);
                    incidentMarkers.riot.push(marker);
                    break;
            }

            marker.setMap(map);

            marker.addListener("click", function (event) {
                var latLng = event.latLng;

                console.log(latLng.lat().toFixed(4));

                for (var j = 0 ;j<responseData.length;j++){
                    if(parseFloat(responseData[j].incident_latitude).toFixed(4) == latLng.lat().toFixed(4) && parseFloat(responseData[j].incident_longitude).toFixed(4) == latLng.lng().toFixed(4)){
                        $scope.openMapModal(responseData[j]);
                        break;
                    }

                }
            });
        }

        var toggleMarkers = function (list, show) {
            for (var i = 0; i < list.length; i++) {
                list[i].setMap(show ? map : null);
            }
        };

        $("div #map-label-all").click(function () {
            $scope.mapFilter = 0;
            toggleMarkers(incidentMarkers.accident, true);
            toggleMarkers(incidentMarkers.fire, true);
            toggleMarkers(incidentMarkers.gas, true);
            toggleMarkers(incidentMarkers.riot, true);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        });

        $("div #map-label-accident").click(function () {
            $scope.mapFilter = 1;
            toggleMarkers(incidentMarkers.accident, true);
            toggleMarkers(incidentMarkers.fire, false);
            toggleMarkers(incidentMarkers.gas, false);
            toggleMarkers(incidentMarkers.riot, false);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("span.map-label-number").text(incidents.accident.length);

        $("div #map-label-fire").click(function () {
            $scope.mapFilter = 2;
            toggleMarkers(incidentMarkers.accident, false);
            toggleMarkers(incidentMarkers.fire, true);
            toggleMarkers(incidentMarkers.gas, false);
            toggleMarkers(incidentMarkers.riot, false);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("span.map-label-number").text(incidents.fire.length);

        $("div #map-label-gas").click(function () {
            $scope.mapFilter = 3;
            toggleMarkers(incidentMarkers.accident, false);
            toggleMarkers(incidentMarkers.fire, false);
            toggleMarkers(incidentMarkers.gas, true);
            toggleMarkers(incidentMarkers.riot, false);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("span.map-label-number").text(incidents.gas.length);

        $("div #map-label-riot").click(function () {
            $scope.mapFilter = 4;
            toggleMarkers(incidentMarkers.accident, false);
            toggleMarkers(incidentMarkers.fire, false);
            toggleMarkers(incidentMarkers.gas, false);
            toggleMarkers(incidentMarkers.riot, true);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("span.map-label-number").text(incidents.riot.length);

        switch ($scope.mapFilter) {
            case 0: // all
                $("div#map-label-all").click();
                break;
            case 1: // fire
                $("div#map-label-accident").click();
                break;
            case 2:
                $("div#map-label-fire").click();
                break;
            case 3:
                $("div#map-label-gas").click();
                break;
            case 4:
                $("div#map-label-riot").click();

        }
    }
}

function initMapSelector() {
    setTimeout(function() {
        container = document.getElementById('location-selector-google-map');

        if (container != null) {
            map = new google.maps.Map(container,
                {
                    center: {lat: 1.359907, lng: 103.816726},
                    zoom: 11,
                    disableDefaultUI: true,
                    minZoom: 11
                });

            setTimeout(function() {
                // bounds of the desired area
                var allowedBounds = map.getBounds();
                var lastValidCenter = map.getCenter();

                google.maps.event.addListener(map, 'center_changed', function() {
                    if (allowedBounds.contains(map.getCenter())) {
                        // still within valid bounds, so save the last valid position
                        lastValidCenter = map.getCenter();
                        return;
                    }

                    // not valid anymore => return to last valid position
                    map.panTo(lastValidCenter);
                });
            }, 300);
        }
    }, 600);
}

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 1.349627, lng: 103.863029},
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Create the search box and link it to the UI element.
    var input = document.getElementById('location');
    var searchBox = new google.maps.places.SearchBox(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        console.log(places);

        var longitude = places[0].geometry.location.lng();
        var latitude = places[0].geometry.location.lat();

        $("#location").data("latitude", latitude);
        $("#location").data("longitude", longitude);
        $("#location").data("address", places[0].formatted_address);

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        map.setZoom(17);
    });
}