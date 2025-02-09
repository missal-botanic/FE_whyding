// 토큰 검증 함수
function verifyToken(callback) {
    // 로컬 스토리지에서 토큰 가져오기
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    // 3초 후 리다이렉트 함수
    const redirectToHome = function() {
        setTimeout(function() {
            window.location.href = 'index.html'; // 리다이렉트 URL
        }, 100);  // 100ms 후 리다이렉트
    };

    if (!accessToken || !refreshToken) {
        // 토큰이 없는 경우 즉시 리다이렉트
        console.log("토큰이 없습니다. 3초 후 리다이렉트합니다.");
        redirectToHome();
        return;
    }

    // 토큰 검증 요청
    $.ajax({
        url: apiGlobalURL + '/api/accounts/token/verify/',
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + accessToken  // Authorization 헤더에 Bearer 토큰 추가
        },
        success: function(data) {
            if (data.message === "토큰이 유효합니다.") {
                // 토큰이 유효한 경우
                console.log("인증 성공: 토큰 유효");
                if (callback) callback(null); // 콜백을 통한 성공 처리
            } else {
                // 토큰이 유효하지 않으면 Refresh Token을 사용하여 새로운 Access Token 발급 시도
                console.log("토큰 유효하지 않음. Refresh Token을 사용하여 새 Access Token 발급 시도.");
                refreshAccessToken(refreshToken, callback);
            }
        },
        error: function(xhr, status, error) {
            console.log("인증 실패: " + error);

            // 인증 실패 시 자격 인증 데이터가 없을 경우 (토큰이 없을 경우)
            if (xhr.responseJSON && xhr.responseJSON.detail === "자격 인증데이터(authentication credentials)가 제공되지 않았습니다.") {
                console.log("토큰 없음, 3초 후 리다이렉트");
                redirectToHome();
            } else {
                // 그 외 오류 (예: 토큰 만료 등) 발생 시 리프레시 시도
                refreshAccessToken(refreshToken, callback);
            }
        }
    });
}

// Refresh Token을 사용하여 새로운 Access Token을 발급받는 함수
function refreshAccessToken(refreshToken, callback) {
    console.log("Refresh Token을 사용하여 새로운 Access Token 요청...");
    
    $.ajax({
        url: apiGlobalURL + '/api/accounts/token/refresh/',
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            refresh: refreshToken  // Refresh Token을 요청 본문에 포함
        }),
        success: function(data) {
            if (data.access) {
                // 새로운 Access Token을 로컬 스토리지에 저장하고 페이지 새로고침
                localStorage.setItem("access_token", data.access);
                console.log("새로운 Access Token 발급 완료.");
                if (callback) callback(null); // 콜백을 통한 성공 처리
                window.location.reload();  // 새로고침하여 새 토큰 적용
            } else {
                // Refresh Token으로 Access Token 발급 실패
                console.log("Refresh Token을 사용하여 새로운 Access Token을 발급할 수 없습니다.");
                redirectToHome();
            }
        },
        error: function(xhr, status, error) {
            // Refresh Token 요청 실패 시 리다이렉트
            console.log("Refresh Token 요청 실패: " + error);
            redirectToHome();
        }
    });
}

// 3초 후 리다이렉트 함수
function redirectToHome() {
    setTimeout(function() {
        window.location.href = 'index.html'; // 리다이렉트 URL
    }, 100);  // 100ms 후 리다이렉트
}
