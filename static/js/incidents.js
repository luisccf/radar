var map,
    markers = [];

var incidents = [
    {
        'id': 1,
        'username': 'luis',
        'longitude': -42.9133,
        'latitude': -19.9167,
        'date': new Date(),
        'description': 'Lorem ipsum',
        'num_criminals': 2,
        'armed': 1,
        'victims_transportation': 'a pé',
        'criminals_transportation': 'a pé',
        'violence': 0,
        'num_victims': 1,
        'police_report': 0,
        'objects_taken': [
        ]
    },
    {
        'id': 2,
        'username': 'lccf',
        'longitude': -43.9333,
        'latitude': -19.9167,
        'date': new Date(),
        'description': 'Lorem ipsum',
        'num_criminals': 3,
        'armed': 1,
        'victims_transportation': 'de carro',
        'criminals_transportation': 'a pé',
        'violence': 0,
        'num_victims': 2,
        'police_report': 0,
        'objects_taken': [
            'celular', 'óculos de sol', 'caneta bic'
        ]
    }
];

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -19.9167, lng: -43.9333},
        zoom: 8,
        maxZoom: 12,
        streetViewControl: false
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        });
    }
}

var getIncidents = function() {
    $.ajax({
        url: '/path/to/file',
    })
    .done(function(data) {
        loadMarkers(data.incidents);
    })
    .fail(function() {
        console.log("error");
    });     
}

var loadMarkers = function(incidents) {
    for (var i = 0; i < incidents.length; i++) {
        var marker = new google.maps.Marker({
            position: {
                lat: incidents[i].latitude, 
                lng: incidents[i].longitude
            },
            map: map,
            title: incidents[i].date.toString()
        });
        marker.setValues({id: incidents[i].id});
        markers.push(marker);
        marker.addListener('click', function() {
            for (var j = 0; j < incidents.length; j++) {
                if (incidents[j].id == this.get('id')) {
                    loadInfoWindow(incidents[j]);
                    break;
                }
            }
        });
    }
}

var loadInfoWindow = function(incident) {
    var num_criminals = '',
        num_victims = '',
        victims_transportation = '',
        criminals_transportation = '',
        objects_taken = '',
        violence = incident.violence == 1 ? 'Houve violência' : 'Não houve violência',
        description = incident.description;
    if (incident.num_criminals > 1) {
        num_criminals += incident.num_criminals + ' assaltantes';
        criminals_transportation = 'Os assaltantes estavam ' + incident.criminals_transportation;
    } else {
        num_criminals += '' + incident.num_criminals + ' assaltante';
        criminals_transportation = 'O assaltante estava ' + incident.criminals_transportation;
    }
    if (incident.num_victims > 1) {
        num_victims += '' + incident.num_victims + ' vítimas';
        victims_transportation = 'As vítimas estavam ' + incident.victims_transportation;
    } else {
        num_victims += incident.num_victims + ' vítima';
        victims_transportation = 'A vítima estava ' + incident.victims_transportation;
    }
    var num_objects_taken = incident.objects_taken.length;
    if (num_objects_taken) {
        for (var i = 0; i < num_objects_taken - 1; i++) {
            objects_taken += incident.objects_taken[i] + ', ';
        }
        objects_taken += incident.objects_taken[num_objects_taken - 1];
    } else {
        objects_taken = 'Nenhum!';
    }
    var footer = incident.username + ', ' 
        + incident.date.getDate()
        + ' de ' + getMonth(incident.date.getMonth())
        + ' de ' + incident.date.getFullYear();

    var template = $('#info-window-template').html();
    Mustache.parse(template);
    var rendered = Mustache.render(
        template, 
        {
            num_criminals: num_criminals,
            num_victims: num_victims,
            criminals_transportation: criminals_transportation,
            victims_transportation, victims_transportation,
            violence: violence,
            description: description,
            objects_taken: objects_taken,
            footer: footer
        }
    );
    $('#info-window-body').html(rendered);
    $('#info-window').modal();
}

$(function() {
    loadTemplate();
    initMap();
    setTimeout(function() {
        $('#login-window').modal();
        loadMarkers(incidents);
    }, 3000);
});
