function submitFeedback() {
    // 입력값 가져오기
    let feed01 = $('#inputFeed01').val(); // 피드백 1
    let feed02 = $('#inputFeed02').val(); // 피드백 2
    let feed03 = $('#inputFeed03').val(); // 피드백 3
    let phone = $('#inputPhone').val(); // 전화번호
    let star = $('#inputStar').val(); // 별점 (텍스트 값)
    const consentChecked = $('#gridCheck').is(':checked'); // 개인정보 동의 여부

    // 개인정보 동의 여부 체크
    if (!consentChecked) {
        alert("동의해야 제출할 수 있습니다.");
        return; // 동의하지 않으면 폼을 제출하지 않음
    }

    // 입력란 내용이 없으면 "없음"으로 채우기
    if (!feed01) feed01 = "없음";
    if (!feed02) feed02 = "없음";
    if (!feed03) feed03 = "없음";
    if (!phone) phone = "없음";

    // 별점 값을 숫자로 변환 (매우 좋음 => 5, 매우 아쉬움 => 1)
    const rating = convertStarToRating(star);

    // 별점이 선택되지 않았다면 메시지 표시하고 종료
    if (rating === 0) {
        alert("별점을 선택해 주세요.");
        return; // 별점을 선택하지 않으면 폼을 제출하지 않음
    }

    // 피드백 내용을 ##로 구분하여 하나의 문자열로 합치기
    const content = feed01 + '##' + feed02 + '##' + feed03 + '##' + phone + '##' + (consentChecked ? "동의" : "미동의");

    // API로 전송할 데이터 객체 생성
    const feedbackData = {
        "content": content, // 피드백 내용
        "rating": rating // 별점 (숫자)
    };

    // localStorage에서 access_token 가져오기
    const accessToken = localStorage.getItem("access_token");

    // AJAX 요청
    $.ajax({
        url: apiGlobalURL + '/api/feedback/', // API URL
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken // Authorization 헤더에 Bearer 토큰 추가
        },
        data: JSON.stringify(feedbackData), // JSON 데이터 전송
        dataType: 'json',
        contentType: 'application/json',
        timeout: 100000,
        beforeSend: function () {
            // 요청 전 동작 (필요시)
        },
        success: function (msg) {
            // 성공 시 처리
            console.log("피드백 전송 성공:", msg);
            // 알림 메시지 띄우기
            alert("응모되었습니다.");

            // 모달 닫기
            $('#eventModal').modal('hide');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 오류 시 처리
            console.log("피드백 전송 실패:", errorThrown);
        },
        complete: function () {
            // 완료 후 처리 (필요시)
        }
    });
}

// 별점 텍스트 값을 숫자로 변환하는 함수
function convertStarToRating(star) {
    switch (star) {
        case "매우 좋음":
            return 5;
        case "좋음":
            return 4;
        case "보통":
            return 3;
        case "아쉬움":
            return 2;
        case "매우 아쉬움":
            return 1;
        default:
            return 0; // 기본값 (선택되지 않았을 경우)
    }
}
