


function signOut() {
    // localStorage에서 refresh_token 가져오기
    var refreshToken = localStorage.getItem('refresh_token');
    var accessToken = localStorage.getItem('access_token');
    
    // if (!refreshToken) {
    //     alert('No refresh token found!');
    //     return;
    // }


    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = 'index.html';

    // 로그아웃 API에 보내기 위한 데이터
    var signOutData = {
        refresh: refreshToken
    };

    // AJAX POST 요청 보내기
    fetch('http://127.0.0.1:8000/api/accounts/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(signOutData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);  // 응답 데이터 확인
        if (data.message === 'Logout successful') {
            // 백엔드에서 로그아웃이 성공하면 localStorage에서 토큰 삭제
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            // 성공적으로 로그아웃되면 리다이렉트
            // window.location.href = 'https://rr720.synology.me/whyding/';
            window.location.href = 'index.html';
        } else {
            console.error('signOut failed:', data);
        }
    })
    .catch(error => {
        console.error('Error during signOut request:', error);
    });
}
