$(document).ready(function () {
    // 전역 변수로 선언
    let imageBase64Target = '';
    let imageAspectRatioTarget = 0;  // Target 이미지 비율
    let imageBase64Source = '';  // Source 이미지의 base64
    let imageAspectRatioSource = 0;  // Source 이미지 비율
    let cameraStream = null;  // 카메라 스트림을 저장할 변수

    // 카메라 활성화 / 비활성화 함수
    function toggleCamera() {
        const video = document.getElementById('videoSource');
        const cameraButton = document.getElementById('cameraToggleButton');
        const captureButton = document.getElementById('captureButton');

        if (cameraStream) {
            // 카메라가 이미 활성화된 경우
            stopCamera();
            cameraButton.textContent = '카메라 종료';
            captureButton.style.display = 'none';
            video.style.display = 'none';
            cameraContainer.css('display', 'block');
        } else {
            // 카메라 활성화
            startCamera();
            cameraButton.textContent = '카메라 비활성';
            captureButton.style.display = 'inline-block';
            video.style.display = 'inline-block';
            cameraContainer.css('display', 'none');
            
        }
    }

    // 카메라 스트림 시작
    function startCamera() {
        const video = document.getElementById('videoSource');

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                cameraStream = stream;
                video.srcObject = stream;
            })
            .catch((err) => {
                console.error('카메라 접근 실패:', err);
                $('#errorSource').text('카메라에 접근할 수 없습니다.');
            });
    }

    // 카메라 스트림 중지
    function stopCamera() {
        if (cameraStream) {
            const tracks = cameraStream.getTracks();
            tracks.forEach(track => track.stop());
            cameraStream = null;
        }
    }

    // 이미지 캡처 후 base64로 변환하는 함수
    function captureImage() {
        const video = document.getElementById('videoSource');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 비디오의 현재 프레임을 캔버스에 그리기
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // 이미지를 base64로 변환
        imageBase64Source = canvas.toDataURL('image/jpeg');

        // 캡처된 이미지를 미리보기로 표시
        $('#previewSource').attr('src', imageBase64Source).show();

        // 이미지 비율 계산
        const img = new Image();
        img.onload = function () {
            imageAspectRatioSource = img.width / img.height;
            console.log('Source 이미지 비율: ' + imageAspectRatioSource);
        };
        img.src = imageBase64Source;

        // 카메라 스트림을 멈추기 (촬영 후 자동으로 멈추게 할 수 있음)
        stopCamera();
        $('#cameraToggleButton').text('카메라 활성화');
        $('#captureButton').hide();
    }

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
                imageBase64Source = event.target.result;
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
    //target

    // 카메라 활성화 버튼 클릭 시 처리
    $('#cameraToggleButton').on('click', function () {
        toggleCamera();
        
    });

    // 촬영 버튼 클릭 시 처리
    $('#captureButton').on('click', function () {
        captureImage();
    });

});