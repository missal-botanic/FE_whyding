
// Source 이미지 자동 업로드 처리 (샘플 이미지)
function loadSourceImage() {
    const img = new Image();
    img.src = 'img/generations/source.jpg'; // 샘플 이미지 경로

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 이미지를 base64로 변환
        imageBase64Source = canvas.toDataURL();
        $('#previewSource').attr('src', imageBase64Source).show();
        $('#errorSource').text('');
    };
}

loadSourceImage();

// Target 이미지 자동 업로드 처리 (샘플 이미지)
function loadTargetImage() {
    const img = new Image();
    img.src = 'img/generations/target.jpg'; // 샘플 이미지 경로

    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 이미지를 base64로 변환
        imageBase64Target = canvas.toDataURL();
        $('#previewTarget').attr('src', imageBase64Target).show();
        $('#errorTarget').text('');
    };
}

