/**
 * Created by sunzhihao on 18/3/16.
 */

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


function initMap($rootScope, callback) {
    /**
     * 0 for all
     * 1 for accident
     * 2 for fire
     * 3 for gas
     * 4 for riot
     */
    $rootScope.mapFilter = 0;
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
                callback($rootScope);
            }

        }
    }, 600);
}

function resetMarkers($rootScope) {
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

        var incidentList = $rootScope.incidents;

        for (var i = 0; i < incidentList.length; i++) {
            var incident = incidentList[i];
            if ($rootScope.isPublic && incident.incident_status == 'initiated') {
                continue;
            }
            var marker = new google.maps.Marker({
                position: {lat: parseFloat(incident.incident_latitude), lng: parseFloat(incident.incident_longitude)},
                title: incident.incident_type,
                icon: 'images/' + incident.incident_type + '-pin' + '.png'
            });

            marker.incident = incident;

            switch (incident.incident_type) {
                case "accident":
                    incidents.accident.push(incident);
                    incidentMarkers.accident.push(marker);
                    break;
                case "fire":
                    incidents.fire.push(incident);
                    incidentMarkers.fire.push(marker);
                    break;
                case "gas_leak":
                    incidents.gas.push(incident);
                    incidentMarkers.gas.push(marker);
                    break;
                case "riot":
                    incidents.riot.push(incident);
                    incidentMarkers.riot.push(marker);
                    break;
            }

            marker.setMap(map);

            google.maps.event.addListener(marker, "click", function (event) {
                $rootScope.openMapModal(this.incident.incident_id);
            });
        }

        var toggleMarkers = function (list, show) {
            for (var i = 0; i < list.length; i++) {
                list[i].setMap(show ? map : null);
            }
        };

        $("div#map-label-all").click(function () {
            $rootScope.mapFilter = 0;
            toggleMarkers(incidentMarkers.accident, true);
            toggleMarkers(incidentMarkers.fire, true);
            toggleMarkers(incidentMarkers.gas, true);
            toggleMarkers(incidentMarkers.riot, true);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        });

        $("div#map-label-accident").click(function () {
            $rootScope.mapFilter = 1;
            toggleMarkers(incidentMarkers.accident, true);
            toggleMarkers(incidentMarkers.fire, false);
            toggleMarkers(incidentMarkers.gas, false);
            toggleMarkers(incidentMarkers.riot, false);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("div.map-label-number").text(incidents.accident.length);

        $("div#map-label-fire").click(function () {
            $rootScope.mapFilter = 2;
            toggleMarkers(incidentMarkers.accident, false);
            toggleMarkers(incidentMarkers.fire, true);
            toggleMarkers(incidentMarkers.gas, false);
            toggleMarkers(incidentMarkers.riot, false);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("div.map-label-number").text(incidents.fire.length);

        $("div#map-label-gas").click(function () {
            $rootScope.mapFilter = 3;
            toggleMarkers(incidentMarkers.accident, false);
            toggleMarkers(incidentMarkers.fire, false);
            toggleMarkers(incidentMarkers.gas, true);
            toggleMarkers(incidentMarkers.riot, false);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("div.map-label-number").text(incidents.gas.length);

        $("div#map-label-riot").click(function () {
            $rootScope.mapFilter = 4;
            toggleMarkers(incidentMarkers.accident, false);
            toggleMarkers(incidentMarkers.fire, false);
            toggleMarkers(incidentMarkers.gas, false);
            toggleMarkers(incidentMarkers.riot, true);
            $("div.map-label").removeClass("active");
            $(this).addClass("active");
        }).find("div.map-label-number").text(incidents.riot.length);

        switch ($rootScope.mapFilter) {
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