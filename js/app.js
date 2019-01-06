

var map;

var examplePlace = [
    {
    name: "Moore House",
    lat: 51.526319,
    lng: -0.053117,
    id: ""
    }
];

function initMap() {
    mapElement = $("#map")
    map = new google.maps.Map(mapElement[0], {
        center: {lat: 51.516569, lng: -0.023806},
        zoom: 14,
    });
    ko.applyBindings(new ViewModel());
}

var ViewModel = function() {
    var self = this;

    this.markers = ko.observableArray([]);
    this.examplePlaces = ko.observableArray([]);

    //initialSearch();
    //showMarkers();
    examplePlace.forEach(function(placeItem){
        self.examplePlaces.push(placeItem)
    });
    //this.examplePlaces.push(examplePlace)
    
    // Initialize the infowindow
    var infowindow = new google.maps.InfoWindow({
        maxWidth: 200,
    });
    // Initialize marker
    var marker;

    

    self.examplePlaces().forEach(function(placeItem) {
            marker = new google.maps.Marker({
                map: map,
                title: placeItem.name,
                position: new google.maps.LatLng(placeItem.lat, placeItem.lng),
                id: placeItem.place_id,
                animation: google.maps.Animation.DROP
            });
            placeItem.marker = marker;
    });

    self.initialSearch = function() {
        var bounds = map.getBounds();
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
            query: "tennis court",
            bounds: bounds,
            location: {lat: 51.516569, lng: -0.023806},
            radius: 3500
        }, function(results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                self.createMarkers(results);
            }        
        });
        showMarkers();
    }
    this.createMarkers = function(results) {
        for (var i = 0; i < results.lenght; i++) {
            var place = results[i];
            var icon = {
                url: place.icon,
                size: new google.maps.Size(35, 35),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(15, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            var marker = new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location,
                id: place.place_id
            });
            // TODO: infowindow for each marker
            self.markers.push(marker);
        }

    }
    self.showMarkers = function() {
        for (var i = 0; i < self.markers.lenght; i++) {
            markers[i].setMap(map);
        }
    }
}