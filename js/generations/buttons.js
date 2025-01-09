

// 생성 버튼 타이머
function toggleSpinner(durationInSeconds) {
    var $spinner = $("#spinner");
    var $button = $("#createImageButton");

    // 스피너 표시, 버튼 숨기기
    $spinner.show();
    $button.hide();

    // 애니메이션으로 투명도를 점차 감소
    var fadeOutDuration = durationInSeconds * 1000; // 밀리초로 변환
    var steps = 100; // 애니메이션을 몇 단계로 나눌지 설정
    var stepDuration = fadeOutDuration / steps; // 각 단계의 시간
    var currentOpacity = 1; // 초기 투명도 1 (불투명)
    var opacityStep = (currentOpacity - 0.1) / steps; // 각 단계마다 얼마나 투명도를 낮출지 계산

    var interval = setInterval(function() {
        currentOpacity -= opacityStep; // 투명도 감소
        if (currentOpacity <= 0.1) {
            currentOpacity = 0.1; // 투명도가 0.2 이하로 내려가지 않도록 설정
            clearInterval(interval); // 애니메이션 종료
        }
        $spinner.css("opacity", currentOpacity); // 스피너에 새로운 투명도 적용
    }, stepDuration); // 지정된 시간 간격마다 투명도를 조정

    // 지정된 시간이 지난 후 버튼 표시, 스피너 숨기기
    setTimeout(function() {
        $spinner.hide();
        $button.show();
    }, fadeOutDuration); // 밀리초 단위로 변환
}

toggleSpinner(1);                                   // 삭제필요


//슬라이드
var creativityTimeout;
var c_denoisingValue;  // c_denoisingValue 변수 선언

// 텍스트와 슬라이더 값을 업데이트하는 함수
function updateCreativityText(sliderValue) {
    $("#creativityText").text(sliderValue + '%');
    clearTimeout(creativityTimeout);
    creativityTimeout = setTimeout(function () {
        $("#creativityText").text('Creativity');
    }, 1000);
}

// 슬라이더 값 변경 및 텍스트 업데이트 함수
function updateSliderValue(value) {
    c_denoisingValue = value;  // c_denoisingValue에 슬라이더 값 저장
    $('#DenoisingRange').val(value.toFixed(2));
    $("#sliderValue").text(value.toFixed(2));
    updateCreativityText((value * 100).toFixed(0)); 
    // console.log(c_denoisingValue);
}

// 슬라이더 입력 처리
$(".Denoisingslider").on("input", function (event) {
    var value = parseFloat($(event.currentTarget).val());
    updateSliderValue(value);
});

// 버튼 클릭 처리
$(document).ready(function () {
    var step = 0.01; // step 값

    // + 버튼 클릭
    $('#increase').on('click', function () {
        var currentValue = parseFloat($('#DenoisingRange').val());
        var maxValue = parseFloat($('#DenoisingRange').attr('max'));
        if (currentValue + step <= maxValue) {
            updateSliderValue(currentValue + step);
        }
    });

    // - 버튼 클릭
    $('#decrease').on('click', function () {
        var currentValue = parseFloat($('#DenoisingRange').val());
        var minValue = parseFloat($('#DenoisingRange').attr('min'));
        if (currentValue - step >= minValue) {
            updateSliderValue(currentValue - step);
        }
    });
});

