// $(document).ready(function () {
    // 페이지 로드 시 기본 프로필 정보를 불러오는 함수 호출
    // initializeProfilePage();

    // 프로필 페이지에 필요한 AJAX 요청을 처리하는 함수
    function initializeProfilePage() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            $('.loading').text('로그인이 필요합니다.');
            return;
        }

        $.ajax({
            url: 'http://127.0.0.1:8000/api/accounts/profile/',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            },
            success: function (data) {
                $('#profile-name-main').text(data.username +"님" || '없음');
                // $('#email').text(data.email || '없음');
                if (data.profile_image) {
                    $('#profile-image-main').attr('src', data.profile_image);
                } else {
                    $('#profile-image-main').attr('src', 'img/profile/default-profile.jpg');
                }
                $('.loading').hide();
            },
            error: function (xhr, status, error) {
                console.error(error);
                if (xhr.status === 401) {
                    $('.loading').text('인증 오류: 토큰이 유효하지 않습니다.');
                } else {
                    $('.loading').text('프로필을 불러오는 데 오류가 발생했습니다.');
                }
            }
        });
    }

// });