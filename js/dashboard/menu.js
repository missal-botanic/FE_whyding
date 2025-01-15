$(document).ready(function () {
    // 기본적으로 첫 번째 메뉴의 HTML을 로드
    $('#content-area').load('middle.html');

    // 네비게이션 메뉴 클릭 이벤트
    $('.sidebar .item').on('click', function () {
        // 1. 모든 메뉴에서 active 클래스 제거
        $('.sidebar .item').removeClass('active');

        // 2. 클릭한 메뉴에 active 클래스 추가
        $(this).addClass('active');

        // 3. 클릭한 메뉴의 data-url 속성에서 HTML 파일 경로를 가져옴
        var url = $(this).data('url');

        // 4. 해당 HTML 파일을 #content-area에 로드
        $('#content-area').load(url, function (response, status, xhr) {
            if (status == "error") {
                // 에러 처리 (예: HTML 파일이 없을 경우)
                $('#content-area').html("<h1>Error</h1><p>Unable to load the page.</p>");
            }
        });

        // 5. "My Private Album" 메뉴일 때만 .right-section 숨기기
        if ($(this).data('url') === "generations.html") {
            $('.right-section').hide();  // "My Private Album" 클릭 시 숨기기
        } else {
            $('.right-section').show();  // 다른 메뉴 클릭 시 다시 보이기
        }
    });
});
