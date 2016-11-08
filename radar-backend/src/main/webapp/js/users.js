var loadOptions = function(select, items) {
    $.each(items, function (i, item) {
        select.append($('<option>', { 
            value: item.id,
            text : item.name.capitalize()
        }));
    });
}

var checkStatus = function(status) {
    switch (status) {
        case 489:
        $('input[name=birth]').siblings('[name=form-error]')
            .html('Você deve ter no mínimo 13 anos para usar o sistema.')
            .fadeIn();
        break;
        case 490:
        $('input[name=email]').siblings('[name=form-error]')
            .html('E-mail já cadastrado no sistema.')
            .fadeIn();
        break;
        case 491:
        $('input[name=username]').siblings('[name=form-error]')
            .html('Nome de usuário já cadastrado no sistema.')
            .fadeIn();
        break;
        case 492:
        $('input[name=username]').siblings('[name=form-error]')
            .html('Nome de usuário muito curto.')
            .fadeIn();
        break;
        default:
        console.log('Erro desconhecido.');
    }
}

var checkPasswords = function() {
    if ($('input[name=password]').val() != $('input[name=check-password]').val()) {
        $('input[name=password], input[name=check-password').siblings('[name=form-error]')
            .html('Senhas não conferem.')
            .fadeIn();
        return false;
    }
    return true;
}

var initAjaxCall = function() {
    $('body').css('cursor', 'wait');
    $('form button[type=submit]').prop('disabled', true);
}

var finishAjaxCall = function() {
    $('body').css('cursor', 'auto');
    $('form button[type=submit]').prop('disabled', false);
}

var initCreateUserPage = function() {
    $('#signup-form').submit(function() {
        $('[name=form-error]').fadeOut();
        if (!checkPasswords())
            return false;
        var user = {
            'username': $('input[name=username]').val(),
            'email': $('input[name=email]').val(),
            'password': $('input[name=password]').val(),
            'birth': $('input[name=birth]').val()
        };
        // Tries to send new user data to server
        initAjaxCall();
        $.ajax({
            type: 'POST',
            url: '/createuser',
            data: JSON.stringify(user),
            success: function(result) {
                // Redirects to edit user info page
                window.location.href = '/user/edit?user=' + user.username;
            },
            error: function(error) {
                $('[name=form-error]').fadeOut();
                checkStatus(error.status);
            },
            complete: function() {
                finishAjaxCall();
            }
        });
        return false;
    });
}

var initEditUserPage = function() {
    // Loads current user, all colors and all genders via ajax call
    var user_id = window.location.href.split('?user=')[1];
    $.ajax({
        url: '/getuser',
        data: 'id=' + user_id,
        type: 'GET',
        success: function(user) {
            console.log(user);
            var date = new Date(user.birth);
            var formatted_date = [date.getFullYear(), date.getMonth(), date.getDate()].join('-');
            $('input[name=username]').val(user.username);
            $('input[name=email]').val(user.email);
            $('input[name=birth]').val(formatted_date);
            $('select[name=gender]').val(user.gender);
            $('select[name=color]').val(user.color);
            $('select[name=height]').val(user.height);
        },
        error: function(error) {
            console.log(error);
        }
    });
    $.ajax({
        url: '/getcolors',
        success: function(colors) {
            loadOptions($('select[name=color]'), colors);
        },
        error: function(error) {
            console.log(error);
        }   
    });    
    $.ajax({
        url: '/getgenders',
        success: function(genders) {
            loadOptions($('select[name=gender]'), genders);
        },
        error: function(error) {
            console.log(error);
        }
    });

    $('#edit-user-form').submit(function() {
        $('[name=form-error]').fadeOut();
        if (!checkPasswords())
            return false;
        var user = {
            // 'username': $('input[name=username]').val(),
            'email': $('input[name=email]').val(),
            'password': $('input[name=password]').val(),
            'birth': $('input[name=birth]').val(),
            'gender': {'id': $('select[name=gender]').val()},
            'color': {'id': $('select[name=color]').val()},
            'height': {'id': $('select[name=birth]').val()}
        };
        // Tries to send new user data to server
        initAjaxCall();
        $.ajax({
            type: 'POST',
            url: '/updateuser',
            data: JSON.stringify(user),
            success: function(result) {
                swal({
                    title: 'Dados alterados com sucesso!',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function(error) {
                swal({
                    title: 'Ocorreu um erro ao atualizar os seus dados!',
                    text: 'Por favor, tente novamente.',
                    type: 'error',
                    confirmButtonText: 'Ok'
                });
            },
            complete: function() {
                finishAjaxCall();
            }
        });
        return false; 
    });
    
    $('#deactivate-account').click(function() {
        swal({
            title: 'Tem certeza disso?',
            text: 'Sua conta será desativada, mas suas ocorrências não serão removidas.',
            type: 'warning',
            showCancelButton: true,
            closeOnConfirm: false,
            showLoaderOnConfirm: true,
        }, function() {
            $.ajax({
                url: '/deactivateaccount?id=' + 1,
                success: function() {
                    swal({
                        type: 'success',
                        title: 'Sucesso',
                        text: 'Conta desativada com sucesso :/'
                    }, function() {
                        window.location.href = '/incidents';
                    });
                },
                error: function() {
                    swal({
                        type: 'error',
                        title: 'Erro',
                        text: 'Não foi possível desativar sua conta ^^'
                    });
                }
            });
        });
    });

}

$(function() {
    if (window.location.pathname == '/signup')
        initCreateUserPage();
    else if (window.location.pathname == '/user/edit')
        initEditUserPage();
});
