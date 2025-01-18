var emailC = null
var usernameC = null
var introductionC = null

$(document).ready(function () {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('로그인이 필요합니다.');
        return;
    }
    // 유저 정보 불러오기
    function loadUserProfile() {
        $.ajax({
            url: 'http://127.0.0.1:8000/api/accounts/profile/',
            type: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            success: function (data) {
                $('#username').text(data.username || '없음');
                $('#email').text(data.email || '없음');
                $('#introduction').text(data.introduction || '');
                if (data.profile_image) {
                    $('#profile-image').attr('src', data.profile_image);
                } else {
                    $('#profile-image').attr('src', 'img/profile/default-profile.jpg');
                }
                $('.loading').hide();
                // 수정할 때 사용될 필드에 값 채우기
                $('#new-username').val(data.username || '');  // username 값
                $('#new-introduction').val(data.introduction || '');  // introduction 값
            },
            error: function () {
                $('.loading').text('프로필을 불러오는 중 오류 발생');
            }
        });
    }

    // 초기 프로필 로드
    loadUserProfile();

    // 회원 정보 수정 페이지
    // $('#edit-profile').click(function () {
    //     $('#edit-profile-form').fadeIn();
    // });

    $('#submit-edit').click(function () {
        const username = $('#new-username').val();
        const introduction = $('#new-introduction').val();
        if (username && introduction) {
            $.ajax({
                url: 'http://127.0.0.1:8000/api/accounts/profile/',
                type: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                contentType: 'application/json',
                data: JSON.stringify({ username, introduction }),
                success: function () {
                    loadUserProfile();
                    alert('회원 정보가 수정되었습니다.');
                    $('#edit-profile-modal').modal('hide');
                },
                error: function () {
                    alert('회원 정보 수정 중 오류 발생');
                }
            });
        }
    });

    // 비밀번호 변경 페이지
    // $('#change-password').click(function () {
    //     $('#change-password-form').fadeIn();
    // });

    $('#submit-password-change').click(function () {

        const oldPassword = $('#old-password').val();
        const newPassword = $('#new-password').val();
        const newPasswordconfirm = $('#new-password-confirm').val();

        if (newPassword !== newPasswordconfirm) {
            alert('새로운 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;  // 일치하지 않으면 진행하지 않고 종료
        }

        if (oldPassword && newPassword) {
            $.ajax({
                url: `http://127.0.0.1:8000/api/accounts/password/${$('#username').text()}/`,
                type: 'PUT',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                contentType: 'application/json',
                data: JSON.stringify({ old_password: oldPassword, new_password: newPassword, new_password_confirm: newPasswordconfirm }),
                success: function () {
                    alert('비밀번호가 변경되었습니다.');
                    // $('.form-container').fadeOut();
                    $('#change-password-modal').modal('hide');
                },
                error: function () {
                    alert('비밀번호 변경 중 오류 발생');
                }
            });
        }
    });

    // 폼 취소 버튼 처리
    // $('.cancel').click(function () {
    //     $('.form-container').fadeOut();
    // });


    const checkbox = document.getElementById("delete-account-check");
    const deleteButton = document.getElementById("submit-password-delete");

    // 체크박스의 상태를 감지하여 계정삭제 버튼 활성화/비활성화
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            deleteButton.disabled = false; // 체크되면 버튼 활성화
        } else {
            deleteButton.disabled = true; // 체크 해제되면 버튼 비활성화
        }
    });
    
    // 계정 삭제
    $('#submit-password-delete').click(function () {
        // const password = prompt('비밀번호를 입력하세요:');
        const password = $('#delete-password').val();
        if (password) {
            $.ajax({
                url: 'http://127.0.0.1:8000/api/accounts/delete/',
                type: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                contentType: 'application/json',
                data: JSON.stringify({ password: password, confirm_delete: true }),
                success: function () {
                    localStorage.removeItem('access_token');
                    $('#change-password-modal').modal('hide');
                    window.location.href = 'https://rr720.synology.me/whyding/';
                },
                error: function () {
                    alert('계정 삭제 중 오류 발생');
                }
            });
        }
    });
});