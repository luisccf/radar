$(function() {
    $('#signup-form').submit(function() {
        $('[name=form-error]').fadeOut();
        if ($('input[name=password]').val() != $('input[name=check-password]').val()) {
            $('input[name=check-password], input[name=check-password').siblings('[name=form-error]')
                .html('Senhas não conferem.')
                .fadeIn();
            return false;
        }
        var user = {
            'username': $('input[name=username]').val(),
            'email': $('input[name=email]').val(),
            'password': $('input[name=password]').val(),
            'birth': $('input[name=birth]').val()
        };
        $.ajax({
            type: 'POST',
            url: '/createuser',
            data: JSON.stringify(user),
            success: function(result) {
                console.log('Usuário cadastrado com sucesso!');
            },
            error: function(error) {
                $('[name=form-error]').fadeOut();
                switch (error.status) {
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
                    $('input[name=email]').siblings('[name=form-error]')
                        .html('E-mail já cadastrado no sistema.')
                        .fadeIn();
                    break;
                    case 493:
                    $('input[name=username]').siblings('[name=form-error]')
                        .html('Nome de usuário muito curto.')
                        .fadeIn();
                    break;
                    case 494:
                    $('input[name=email]').siblings('[name=form-error]')
                        .html('E-mail já cadastrado no sistema')
                        .fadeIn();
                    default:
                    console.log('Erro desconhecido.');
                }
            }
        });
        return false;
    });
});
