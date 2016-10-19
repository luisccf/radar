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

var loadOptions = function(select, items) {
    $.each(items, function (i, item) {
        select.append($('<option>', { 
            value: item.id,
            text : item.name 
        }));
    });
}

$(function() {

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
        var incident = {
            'latitude': $('input[name=lat]').val(),
            'longitude': $('input[name=lng]').val(),
            'date': $('input[name=date]').val(),
            'description': $('input[name=description]').val(),
            'num_criminals': $('input[name=num_criminals]').val(),
            'armed': $('input[name=armed]:checked').val(),
            'victims_transport': {'id': $('select[name=victims_transport]').val()},
            'criminals_transport': {'id': $('select[name=criminals_transport]').val()},
            'violence': $('input[name=violence]:checked').val(),
            'num_victims': $('input[name=num_victims]').val(),
            'police_report': $('input[name=police_report]').val(),
            'objects_taken': $('input[name=objects_taken]').val(),
            'user': {'id': 1}
        };
        $.ajax({
            type: 'POST',
            url: '/createincident',
            data: JSON.stringify(incident),
            success: function(d) {
                window.location.href = '/incidents';
            },
            error: function(e) {
                console.log(e);
            }
        })
        return false;
    });
});
