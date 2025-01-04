
function imageResult(response) {
    // 서버에서 받은 응답을 기반으로 결과 처리
    if (response && response.image) {
        var imageSrc = 'data:image/jpeg;base64,' + response.image;
        $('#combinedImage').attr('src', imageSrc).show();
        $('#imageResult').show();
    } else {
        alert('조합된 이미지를 받을 수 없습니다.');
    }
}

// 이미지 생성 버튼 클릭
$('#createImageButton').on('click', function () {
    // 업로드된 이미지가 있는지 확인
    if (!imageBase64Source || !imageBase64Target) {
        alert('Source 이미지와 Target 이미지를 모두 업로드해주세요.');
        return;
    }
    $('#wrap-loading').removeClass('display-none');
    // AJAX를 통해 서버에 데이터 전송
    $.ajax({
        url: 'https://whyding.bluest-dealers0m.workers.dev', // 서버 URL
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            "source_image": imageBase64Source,
            "target_image": imageBase64Target,
            "source_faces_index": [0],
            "face_index": [0],
            "upscaler": 'None',
            "scale": 1,
            "upscale_visibility": 1,
            "face_restorer": 'None',
            "restorer_visibility": 1,
            "codeformer_weight": 0.5,
            "restore_first": 1,
            "model": "inswapper_128.onnx",
            "gender_source": 0,
            "gender_target": 0,
            "save_to_file": 0,
            "result_file_path": "",
            "device": "CUDA",
            "mask_face": 0,
            "select_source": 0,
            "face_model": "None",
            "source_folder": "",
            "random_image": 0,
            "upscale_force": 0,
            "det_thresh": 0.5,
            "det_maxnum": 0
        }),
        beforeSend: function () {
            toggleSpinner(5); // 5~6초 기본 값

        },
        success: function (response) {
            // imageResult 함수에 response 전달
            imageResult(response);
            $('#wrap-loading').addClass('display-none');
        },
        error: function (xhr, status, error) {
            console.error('AJAX 요청 실패:', status, error);
            alert('서버 요청에 실패했습니다. 다시 시도해주세요.');
            $('#wrap-loading').addClass('display-none');
        },
        complete: function () {
            // 요청이 완료된 후 실행 (성공/실패 상관없이)
            console.log('Request completed');
        }
    });
});
