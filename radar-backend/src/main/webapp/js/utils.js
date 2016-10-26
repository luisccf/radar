String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

var loadOptions = function(select, items) {
    $.each(items, function (i, item) {
        select.append($('<option>', { 
            value: item.id,
            text : item.name.capitalize()
        }));
    });
}

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
                    success: function(data) {
                        window.location.href = '/incidents';
                    },
                    error: function(error) {
                        if (error.status == 400) {
                            $('#form-error').html('Excesso de tentativas atingido.');
                        } else if (error.status == 404) {
                            $('#form-error').html('E-mail ou senha incorretos.');
                        }
                        if ($('#login-form p[name=form-error]').is(':hidden'))
                            $('#login-form p[name=form-error]').fadeToggle();
                    }
                });
                return false;
            });  
        });
    });

}
