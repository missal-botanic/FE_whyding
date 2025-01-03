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