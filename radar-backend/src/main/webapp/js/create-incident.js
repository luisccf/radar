function initAutocomplete() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.0093, lng: -118.4974},
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        var place = places[0];
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
        map.fitBounds(bounds);
        $('input[name=location]').val(place.formatted_address);
        $('input[name=lat]').val(place.geometry.location.lat());
        $('input[name=lng]').val(place.geometry.location.lng());
    });
}

$(function() {
    var user_id = window.location.href.split('?user=')[1];
    if (user_id === undefined) {
        user_id = 1;
    } 

    $('input[name=date]').prop('max', function(){
        return new Date().toJSON().split('T')[0];
    });

    $.ajax({
        url: '/gettransports',
        success: function(transports) {
            loadOptions($('select[name=criminals_transport]'), transports);
            loadOptions($('select[name=victims_transport]'), transports);
        },
        error: function(e) {
            console.log(e);
        }
    });

    $('form').submit(function() {
        var user_id = window.location.href.split('?user=')[1];
        if (user_id === undefined) {
            user_id = 1;
        }
        var date = new Date($('input[name=date]').val() + 'T' + $('input[name=time]').val() + ':00Z');
        var incident = {
            'latitude': $('input[name=lat]').val(),
            'longitude': $('input[name=lng]').val(),
            'location': $('input[name=location]').val(),
            'date': date,
            'description': $('textarea[name=description]').val(),
            'num_criminals': $('input[name=num_criminals]').val(),
            'armed': $('input[name=armed]:checked').val() === undefined ? -1 : $('input[name=armed]:checked').val(),
            'victims_transport': {'id': $('select[name=victims_transport]').val()},
            'criminals_transport': {'id': $('select[name=criminals_transport]').val()},
            'violence': $('input[name=violence]:checked').val(),
            'num_victims': $('input[name=num_victims]').val(),
            'police_report': $('input[name=police_report]').val(),
            'objects_taken': $('input[name=objects_taken]').val(),
            'user': {'id': user_id}
        };
        $('form > button[type=submit]').prop('disabled', true);
        $('body').css('cursor', 'wait');
        $.ajax({
            type: 'POST',
            url: '/createincident',
            data: JSON.stringify(incident),
            success: function(d) {
                console.log(d);
                swal({
                    type: 'success',
                    title: 'Sucesso',
                    text: 'Sua ocorrência foi criada.'
                }, function() {
                    window.location.href = '/incidents';
                });
            },
            error: function(e) {
                console.log(e);
                swal({
                    type: 'error',
                    title: 'Erro',
                    text: 'Ocorreu um erro ao criar sua ocorrência.'
                });
            },
            complete: function() {
                $('body').css('cursor', 'auto');
            }
        })
        return false;
    });
});
