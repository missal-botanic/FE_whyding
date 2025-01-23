$(document).ready(function () {
    // 이미지 클릭 시 오버레이 띄우기
    $(document).on('click', '.clickable-image', function () {
        const itemId = $(this).closest('.item').data('id'); // 게시물 ID 가져오기

        // API 호출하여 이미지와 관련된 정보 가져오기
        $.ajax({
            url: `https://whyding.site/api/articles/${itemId}/`,
            method: "GET",
            success: function (data) {
                // 오버레이에 이미지 및 정보 설정
                $('#overlayImage2').attr('src', data.image);  // 데이터에서 이미지 URL을 가져옴
                $('#overlayAuthor2').html(`<i class="ri-user-fill"></i> ${data.author.username}&nbsp;|&nbsp;`);
                $('#overlayDate2').html(`<i class="ri-calendar-fill"></i> ${formatDate(data.created_at)}&nbsp;|&nbsp;`);
                $('#overlayViewCount2').html(`<i class="ri-eye-fill"></i> ${data.view_count}&nbsp;|&nbsp;`);
                $('#overlayLikeCount2').html(`<i class="ri-heart-3-fill"></i>  ${data.like_count}&nbsp;`);
            
                // 오버레이 표시
                $('#imageOverlayPop').fadeIn();
                // 좋아요 버튼에 ID 설정
                $('#likeButton').data('id', itemId).data('likeCount', data.like_count);
            },
            error: function () {
                alert('이미지 데이터를 불러오는데 실패했습니다.');
            }
        });
    });

    // 오버레이 닫기
    $(document).on('click', '#closeOverlay', function () {
        $('#imageOverlayPop').fadeOut();
    });

    // 좋아요 버튼 클릭 시
    $(document).on('click', '#likeButton', function () {
        const postId = $(this).data('id');  // 게시물 ID
        const currentLikeCount = $(this).data('likeCount'); // 현재 좋아요 개수
        const accessToken = localStorage.getItem('access_token');  // access_token 가져오기

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 좋아요 버튼 클릭시 AJAX 요청 보내기
        $.ajax({
            url: `https://whyding.site/api/articles/${postId}/like/`,
            method: "POST",
            headers: { 'Authorization': 'Bearer ' + accessToken },
            success: function (response) {
                const newLikeCount = currentLikeCount + 1;  // 좋아요 개수 증가
                $('#overlayLikeCount').text(`Likes: ${newLikeCount}`);  // 좋아요 개수 업데이트
                alert(response.message);  // 서버 응답 메시지 표시
            },
            error: function () {
                alert('오류가 발생했습니다. 다시 시도해주세요.');
            }
        });
    });

    // 날짜 포맷 함수
    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
});

const API_URL = apiGlobalURL + '/api/articles/public_articles';

function fetchPublicArticles() {
    $.ajax({
        url: API_URL,
        type: "GET",
        success: function (response) {
            const sortedArticles = sortArticlesByLikes(response.results);
            updateSidebar(sortedArticles);
        },
        error: function (error) {
            console.error("Error fetching public articles:", error);
        },
    });
}

function sortArticlesByLikes(articles) {
    return articles.sort((a, b) => b.like_count - a.like_count);
}

function updateSidebar(articles) {
    const sidebar = $(".weekly");
    sidebar.empty();
    articles.forEach((article, index) => {
        const itemHtml = `
    <div class="item clickable-image" id="wItem${index + 1}" data-id="${article.id}">
                <div class="content">
                    <img src="${article.image}" alt="#">
                    <div class="info">
                        <h4>${article.author.username}</h4>
                        <div class="view">
                            <i class="ri-eye-fill"></i>
                            <h5>${article.view_count}</h5>
                        </div>
                    </div>
                </div>
                <span>${article.like_count}<i class="ri-heart-3-fill"></i></span>
                </div>
            </div>
        `;
        sidebar.append(itemHtml);
    });
}

$(document).ready(function () {
    fetchPublicArticles();
});
