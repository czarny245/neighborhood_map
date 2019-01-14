var map;

var CLIENT_ID = "WYJ23K5PKH2RCV1UCESCNSPPO3UAQJHSWHORAP2AAYTEQAJA";
var CLIENT_SECRET = "YNMGAPQW4ZADXENOYO5T2XLZDFKJYLTHTUOEU102BO13ZDLJ";

var places = [
    {
    name: "PadelClub London",
    lat: 51.502765787443316,
    lng: -0.011341527993155728,
    id: "4f86c408e4b02b999bba04b7"
    },
    {
    name: "Tower Hamlets Tennis Court",
    lat: 51.54022455242505,
    lng: -0.03371760529630305,
    id: "51e249bc498e74d13a39d410"
    },
    {
    name: "Poplar Park Tennis Courts",
    lat: 51.51037908256234,
    lng: -0.01704836039394682,
    id: "54437af8498edf77dad86c02"
    },
    {
    name: "Southwark Park",
    lat: 51.49498975352677,
    lng: -0.0565382708983765,
    id: "4b5f5f31f964a5209eb629e3"
    },
    {
    name: "tennis court @ king edward memorial park",
    lat: 51.50869139968924,
    lng: -0.04926191262009084,
    id: "5210d64d11d25708a006651c"
    },
    {
    name: "Mellish Fields Community Sports Ground",
    lat: 51.5026180102039,
    lng: -0.042106579792284514,
    id: "508e7970e4b040090bbe8cc8"
    }
];
/////////////////////////////////////////////////////////////////////////
function initMap() {
    mapElement = $("#map")
    map = new google.maps.Map(mapElement[0], {
        center: {lat: 51.516569, lng: -0.023806},
        zoom: 14,
    });
    ko.applyBindings(new ViewModel());
}
/////////////////////////////////////////////////////////////////////////
var Place = function(data) {
    this.name = ko.observable(data.name);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    this.id = ko.observable(data.id);
    this.visible = ko.observable(true);
    this.address = ko.observable('');
    this.postalCode = ko.observable('');
    this.contact = ko.observable('');
    this.image = ko.observable('');
    this.url = ko.observable('');


    // In the above example, the marker is placed on the map at construction
    // of the marker using the map property in the marker options. 
    // Alternatively, you can add the marker to the map directly by 
    // using the marker's setMap() method.
//   var marker = new google.maps.Marker({
//        map: map,
//        title: this.name(),
//        position: new google.maps.LatLng(this.lat(), this.lng()),
//        animation: google.maps.Animation.DROP
//    });
//    this.marker = marker;
//
//    // Initialize the infowindow
//    var infoWindow = new google.maps.InfoWindow({
//        maxWidth: 200,
//    });
//    this.infoWindow = infoWindow;
}
/////////////////////////////////////////////////////////////////////////
var ViewModel = function() {
    var self = this;

    this.placesList = ko.observableArray([]);

    //initialSearch();
    //showMarkers();

    places.forEach(function(placeItem){
        self.placesList.push(new Place(placeItem));
    });

    // Initialize the infowindow
    var infoWindow = new google.maps.InfoWindow({
    });
    

    self.placesList().forEach(function(placeItem) {
            var marker = new google.maps.Marker({
                map: map,
                title: placeItem.name(),
                position: new google.maps.LatLng(placeItem.lat(), placeItem.lng()),
                id: placeItem.id(),
                animation: google.maps.Animation.DROP
            });

            // ajax call

            // working
            //fetch('https://api.foursquare.com/v2/venues/'+placeItem.id()+'?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20180323');
            var url = 'https://api.foursquare.com/v2/venues/'+placeItem.id()+'?client_id='+CLIENT_ID+'&client_secret='+CLIENT_SECRET+'&v=20180323'
            $.ajax({
                url: url,
                dataType: "json",
                success: function(data) {
                    console.log(data);
                    console.log(data.response.venue.location.address);
                    console.log(data.response.venue.location.postalCode);
                    console.log(data.response.venue.bestPhoto.prefix);
                    console.log(data.response.venue.bestPhoto.suffix);
                    console.log(data.response.venue.contact.phone);
                    console.log(data.response.venue.canonicalUrl);

                    // TODO: incorporate information retrieved from foresquare into the objects

                    placeItem.address(data.response.venue.location.address);
                    console.log(placeItem.address()+"success");
                    placeItem.postalCode(data.response.venue.location.postalCode);
                    console.log(placeItem.postalCode()+'success');
                    placeItem.image(data.response.venue.bestPhoto.prefix + "300x300" + data.response.venue.bestPhoto.suffix);
                    console.log(placeItem.image()+ 'success');
                    placeItem.contact(data.response.venue.contact.phone);
                    console.log(placeItem.contact() + 'success');
                    placeItem.url(data.response.venue.canonicalUrl);
                    console.log(placeItem.url()+'success');
                }
            });
            // end of ajax call

            var infoStr = '<h3>'+placeItem.name()+'</h3>'+
                '<p>'+placeItem.address()+'</p>'+
                '<p>'+placeItem.postalCode()+'</p>'+
                '<p>'+placeItem.contact()+'</p>'
                '<img src="'+placeItem.image()+'" alt="image">'
                '<a href="'+placeItem.url()+'"></a>'

            marker.addListener("click", function() {



                infoWindow.open(map, marker);
                infoWindow.setContent(infoStr);
            });


            placeItem.marker = marker;

            
    });
    self.query = ko.observable('');

    self.filter = function() {
        console.log("function active "+ self.query());
        self.placesList().forEach(function (placeItem) {
            placeItem.visible(false);
            placeItem.marker.setMap(null);
        });
        for (i = 0; i < self.placesList().length; i++) {
            //placesItem = self.placesList[i]
            var input = self.query().toLowerCase();
            //console.log("sorting in progres...")
            if (self.placesList()[i].name().toLowerCase().indexOf(input) !== -1) {
                //console.log(i+self.placesList()[i].name())
                self.placesList()[i].visible(true);
                self.placesList()[i].marker.setMap(map);
            }
        }
    }
}