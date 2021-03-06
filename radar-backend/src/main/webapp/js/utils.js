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
        var user_id = window.location.href.split('?user=')[1];
        var navbar_right = '';
        if (user_id === undefined) {
            navbar_right = '<li id="to-signup"><a href="/signup">Cadastrar-se</a></li>\
            <li id="to-login"><a data-toggle="modal" data-target="#login-window">Entrar<span class="sr-only">(current)</span></a></li>\
            <li id="to-help"><a href="/help">Ajuda</a></li>';
        } else {
            navbar_right = '<li class="dropdown">\
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Usuário<span class="caret"></span></a>\
                <ul class="dropdown-menu">\
                    <li><a href="/user/routes">Minhas rotas</a></li>\
                </ul>\
            </li>\
             <li id="to-logout"><a href="/incidents">Sair</a></li>';
        }
        var rendered = Mustache.render(template, {
            navbar_right: navbar_right
        });
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
                        switch (error.status) {
                            case 489:
                            case 492:
                                $('#login-form p[name=form-error]').html('E-mail ou senha incorretos.');
                                break;
                            case 490:
                                $('#login-form p[name=form-error]').html('Usuário desativado.');
                                break;
                            case 491:
                                $('#login-form p[name=form-error]').html('Excesso de tentativas atingido.');
                                break;
                            default:
                                $('#login-form p[name=form-error]').html('Ocorreu um erro desconhecido.');
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
