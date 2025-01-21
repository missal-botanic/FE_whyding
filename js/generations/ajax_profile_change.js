// Base64 문자열을 Blob으로 변환하는 함수
function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64); // Base64 디코딩
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
}

// 서버에 프로필 이미지 업로드
function uploadProfileImage(base64Image) {
    // localStorage에서 access_token 가져오기
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('로그인 상태가 아닙니다. 로그인 후 다시 시도해주세요.');
        return;
    }

    // Base64 문자열을 Blob으로 변환
    const blob = base64ToBlob(base64Image, 'image/jpeg');

    // FormData 객체 생성
    const formData = new FormData();
    formData.append('profile_image', blob, 'profile-image.jpg'); // 프로필 이미지 추가

    // AJAX PUT 요청
    $.ajax({
        url: apiGlobalURL + '/api/accounts/profile/', // API 엔드포인트
        type: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + accessToken // Authorization 헤더에 access_token 추가
        },
        data: formData,
        processData: false, // FormData는 자동으로 처리하지 않도록 설정
        contentType: false, // Content-Type 자동 설정 방지
        success: function(response) {
            alert('프로필 이미지가 성공적으로 변경되었습니다.');
            console.log(response);

            // 성공 시 프로필 이미지를 업데이트
            const newImageUrl = URL.createObjectURL(blob); // Blob을 로컬 URL로 변환
            $('#profile-image-main').attr('src', newImageUrl); // 이미지 태그에 적용
        },
        error: function(xhr, status, error) {
            console.error('서버 요청 실패:', status, error);
            alert('프로필 이미지 변경에 실패했습니다. 다시 시도해주세요.');
        }
    });
}

// "프로필 변경" 버튼 클릭 이벤트
$('#SetProfile').on('click', function () {
    if (!savedBase64Image) {
        alert('먼저 이미지를 생성해주세요.');
        return;
    }

    // 프로필 이미지 업로드
    uploadProfileImage(savedBase64Image);
});