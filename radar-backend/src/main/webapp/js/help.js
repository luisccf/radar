var services = [];

$(function() {

    $.ajax({
        url: '/getservices',
        success: function(data) {
            $.each(data, function (i, item) {
                $('#state-select').append($('<option>', { 
                    value: item.id,
                    text : item.state
                }));
                services.push(item);
            });

        },
        error: function(e) {
            console.log(e);
        }
    });

    $('#state-select').on('change', function() {
        var service_id = $(this).val();
        for (var i = 0; i < services.length; i++) {
            if (services[i].id == service_id) {
                $('#email').html(services[i].email);
                $('#website').html(services[i].site);
                $('#phone-number').html(services[i].phone);
            }
        }
    });
});
