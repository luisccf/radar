$(function() {
    $('#signup-form').submit(function() {
        $('[name=form-error]').fadeOut();
        // Checks if passwords match
        if ($('input[name=password]').val() != $('input[name=check-password]').val()) {
            $('input[name=password], input[name=check-password').siblings('[name=form-error]')
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
        // Tries to send new user data to server
        $('body').css('cursor', 'wait');
        $('#signup-form button[type=submit]').prop('disabled', true);
        $.ajax({
            type: 'POST',
            url: '/createuser',
            data: JSON.stringify(user),
            success: function(result) {
                window.location.href = '/user/edit';
            },
            error: function(error) {
                $('[name=form-error]').fadeOut();
                checkStatus(error.status);
                $('body').css('cursor', 'auto');
                $('#signup-form button[type=submit]').prop('disabled', false);
            }
        });
        return false;
    });
});

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
