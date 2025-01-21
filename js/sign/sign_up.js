

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

        $.ajax({
            url: apiGlobalURL + '/api/accounts/signup/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                // 회원가입 성공 시 처리
                $('#email-password-message').text('회원가입이 성공했습니다! 로그인하세요.').css('color', 'green');
                $('#login').trigger('click');
            },
            error: function (xhr, status, error) {
                var response = xhr.responseJSON;  // 서버에서 반환한 JSON 응답
                var errorMessage = '';
        
                // 'email'과 'username'에 대한 오류가 있는지 체크
                if (response.email) {
                    errorMessage += response.email.join(", ") + "\n";  // email 관련 오류 추가
                }
                if (response.username) {
                    errorMessage += response.username.join(", ") + "\n";  // username 관련 오류 추가
                }
        
                // 오류 메시지를 하나로 합쳐서 표시
                $('#email-password-message').text(errorMessage).css('color', 'red');
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
