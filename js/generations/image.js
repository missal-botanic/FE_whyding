

$(document).ready(function () {
    // Source 이미지 업로드 처리
    $('#imageUploadSource').on('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            const fileType = file.type.split('/')[1];
            const fileSize = file.size / 1024 / 1024; // MB 단위로 변환

            if (fileType !== 'jpeg' && fileType !== 'png') {
                $('#errorSource').text('JPEG 또는 PNG 형식의 이미지 파일만 업로드 가능합니다.');
                $('#previewSource').hide();
                return;
            }

            if (fileSize > 2) {
                $('#errorSource').text('이미지 크기는 2MB 이하만 업로드 가능합니다.');
                $('#previewSource').hide();
                return;
            }

            $('#errorSource').text('');

            const reader = new FileReader();
            reader.onload = function (event) {
                imageBase64Source = event.target.result; // 전역 변수에 할당
                $('#previewSource').attr('src', imageBase64Source).show();

                const img = new Image();
                img.onload = function () {
                    imageAspectRatioSource = img.width / img.height;
                    console.log('Source 이미지 비율: ' + imageAspectRatioSource);
                };
                img.src = imageBase64Source;
            };
            reader.readAsDataURL(file);
        }
    });

    // Target 이미지 업로드 처리
    $('#imageUploadTarget').on('change', function (e) {
        const file = e.target.files[0];

        if (file) {
            const fileType = file.type.split('/')[1];
            const fileSize = file.size / 1024 / 1024;

            if (fileType !== 'jpeg' && fileType !== 'png') {
                $('#errorTarget').text('JPEG 또는 PNG 형식의 이미지 파일만 업로드 가능합니다.');
                $('#previewTarget').hide();
                return;
            }

            if (fileSize > 2) {
                $('#errorTarget').text('이미지 크기는 2MB 이하만 업로드 가능합니다.');
                $('#previewTarget').hide();
                return;
            }

            $('#errorTarget').text('');

            const reader = new FileReader();
            reader.onload = function (event) {
                imageBase64Target = event.target.result; // 전역 변수에 할당
                $('#previewTarget').attr('src', imageBase64Target).show();

                const img = new Image();
                img.onload = function () {
                    imageAspectRatioTarget = img.width / img.height;
                    console.log('Target 이미지 비율: ' + imageAspectRatioTarget);

                    // 이미지 비율에 맞게 dummy-image의 비율 설정
                    $('#combinedImage').on('load', function () {
                        // target 이미지 비율에 맞춰 dummy-image의 padding-bottom을 설정
                        $('.dummy-image').css('padding-bottom', (100 / imageAspectRatioTarget) + '%');
                    });
                };
                img.src = imageBase64Target;
            };
            reader.readAsDataURL(file);
        }
    });
});
