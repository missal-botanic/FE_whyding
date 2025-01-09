$(document).ready(function () {

    // 로그인 처리
    $('#loginForm').on('submit', function (event) {
        event.preventDefault(); // 기본 폼 제출 동작을 막음

        var email = $('#email2').val();
        var password = $('#password2').val();

        var data = {
            "username": email, // 이메일 필드를 'username'으로 처리
            "password": password
        };

        // AJAX 요청
        $.ajax({
            url: 'http://127.0.0.1:8000/api/accounts/login/', // 로그인 API URL
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                // 로그인 성공 시, 응답에 따라 토큰 저장
                if (response.message === "로그인이 성공했습니다.") {
                    // 토큰을 로컬 스토리지에 저장
                    localStorage.setItem('auth_token', response.token);

                    // 로그인 성공 후 리디렉션
                    window.location.href = "https://rr720.synology.me/whyding/dashboard.html"; // 로그인 성공 후 이동할 URL
                }
            },
            error: function (xhr, status, error) {
                $('span').text('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.').css('color', 'red');
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
