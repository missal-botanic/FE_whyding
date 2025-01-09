$(document).ready(function () {
    // 로그인 처리
    $('#loginForm').on('submit', function (event) {
        event.preventDefault(); // 기본 폼 제출 동작을 막음

        var email = $('#email2').val();
        var password = $('#password2').val();

        var data = {
            "email": email, // 이메일 필드
            "password": password
        };

        // AJAX 요청
        $.ajax({
            url: 'http://127.0.0.1:8000/api/accounts/token/', // 로그인 API URL
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function (response) {
                // 로그인 성공 시, 토큰 저장
                if (response.access && response.refresh) {
                    localStorage.setItem('access_token', response.access);
                    localStorage.setItem('refresh_token', response.refresh);
                    // 리디렉션
                    window.location.href = "https://rr720.synology.me/whyding/dashboard.html";
                } else {
                    $('#email-password-message2').text('로그인 실패: 응답 형식이 예상과 다릅니다.').css('color', 'red');
                }
            },
            error: function (xhr, status, error) {
                $('#email-password-message2').text('로그인 실패: 이메일과 비밀번호를 확인하세요.').css('color', 'red');
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