var map,
    markers = [],
    infoWindows = [],
    incidents = [];

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.0093, lng: -118.4974},
        zoom: 8,
        maxZoom: 12,
        streetViewControl: false
    });

    // if (navigator.geolocation) {
    //     navigator.geolocation.getCurrentPosition(function(position) {
    //         var pos = {
    //             lat: position.coords.latitude,
    //             lng: position.coords.longitude
    //         };
    //         map.setCenter(pos);
    //     });
    // }
    getIncidents();
}

var getIncidents = function() {
    $.ajax({
        url: '/getincidents',
    })
    .done(function(data) {
        incidents = data;
        loadMarkers(data);
    })
    .fail(function(e) {
        console.log(e);
    });
}

var loadMarkers = function(incidents) {
    for (var i = 0; i < incidents.length; i++) {
        var marker = new google.maps.Marker({
            position: {
                lat: parseFloat(incidents[i].latitude), 
                lng: parseFloat(incidents[i].longitude)
            },
            map: map
        });
        marker.setValues({id: incidents[i].id});
        markers.push(marker);
        createInfoWindow(incidents[i], marker);
        marker.addListener('click', function() {
            for (var j = 0; j < incidents.length; j++) {
                if (incidents[j].id == this.get('id')) {
                    for (var k = 0; k < infoWindows.length; k++) {
                        if (this.get('id') == infoWindows[k].get('id')) {
                            infoWindows[k].open(map, this);
                        } else {
                            infoWindows[k].close();
                        }
                    }
                }
            }
        });
    }
}

var createInfoWindow = function(incident, marker) {
    var num_criminals = '',
        num_victims = '',
        victims_transport = '',
        criminals_transport = '',
        objects_taken = incident.objects_taken ? incident.objects_taken : '';
        violence = incident.violence == 1 ? 'Houve violência' : 'Não houve violência',
        description = incident.description;
    if (incident.num_criminals > 1) {
        num_criminals += incident.num_criminals + ' assaltantes';
        criminals_transport = 'Os assaltantes estavam ' + incident.criminals_transport.name;
    } else {
        num_criminals += '' + incident.num_criminals + ' assaltante';
        criminals_transport = 'O assaltante estava ' + incident.criminals_transport.name;
    }
    if (incident.num_victims > 1) {
        num_victims += '' + incident.num_victims + ' vítimas';
        victims_transport = 'As vítimas estavam ' + incident.victims_transport.name;
    } else {
        num_victims += incident.num_victims + ' vítima';
        victims_transport = 'A vítima estava ' + incident.victims_transport.name;
    }
    var date = new Date(incident.date)
    var footer = incident.user.username + ', ' 
        + date.getDate()
        + ' de ' + getMonth(date.getMonth())
        + ' de ' + date.getFullYear();
    var template = $('#info-window-template').html();
    var location = {lat: marker.position.lat(), lng: marker.position.lng()};
    var formatted_address = [location.lat, location.lng].join(', ');
    var geocoder = new google.maps.Geocoder;
    exec = true;
    geocoder.geocode({'location': location}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                formatted_address = results[1].formatted_address;
                Mustache.parse(template);
                var rendered = Mustache.render(
                    template, 
                    {
                        formatted_address: formatted_address,
                        num_criminals: num_criminals ? num_criminals : '',
                        num_victims: num_victims ? num_victims : '',
                        criminals_transport: criminals_transport ? criminals_transport : '',
                        victims_transport: victims_transport ? victims_transport : '',
                        violence: violence ? violence : '',
                        description: description ? description : '',
                        objects_taken: objects_taken ? objects_taken : '',
                        footer: footer
                    }
                );
                $('#info-window-body').html(rendered);
                var infowindow = new google.maps.InfoWindow({
                    content: $('#info-window-body').html()
                });
                infowindow.setValues({id: marker.get('id')});
                infoWindows.push(infowindow);
            }
        }
    });
}
