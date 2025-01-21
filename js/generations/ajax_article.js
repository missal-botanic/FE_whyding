var savedBase64Image = null; // 이미지를 저장할 변수

// 이미지 결과 처리
function imageResult(response) {
    if (response && response.image) {
        var imageSrc = 'data:image/jpeg;base64,' + response.image;
        $('#combinedImage').attr('src', imageSrc).show();
        $('#imageResult').show();
        $('body').css('overflow', 'hidden');
        
        // 생성된 이미지를 저장
        savedBase64Image = response.image; // 이미지 Base64를 저장
    } else {
        alert('조합된 이미지를 받을 수 없습니다.');
    }
}

// "보관" 버튼 클릭 시 실행되는 함수
$('#saveButton').on('click', function () {
    if (!savedBase64Image) {
        alert('먼저 이미지를 생성해주세요.');
        return;
    }

    // 이미지 업로드
    uploadImageToServer(savedBase64Image);
});

// Base64 문자열을 Blob으로 변환하는 함수
function base64ToBlob(base64, mimeType) {
    var byteCharacters = atob(base64); // Base64를 디코딩
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += 1024) {
        var slice = byteCharacters.slice(offset, offset + 1024);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
}

// 서버에 이미지 업로드
function uploadImageToServer(base64Image) {
    // localStorage에서 access_token을 가져옵니다.
    var accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        alert('로그인 상태가 아닙니다. 로그인 후 다시 시도해주세요.');
        return;
    }

    // Base64 문자열을 Blob으로 변환
    var blob = base64ToBlob(base64Image, 'image/jpeg');

    // FormData 객체 생성
    var formData = new FormData();
    formData.append('title', 'hello'); // 제목
    formData.append('content', 'world'); // 내용
    formData.append('image', blob, 'combined-image.jpg'); // 이미지 파일 추가
    formData.append('tag_ids', JSON.stringify([1])); // 태그 ID (예시)
    formData.append('is_public', false); // 공개 여부

    // AJAX 요청으로 이미지 업로드
    $.ajax({
        url: apiGlobalURL + '/api/articles/', // API 엔드포인트 (실제 서버 URL로 변경)
        type: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken // Authorization 헤더에 access_token 추가
        },
        data: formData,
        processData: false, // FormData는 자동으로 처리하지 않도록 설정
        contentType: false, // 자동으로 Content-Type을 설정하지 않도록 설정
        success: function(response) {
            alert('이미지가 성공적으로 보관되었습니다.');
            console.log(response);
        },
        error: function(xhr, status, error) {
            console.error('서버 요청 실패:', status, error);
            alert('서버 요청에 실패했습니다. 다시 시도해주세요.');
        }
    });
}
