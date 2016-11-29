$(function() {
    loadTemplate();
    var user_id = window.location.href.split('?user=')[1];
    if (user_id === undefined )
        user_id = 1;
    $.ajax({
        url: '/getroutes?user=' + user_id,
        success: function(result) {
            for (var i = 0; i < result.length; i++) {
                var route = $('[name=location].hidden').clone();
                route.find('h4').html('Rota ' + (i+1));
                if (result[i].numincidents < 1) {
                    route.find('div.alert')
                        .addClass('alert-success')
                        .html('Nenhuma ocorrência registrada na rota!');
                } else {
                    route.find('div.alert')
                        .addClass('alert-danger')
                        .html('<strong>Perigo!</strong> ' + result[i].numincidents + ' ocorrência(s) registrada(s) na rota!');
                }
                for (var j = 0; j < result[i].route.length; j++) {
                    var location = $($.parseHTML('<li>'));
                    location
                        .addClass('list-group-item')
                        .html(result[i].route[j]['name']);
                    route.find('ul').append(location);
                }
                route
                    .removeClass('hidden')
                    .appendTo($('#locations'));
            }
        },
        error: function(e) {
            console.log(e);
        }
    })
});