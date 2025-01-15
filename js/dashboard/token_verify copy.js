document.addEventListener("DOMContentLoaded", function () {
    // 페이지 로드 전에 실행될 스크립트
    (function () {
        // 로컬 스토리지에서 토큰 가져오기
        const accessToken = localStorage.getItem("access_token");
        const refreshToken = localStorage.getItem("refresh_token");

        // 화면에 토큰 정보 출력
        // debugMessage("Access Token: " + accessToken);
        // debugMessage("Refresh Token: " + refreshToken);

        // 3초 후 리다이렉트 함수
        const redirectToHome = () => {
            setTimeout(() => {
                window.location.href = "https://rr720.synology.me/whyding/";  // 리다이렉트 URL
            }, 100);  // 3초 후(3000) 리다이렉트
        };

        if (!accessToken || !refreshToken) {
            // 토큰이 없는 경우 즉시 리다이렉트
            debugMessage("토큰이 없습니다. 3초 후 리다이렉트합니다.");
            redirectToHome();
            return;
        }

        // 토큰 검증 요청
        const verifyToken = async () => {
            try {
                debugMessage("토큰 검증 요청 중...");
                const response = await fetch("http://127.0.0.1:8000/api/accounts/token/verify/", {
                    method: "GET",  // GET 방식
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`  // Authorization 헤더에 Bearer 토큰 추가
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.message === "Token is valid.") {
                        debugMessage("인증 성공.");
                    } else {
                        debugMessage("인증 실패: " + JSON.stringify(data));
                        redirectToHome();
                    }
                } else {
                    const errorData = await response.json();
                    debugMessage("인증 실패: " + JSON.stringify(errorData));
                    // 인증 실패 시 새 Access Token을 발급받기 위해 Refresh Token 사용
                    await refreshAccessToken();
                }
            } catch (error) {
                console.error("네트워크 오류: ", error);
                debugMessage("네트워크 오류 발생: " + error.message);
                redirectToHome();
            }
        };

        // Refresh Token을 사용하여 새로운 Access Token을 발급받는 함수
        const refreshAccessToken = async () => {
            try {
                debugMessage("Refresh Token을 사용하여 새로운 Access Token 요청...");
                const response = await fetch("http://127.0.0.1:8000/api/accounts/token/refresh/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        refresh: refreshToken  // Refresh Token을 요청 본문에 포함
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.access) {
                        // 새로운 Access Token을 로컬 스토리지에 저장하고 페이지 새로고침
                        localStorage.setItem("access_token", data.access);
                        debugMessage("새로운 Access Token 발급 완료.");
                        window.location.reload();  // 페이지 새로고침하여 새 토큰 적용
                    } else {
                        debugMessage("Refresh Token을 사용하여 새로운 Access Token을 발급할 수 없습니다.");
                        redirectToHome();
                    }
                } else {
                    const errorData = await response.json();
                    debugMessage("Refresh Token 요청 실패: " + JSON.stringify(errorData));
                    redirectToHome();
                }
            } catch (error) {
                console.error("네트워크 오류: ", error);
                debugMessage("Refresh Token 요청 중 네트워크 오류 발생: " + error.message);
                redirectToHome();
            }
        };

        // 토큰 검증 실행
        verifyToken();
    })();
});