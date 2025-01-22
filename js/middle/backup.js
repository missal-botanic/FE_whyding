
    // 게시물 클릭 이벤트
    $('.gallery-item').on('click', function () {
        const postId = $(this).data('id');
        showPostDetail(postId);
    });

    
// 게시물 상세 정보를 모달에 띄우는 함수
function showPostDetail(postId) {
    const postUrl = `http://127.0.0.1:8000/api/articles/${postId}/`;
    $.get(postUrl, function (data) {
        const postContent = `
            <h1>${data.title}</h1>
            <p>${data.content}</p>
            <img src="${data.image}" alt="${data.title}" class="img-fluid">
            <p>작성일: ${new Date(data.created_at).toLocaleDateString()}</p>
            <p id="like-count">조회수: ${data.view_count} | 좋아요: ${data.like_count}</p>
            <p>작성자: ${data.author.username}</p>
            <button id="likeBtn" class="btn btn-primary">좋아요</button>
        `;
        $('#post-detail').html(postContent);

        // 조회수 증가
        increaseViewCount(postId);

        // 좋아요 버튼 클릭 이벤트
        $('#likeBtn').on('click', function () {
            toggleLikePost(postId);
        });

        // 모달 열기
        $('#postModal').css('display', 'block');
    });
}

// 조회수 증가 함수
function increaseViewCount(postId) {
    $.ajax({
        url: `http://127.0.0.1:8000/api/articles/${postId}/`,
        type: 'PATCH',
        data: {
            view_count: 1
        },
        success: function () {
            console.log('조회수가 증가했습니다.');
        }
    });
}

// 좋아요 토글 함수
function toggleLikePost(postId) {
    const token = localStorage.getItem('access_token'); // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
        alert('로그인이 필요합니다.');
        return;
    }

    // 좋아요 상태 추적 변수
    const likeCountElem = $('#like-count');
    let currentLikeCount = parseInt(likeCountElem.text().split('좋아요: ')[1].split(' ')[0]);
    const isLiked = $('#likeBtn').hasClass('liked'); // 좋아요 상태 확인

    // 좋아요 상태에 따른 처리
    if (isLiked) {
        // 좋아요 취소
        currentLikeCount--;
        likeCountElem.text(`조회수: ${currentLikeCount} | 좋아요: ${currentLikeCount}`);
        $('#likeBtn').removeClass('liked').text('좋아요');

        // 서버에 좋아요 취소 요청
        $.ajax({
            url: `http://127.0.0.1:8000/api/articles/${postId}/like/`,
            type: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (response) {
                if (response.message === "Article unliked.") {
                    alert('좋아요가 취소되었습니다.');
                }
            },
            error: function () {
                alert('좋아요 취소에 실패했습니다.');
            }
        });
    } else {
        // 좋아요 추가
        currentLikeCount++;
        likeCountElem.text(`조회수: ${currentLikeCount} | 좋아요: ${currentLikeCount}`);
        $('#likeBtn').addClass('liked').text('좋아요 취소');

        // 서버에 좋아요 추가 요청
        $.ajax({
            url: `http://127.0.0.1:8000/api/articles/${postId}/like/`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            success: function (response) {
                if (response.message === "Article liked.") {
                    alert('좋아요가 반영되었습니다.');
                }
            },
            error: function () {
                alert('좋아요를 반영하는데 문제가 발생했습니다.');
            }
        });
    }
}

// 처음 데이터 가져오기
// fetchGalleryData(baseUrl);