// 첫 번째 로딩 스피너 HTML
const firstLoadingHTML = `
<div id="toggleSpinner100" class="vw-100 min-vh-100 position-fixed z-5" style="background-color: #f8f9fa; top: 0; left: 0; width: 100%; height: 100%;">
    <div class="spinner-grow text-dark position-fixed top-50 start-50 translate-middle z-5" role="status"
        style="width: 4rem; height: 4rem;"></div>
</div>
`;

// 두 번째 로딩 스피너 HTML
const wrapLoadingHTML = `
<div id="toggleSpinner75" class="bg-white vw-100 min-vh-100 opacity-75 position-fixed z-10 display-none" style="top: 0; left: 0; width: 100%; height: 100%;">
    <div class="spinner-grow text-dark position-fixed top-50 start-50 translate-middle z-10" role="status"
        style="width: 4rem; height: 4rem;"></div>
</div>
`;

// 공통 함수: 스피너의 투명도를 조정하며 숨기는 로직
function animateSpinner(selector, fadeOutDurationInSeconds) {
    var $spinner = $(selector);
    var fadeOutDuration = fadeOutDurationInSeconds * 1000; // 밀리초로 변환
    var steps = 100; // 애니메이션을 몇 단계로 나눌지 설정
    var stepDuration = fadeOutDuration / steps; // 각 단계의 시간
    var currentOpacity = 1; // 초기 투명도 1 (불투명)
    var opacityStep = (currentOpacity - 0.1) / steps; // 각 단계마다 얼마나 투명도를 낮출지 계산

    var interval = setInterval(function() {
        currentOpacity -= opacityStep; // 투명도 감소
        if (currentOpacity <= 0.1) {
            currentOpacity = 0.1; // 투명도가 0.1 이하로 내려가지 않도록 설정
            clearInterval(interval); // 애니메이션 종료
        }
        $spinner.css("opacity", currentOpacity); // 스피너에 새로운 투명도 적용
    }, stepDuration); // 지정된 시간 간격마다 투명도를 조정

    // 지정된 시간이 지난 후 스피너 숨기기
    setTimeout(function() {
        $spinner.hide();
    }, fadeOutDuration); // 밀리초 단위로 변환
}

// toggleSpinner100 함수 (100% 불투명 배경)
function toggleSpinner100(holdDurationInSeconds, fadeOutDurationInSeconds) {
    // 첫 번째 로딩 스피너 HTML 삽입
    document.body.insertAdjacentHTML('beforeend', firstLoadingHTML);

    // 스피너 유지 시간 (holdDurationInSeconds 동안 유지)
    setTimeout(function() {
        // 스피너 애니메이션 실행 (fadeOutDurationInSeconds 동안 투명해짐)
        animateSpinner('#toggleSpinner100', fadeOutDurationInSeconds);
    }, holdDurationInSeconds * 1000); // holdDurationInSeconds 후 애니메이션 시작
}

// toggleSpinner75 함수 (75% 불투명 배경)
function toggleSpinner75(holdDurationInSeconds, fadeOutDurationInSeconds) {
    // 두 번째 로딩 스피너 HTML 삽입
    document.body.insertAdjacentHTML('beforeend', wrapLoadingHTML);

    // 스피너 유지 시간 (holdDurationInSeconds 동안 유지)
    setTimeout(function() {
        // 스피너 애니메이션 실행 (fadeOutDurationInSeconds 동안 투명해짐)
        animateSpinner('#toggleSpinner75', fadeOutDurationInSeconds);
    }, holdDurationInSeconds * 1000); // holdDurationInSeconds 후 애니메이션 시작
}

// toggleSpinner100(1, 1)
// toggleSpinner75(1, 1)