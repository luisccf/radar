var map,
    markers = [],
    infowindows = [],
    incidents = [];

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.0093, lng: -118.4974},
        zoom: 5,
        maxZoom: 12,
        streetViewControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
        }
    });

    // Adds filter button
    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);

    // Adds search bar
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
          return;
        }
        var bounds = new google.maps.LatLngBounds();
        var place = places[0];
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

    // Loads map on user's current location
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
        success: function(items) {
            // Gets incidents and creates their markers and infowindows
            $.each(items, function(i, item) {
                incidents[item.id] = item;
                var marker = createMarker(item);
                markers[item.id] = marker;
                infowindows[item.id] = createInfowindow(item, marker);
                marker.addListener('click', function() {
                    // Closes opened infowindow
                    $.each(incidents, function(i) {
                        if (incidents[i] != undefined)
                            infowindows[incidents[i].id].close();
                    })
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
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
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
    var date = new Date(incident.date);
    var formatted_date = [date.getDate(), date.getMonth(), date.getFullYear()].join('/') 
        + ' ' + [date.getHours(), date.getMinutes() ? date.getMinutes() : '00'].join(':');
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
    Mustache.parse(template);
    var rendered = Mustache.render(
        template, 
        {
            formatted_date: formatted_date,
            formatted_address: incident.location,
            num_criminals: num_criminals ? num_criminals : '',
            num_victims: num_victims ? num_victims : '',
            criminals_transport: criminals_transport ? criminals_transport : '',
            victims_transport: victims_transport ? victims_transport : '',
            violence: violence ? violence : '',
            blockquote: blockquote.prop('outerHTML'),
            objects_taken: objects_taken ? objects_taken : 'Nada'
        }
    );

    $('#info-window-body').html(rendered);

    // Calculates reliability and creates star widget
    var reliability = incident.reliability;
    for (var i = 0; i < reliability; i++) {
        $('#reliability').append('<i class="fa fa-star"></i>');
    }
    for (var i = reliability; i < 5; i++) {
        $('#reliability').append('<i class="fa fa-star-o"></i>');
    }
    $('#reliability').append(' ' + 20 * reliability + '%');

    return new google.maps.InfoWindow({
        content: $('#info-window-body').html()
    });
}

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Clique para filtrar ocorrências';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '38px';
  controlText.style.paddingLeft = '5px';
  controlText.style.paddingRight = '5px';
  controlText.innerHTML = 'Filtrar ocorrências';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  $(controlUI)
    .attr('data-toggle', 'modal')
    .attr('data-target', '#filter-window');
  controlUI.addEventListener('click', function() {
  });

}

$(function() {
    $.ajax({
        url: '/getgenders',
        success: function(genders) {
            loadOptions($('select[name=gender]'), genders);
        },
        error: function(error) {
            console.log(error);
        }
    });
    $('#filter-btn').click(function() {
        var period = $('select[name=period]').val(),
            gender = $('select[name=gender]').val(),
            violence = $('input[name=violence]:checked').val() != undefined ?  $('input[name=violence]:checked').val() : -1
            armed = $('input[name=armed]:checked').val() != undefined ?  $('input[name=armed]:checked').val() : -1,
            url = '/filterincidents';

        url += '?armed=' + armed;
        url += '&gender=' + gender;
        url += '&violence=' + violence;
        url += '&period=' + period;

        if (armed == 0 && gender == 0 && violence == -1 && period == -1)
            return;

        $.ajax({
            url: url,
            success: function(result) {
                console.log(result);
                var result_ids = [];
                for (var i = 0; i < result.length; i++) {
                    result_ids.push(result[i].id);
                }
                for (var i = 0; i < incidents.length; i++) {
                    if (incidents[i] != undefined) {
                        if ($.inArray(incidents[i].id, result_ids) >= 0)
                            markers[incidents[i].id].setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
                        else
                            markers[incidents[i].id].setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png');
                    }
                }
            },
            error: function(error) {
                swal({
                    title: 'Erro',
                    type: 'error',
                    text: 'Não foi possível filtrar as ocorrências.'
                });
            },
            complete: function() {
                $('select[name=period]').val(0);
                $('select[name=gender]').val(0);
                $('input[name=violence]:checked').prop('checked', false);
                $('input[name=armed]:checked').prop('checked', false);
                $('#filter-window').modal('hide');
            }
        });

    });
});
