 
function convertImageToBase64(imageURL, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            // Base64 데이터에서 불필요한 부분을 제거하고 저장
            var base64String = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            // 콜백 함수에 Base64 값 전달
            callback(base64String);
            
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', imageURL);
    xhr.responseType = 'blob';  // 바이너리로 이미지를 가져옴
    xhr.send();
}



// 생성 버튼 클릭 시 호출
$(document).ready(function () {
    $('#wpGen').click(function () {
        var imageURL = $('#previewTarget').attr('src'); // 이미지 미리보기에서 URL 가져오기
    
        if (imageURL) {
            convertImageToBase64(imageURL, function(base64Image) {
                ajaxBase64Image = base64Image;
                // Base64로 변환된 이미지
                // console.log(base64Image);  // Base64 값 확인용
            });
        } else {
            console.log("이미지가 선택되지 않았습니다.");
        }

        apiAjax() //api 호출
    });
});


// API 호출 함수
function apiAjax() {
    // saveImage()
    var imageData = $("#wPaint").wPaint("image");
    var editedImg = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');

 
    var promptValue = $('#exampleFormControlTextarea1').val();  // prompt 텍스트 값
    var negativePromptValue = $('#exampleFormControlTextarea2').val();  // negative_prompt 텍스트 값

    // 추가적인 기본 텍스트 값들
    var basicPromptValue = " 4k, high resolution, uhd, ultra high res, super detail, hyper detail, masterpiece, best quality, wedding";  // 여기에 기본 prompt를 넣으세요
    var basicNegativePromptValue = "signature, watermark, text, title, logo, username,  gross proportions, malformed limbs, (text), (sign), naked, nude, NFSW, young, nudity, sexual, explicit, erotic, pornographic, explicit, sexual";  // 여기에 기본 negative prompt를 넣으세요

    // JSON 객체 생성, 텍스트 영역에서 가져온 값과 기본값을 결합
    var A_json = {
        "prompt": promptValue + " " + basicPromptValue,  // prompt와 basicPromptValue 결합
        "negative_prompt": negativePromptValue + " " + basicNegativePromptValue,  // negative_prompt와 basicNegativePromptValue 결합
        "width": 768,
        "height": 1024,
        "steps": 20,
        "seed": -1,
        "seed_resize_from_h": 0,
        "seed_resize_from_w": 0,
        "sampler_name": "Euler a",
        "save_images": false,
        "init_images": [editedImg],
        "denoising_strength": c_denoisingValue,
    };

    // API 요청
    $.ajax({
        method: "POST",
        url: "https://img2img.bluest-dealers0m.workers.dev",  // API 엔드포인트
        data: JSON.stringify(A_json),  // 요청 본문(JSON 형식)
        dataType: 'json',  // 응답 데이터 형식
        contentType: 'application/json',  // 서버에 JSON 형식으로 요청
        timeout: 100000,
        beforeSend: function () {
            $('#wrap-loading').removeClass('display-none').fadeIn(500); 
            $('#spinner-re').removeClass('display-none').fadeIn(500); 
            $('#wpButton-area').addClass('display-none').fadeIn(500);
            toggleSpinner(10); // 5~6초 기본 값
           

        },
        success: function (msg) {
            $('#wrap-loading').addClass('display-none');
            $('#spinner-re').addClass('display-none');
            $('#wpButton-area').removeClass('display-none').fadeIn(500); 
            // console.log('API response received:', msg);
            handleSuccess(msg); // 필수ss
            
            // hideSpinner()

        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 오류가 발생했을 때 처리
            console.log('Error occurred:', textStatus, errorThrown);
            handleError(jqXHR, textStatus, errorThrown);
        },
        complete: function () {
            // 요청이 완료된 후 실행 (성공/실패 상관없이)
            
            console.log('Request completed');
            
            
        }
    });
}

// 성공적으로 응답을 받았을 때 처리
function handleSuccess(msg) {
    // console.log('Image generation success', msg);

    // 응답에서 이미지를 Base64로 처리하는 부분
    if (msg && msg.images && msg.images.length > 0) {
        // Base64 이미지 데이터를 받아와서 이미지 태그에 할당
        wpaintFi = msg.images[0]
        var imageData = "data:image/jpeg;base64," + msg.images[0];  // Base64 문자열 처리

        var imgElement = document.getElementById('gen-genImage');


        $("#wPaint").wPaint("image", imageData);
        wpaintRe = imageData;

        imgElement.src = imageData;  // 이미지를 화면에 출력

        var genImageArea = document.getElementById('gen-imageArea');
        genImageArea.classList.remove('gendummy');  // 생성된 이미지 영역을 보여줌


    } else {
        console.error('Invalid image data received or missing image field.');
        handleErrorResponse("Invalid image data received or missing image field.");
    }
}

// 오류 발생 시 처리
function handleError(jqXHR, textStatus, errorThrown) {
    console.error('Error response received:', jqXHR.responseText);  // 서버의 응답 텍스트 출력
    console.error('Error Status:', textStatus);  // HTTP 상태 코드
    console.error('Error Thrown:', errorThrown);  // 오류 설명

    // 응답이 JSON 형식이면 JSON 메시지를 출력
    if (jqXHR.responseJSON) {
        console.error('Error Response JSON:', jqXHR.responseJSON);
    } else {
        console.error('Error Response Text:', jqXHR.responseText);
    }

    errorGenBotton();  // 에러 발생 시 버튼 처리
}

// API 오류 응답을 처리하는 함수
function handleErrorResponse(message) {
    alert(message);  // 사용자에게 오류 메시지 표시
    errorGenBotton();
}

// 버튼을 비활성화하거나 활성화하는 함수 (에러 발생 시 호출)
function errorGenBotton() {
    $('#gen-generateButton').prop('disabled', false);  // 버튼 활성화
    $('#wrap-loading').addClass('display-none');  // 로딩 화면 숨기기
}