var g_user;

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
        case 493:
        $('input[name=password]').siblings('[name=form-error]')
            .html('Senha incorreta.')
            .fadeIn();
        break;
        default:
        swal({
            title: 'Ocorreu um erro ao atualizar os seus dados!',
            text: 'Por favor, tente novamente.',
            type: 'error',
            confirmButtonText: 'Ok'
        });
    }
}

var checkPasswords = function(password, check) {
    if (password.val() != check.val()) {
        password.siblings('[name=form-error]')
            .html('Senhas não conferem.')
            .fadeIn();
        check.siblings('[name=form-error]')
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
        if (!checkPasswords($('input[name=password]'), $('input[name=check-password]')))
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
    var gender, color;
    $.ajax({
        url: '/getuser',
        data: 'id=' + user_id,
        type: 'GET',
        success: function(user) {
            g_user = user;
            console.log(user);
            var d = new Date(user.birth);
            var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
            var month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
            var year = d.getFullYear();        
            var formatted_date = [year, month, day].join('-');
            $('input[name=username]').val(user.username);
            $('input[name=email]').val(user.email);
            $('input[name=birth]').val(formatted_date);
            $('select[name=height]').val(user.height);
            gender = user.gender === undefined ? undefined : user.gender.id;
            color = user.color === undefined ? undefined : user.color.id;
            $.ajax({
                url: '/getcolors',
                success: function(colors) {
                    loadOptions($('select[name=color]'), colors);
                    $('select[name=color]').val(color);
                },
                error: function(error) {
                    console.log(error);
                }   
            });    
            $.ajax({
                url: '/getgenders',
                success: function(genders) {
                    loadOptions($('select[name=gender]'), genders);
                    $('select[name=gender]').val(gender);
                },
                error: function(error) {
                    console.log(error);
                }
            });
            $('select[name=height]').val(user.height);
        },
        error: function(error) {
            console.log(error);
            swal({
                type: 'error',
                title: 'Erro',
                text: 'Ocorreu um erro ao carregar as informações.'
            });
        }
    });

    $('#edit-user-form').submit(function() {
        $('[name=form-error]').fadeOut();
        if (!checkPasswords($('input[name=password]'), $('input[name=check-password]')))
            return false;

        var user = {
            'id': g_user.id,
            'username': $('input[name=username]').val(),
            'email': $('input[name=email]').val(),
            'oldpassword': $('input[name=password]').val(),
            'birth': $('input[name=birth]').val(),
            'height': $('select[name=height]').val()
        };
        if ($('select[name=gender]').val() != "0")
            user.gender = {'id': $('select[name=gender]').val()};
        if ($('select[name=color]').val() != "0")
            user.color = {'id': $('select[name=color]').val()};

        // Tries to send new user data to server
        initAjaxCall();
        $.ajax({
            type: 'POST',
            url: '/updateuser',
            data: JSON.stringify(user),
            success: function(result) {
                g_user = user;
                swal({
                    title: 'Dados alterados com sucesso!',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function(error) {
                checkStatus(error.status);
            },
            complete: function() {
                finishAjaxCall();
            }
        });
        return false; 
    });

   $('#change-password-form').submit(function() {
        $('[name=form-error]').fadeOut();
        if (!checkPasswords($('input[name=new-password]'), $('input[name=check-new-password]')))
            return false;

        var user = {
            'id': g_user.id,
            'username': g_user.username,
            'email': g_user.email,
            'oldpassword': $('input[name=old-password]').val(),
            'newpassword': $('input[name=new-password]').val(),
            'birth': g_user.birth,
            'height': g_user.height
        };
        if (g_user.gender !== undefined)
            user.gender = {'id': g_user.gender.id};
        if (g_user.color !== undefined)
            user.color = {'id': g_user.color.id};

        // Tries to send new user data to server
        initAjaxCall();
        $.ajax({
            type: 'POST',
            url: '/updateuser',
            data: JSON.stringify(user),
            success: function(result) {
                g_user = user;
                swal({
                    title: 'Dados alterados com sucesso!',
                    type: 'success',
                    confirmButtonText: 'OK'
                });
            },
            error: function(error) {
                checkStatus(error.status)
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
                url: '/deactivateaccount?id=' + g_user.id,
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
