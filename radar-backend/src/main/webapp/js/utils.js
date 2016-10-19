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

function loadTemplate(anchor) {
    $.get('/html/navbar.html', function(template) {
        var rendered = Mustache.render(template);
        $('header').html(rendered);
        $(anchor).addClass('active');
    });
    $.get('/html/login-window.html', function(template) {
        var rendered = Mustache.render(template);
        $('#content').append(rendered);
        $('#login-window').on('show.bs.modal', function (e) {
            $('#login-form').submit(function() {
                var user = {
                    'email': $('#login-window input[name=email]').val(),
                    'password': $('#login-window input[name=password]').val()
                };
                $.ajax({
                    type: 'POST',
                    url:  '/login',
                    data: JSON.stringify(user),
                    complete: function(data) {
                        if (data.responseJSON.result == "EMAIL_OR_PASSWORD_WRONG") {
                            if ($('#login-form p.login-error').is(':hidden')) {
                                $('#login-form p.login-error').fadeToggle();
                            }
                        } else {
                            window.location.href = '/incidents';
                        }
                    },
                    error: function(error) {
                        if ($('#login-form p.login-error').is(':hidden'))
                            $('#login-form p.login-error').fadeToggle();
                    }
                });
                return false;
            });  
        });
    });
}
