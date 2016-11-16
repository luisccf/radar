var markers = [];
var origin, destination;

function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.0093, lng: -118.4974},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({map: map});
    
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    $('#add-location').click(function() {
        var places = searchBox.getPlaces();
        if (places == undefined || places.length == 0) {
            $('#pac-input').addClass('error');
            return;
        }
        $('#pac-input').removeClass('error');
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        var place = places[0];
        // Create a marker for each place.
        markers.push(new google.maps.Marker({
            map: map,
            title: place.formatted_address,
            position: place.geometry.location
        }));
        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        map.fitBounds(bounds);

        // Draw new direction
        destination = $('#pac-input').val();
        if (markers.length > 1) {
            calculateAndDisplayRoute(directionsDisplay, directionsService, markers, map);
        } else {
            addLocationToList(place.formatted_address);
            origin = $('#pac-input').val();
        }
        $('#pac-input').val('');
    });

    $('#clear-map').click(function() {
        swal(
        {
            title: 'Você tem certeza disso?',
            text: 'Ctrl-z não foi implementado!',
            type: 'warning',
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#d9534f',
            confirmButtonText: 'Limpa logo',
        },
        function() {
            // Clear markers and directions
            if (markers.length > 1) {
                directionsDisplay.setMap(null);
                directionsDisplay = new google.maps.DirectionsRenderer({map: map});
            } else if (markers.length == 1) {
                markers[0].setMap(null);
            }
            markers = [];
            // Update page content
            $('#locations > ul').empty();
            $('#pac-input').val();
            $('#locations > p').fadeIn();
        });
    });

}

function calculateAndDisplayRoute(directionsDisplay, directionsService, markers, map) {
    var waypoints = [];
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markers.length; i++) {
        // Hide all markers
        markers[i].setMap(null);
        // Define waypoints (markers between origin and destination)
        if (i && i != markers.length - 1) {
            waypoints.push({
                location: new google.maps.LatLng(
                    markers[i].position.lat(), markers[i].position.lng()
                ),
                stopover: true
            });
        }
        // Define map bounds for fitting all markers
        bounds.extend(markers[i].position);
    }

    // Retrieve the start and end locations and create a DirectionsRequest
    directionsService.route(
        {
            origin: origin,
            destination: destination,
            waypoints: waypoints,
            travelMode: google.maps.TravelMode.DRIVING
        }, 
        function(response, status) {
            // Route the directions and pass the response to a function to create markers for each step.
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                addLocationToList(markers[markers.length-1].title);
            } else {
                markers.pop();
                swal({
                    title: 'Erro',
                    type: 'error',
                    text: 'Não é possível criar uma rota entre os locais definidos.'
                });
                console.log(status);
            }
        }
    );

    // Fit all markers in map
    map.fitBounds(bounds);   
}

function addLocationToList(name) {
    var location = $($.parseHTML('<li>'));
    location
        .addClass('list-group-item')
        .html(name)
        .hide();
    $('#locations > p').fadeOut();
    $('#locations > ul').append(location);
    location.fadeIn();
}

$(function() {
    var user_id = window.location.href.split('?user=')[1];
    if (user_id === undefined) {
        user_id = 1;
    }

    $('#add-route').click(function() {
        $(this).prop('disabled', true);
        $('body').css('cursor', 'wait');
        if (markers.length < 2) {
            swal({
                title: 'Erro!',
                text: 'Para traçar uma rota, você deve escolher no mínimo dois locais.',
                type: 'error'
            });
            $(this).prop('disabled', false);
        } else {
            var route = [];
            for (var i = 0; i < markers.length; i++) {
                var location = {
                    'latitude': markers[i].position.lat(),
                    'longitude': markers[i].position.lng(),
                    'user': {'id': 1},
                    'name': markers[i].title,
                };
                route.push(location);
            }
            $.ajax({
                type: 'POST',
                url: '/createroute',
                data: JSON.stringify(route),
                success: function(result) {
                    console.log(result);
                    swal({
                        title: 'Sucesso!',
                        text: 'Sua rota foi adicionada.',
                        type: 'success'
                    }, function() {
                        window.location.href = '/incidents';
                    });
                },
                error: function(e) {
                    swal({
                        title: 'Erro!',
                        text: 'Ocorreu um erro ao adicionar sua rota.',
                        type: 'error'
                    });
                    console.log(e);
                },
                complete: function() {
                    $(this).prop('disabled', false);
                    $('body').css('cursor', 'auto');
                }
            });
        }
        return false;
    })

});
