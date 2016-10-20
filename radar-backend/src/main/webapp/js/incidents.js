var map,
    markers = [],
    infowindows = [],
    incidents = [];

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.0093, lng: -118.4974},
        zoom: 8,
        maxZoom: 12,
        streetViewControl: false
    });

    // Loads map on user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        });
    }
    getIncidents();
}

var getIncidents = function() {
    $.ajax({
        url: '/getincidents',
        success: function(items) {
            // Gets incidents and creates their markers and infowindows
            $.each(items, function(i, item) {
                incidents[item.id] = item;
                var marker = createMarker(item);
                markers[item.id] = marker
                infowindows[item.id] = createInfowindow(item, marker);
                marker.addListener('click', function() {
                    infowindows[item.id].open(map, marker);
                });
            });
        },
        error: function(e) {
            console.log(e);
        }
    });
}

var createMarker = function(incident) {
    var marker = new google.maps.Marker({
        position: {
            lat: incident.latitude, 
            lng: incident.longitude
        },
        map: map
    });
    return marker;
}

var createInfowindow = function(incident, marker) {
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
    var blockquote = $('');
    if (description) {
        blockquote = $('<blockquote></blockquote>');
        $('<p>' + description + '</p>').appendTo(blockquote);
        $('<footer>' + footer + '</footer>').appendTo(blockquote);
    }
    // Generates infowindow content using a template
    var template = $('#info-window-template').html();
    // var location = {lat: marker.position.lat(), lng: marker.position.lng()};
    // var formatted_address = [location.lat, location.lng].join(', ');
    // var geocoder = new google.maps.Geocoder;
    // geocoder.geocode({'location': location}, function(results, status) {
    //     if (status === google.maps.GeocoderStatus.OK) {
    //         if (results[1]) {
    // formatted_address = results[1].formatted_address;
    Mustache.parse(template);
    var rendered = Mustache.render(
        template, 
        {
            // formatted_address: formatted_address,
            num_criminals: num_criminals ? num_criminals : '',
            num_victims: num_victims ? num_victims : '',
            criminals_transport: criminals_transport ? criminals_transport : '',
            victims_transport: victims_transport ? victims_transport : '',
            violence: violence ? violence : '',
            blockquote: blockquote.prop('outerHTML'),
            objects_taken: objects_taken ? objects_taken : '',
        }
    );
    $('#info-window-body').html(rendered);
    return new google.maps.InfoWindow({
        content: $('#info-window-body').html()
    });
        //     } else console.log(status);
        // } else console.log(status);
}
