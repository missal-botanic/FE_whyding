// 토큰 검증 함수
const verifyToken = function() {
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
            if (data.message === "Token is valid.") {
                console.log("인증 성공.");
            } else {
                console.log("인증 실패: " + JSON.stringify(data));
                redirectToHome();
            }
        },
        error: function(xhr, status, error) {
            console.log("인증 실패: " + error);
            // 인증 실패 시 새 Access Token을 발급받기 위해 Refresh Token 사용
            refreshAccessToken(refreshToken);
        }
    });
};

// Refresh Token을 사용하여 새로운 Access Token을 발급받는 함수
const refreshAccessToken = function(refreshToken) {
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
                window.location.reload();  // 페이지 새로고침하여 새 토큰 적용
            } else {
                console.log("Refresh Token을 사용하여 새로운 Access Token을 발급할 수 없습니다.");
                redirectToHome();
            }
        },
        error: function(xhr, status, error) {
            console.log("Refresh Token 요청 실패: " + error);
            redirectToHome();
        }
    });
};
