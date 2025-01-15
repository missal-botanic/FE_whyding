

$(document).ready(function () {
    $('#signupForm').on('submit', function (event) {
        event.preventDefault(); // 기본 폼 제출 동작을 막음

        var email = $('#email').val();
        var username = $('#username').val();
        var password = $('#password').val();
        var password_confirm = $('#password_confirm').val();

        var data = {
            "email": email,
            "username": username,
            "password": password,
            "password_confirm": password_confirm,
        };

        // AJAX 요청
        $.ajax({
            url: 'http://127.0.0.1:8000/api/accounts/signup/', // API URL
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                $('#email-password-message').text('회원가입이 성공했습니다! 로그인하세요.').css('color', 'green');
                $('#login').trigger('click');
            },
            error: function (xhr, status, error) {
                $('#email-password-message').text('회원가입에 실패했습니다. 다시 시도해주세요.').css('color', 'red');
            }
        });
    });

    // 로그인 / 회원가입 토글
    $('#register').on('click', function () {
        $('#container').addClass('active');
    });

    $('#login').on('click', function () {
        $('#container').removeClass('active');
    });
});
