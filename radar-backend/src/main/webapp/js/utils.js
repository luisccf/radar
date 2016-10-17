var getMonth = function(month) {
    switch (month) {
        case 0:
            return 'janeiro';
        case 1:
            return 'fevereiro';
        case 2:
            return 'março';
        case 3:
            return 'abril';
        case 4:
            return 'maio';
        case 5:
            return 'junho';
        case 6:
            return 'julho';
        case 7:
            return 'agosto';
        case 8:
            return 'setembro';
        case 9:
            return 'outubro';
        case 10:
            return 'novembro';
        case 11:
        default:
            return 'dezembro';
    }
}

function loadTemplate() {
    $.get('/html/navbar.html', function(template) {
        var rendered = Mustache.render(template);
        $('header').html(rendered);
        $('#to-incidents').addClass('active');
    });
    $.get('/html/login-window.html', function(template) {
        var rendered = Mustache.render(template);
        $('#content').append(rendered);
        $('#login-window').on('show.bs.modal', function (e) {
            $('#login-window button[name=login]').click(function() {
                var user = {
                    'email': $('#login-window input[name=email]').val(),
                    'password': $('#login-window input[name=password]').val()
                };
                $.ajax({
                    type: 'POST',
                    url:  '/login',
                    data: JSON.stringify(user),
                    complete: function(data) {
                        console.log(data);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                });
            });  
        });
    });
}
