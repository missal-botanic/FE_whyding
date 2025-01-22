


let currentPage = 1;
const pagination = $('#pagination');
const gallery = $('#gallery');

// 게시물 데이터를 가져오는 함수
function fetchGalleryData2() {
    const url =  apiGlobalURL + '/api/articles/public_articles/' + `?page=${currentPage}`;  // 현재 페이지에 맞는 URL 생성
    $.get(url, function (data) {
        renderGalleryItems(data.results);
        renderPagination(data.next, data.previous, data.count, currentPage);
    });
}

// 게시물 아이템 렌더링 함수  img/generations/source.jpg ${item.author.username}
function renderGalleryItems(items) {
    gallery.empty();
    items.forEach(item => {
        const galleryItem = `
<div class="col-md-4 mb-4 gallery-item" data-id="${item.id}">
    <div class="item hover-img">
        <div class="image-container">
            <div class="like2">
                <i class="ri-heart-3-fill"></i>
            </div>
            <img src="${item.image}" class="card-img-top" alt="${item.title}" 
                style="width: 100%; height: auto; border-radius: 30px; cursor: pointer;">
            <div class="card-body">
                <p class="card-text"> 
                    <i class="ri-eye-fill"></i> ${item.view_count} | <i class="ri-star-fill"></i> ${item.like_count}
                </p>
            </div>
        </div>
    </div>
</div>
        `;
        gallery.append(galleryItem);
    });
}
// 페이지네이션 렌더링 함수
function renderPagination(nextUrl, prevUrl, totalCount, currentPage) {
    pagination.empty();
    const itemsPerPage = 9;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    renderPaginationButtons(prevUrl, nextUrl, currentPage, totalPages);
}

// 페이지네이션 버튼 생성 함수
function renderPaginationButtons(prevUrl, nextUrl, currentPage, totalPages) {
    if (prevUrl) {
        pagination.append('<button id="prev" class="btn btn-dark mx-2 btn-sm">이전</button>');
    } else {
        pagination.append('<button id="prev" class="btn btn-secondary mx-2 btn-sm" disabled>이전</button>');
    }

    for (let i = 1; i <= totalPages; i++) {
        pagination.append(createPageButton(i, currentPage));
    }

    if (nextUrl) {
        pagination.append('<button id="next" class="btn btn-dark mx-2 btn-sm">다음</button>');
    } else {
        pagination.append('<button id="next" class="btn btn-secondary mx-2 btn-sm" disabled>다음</button>');
    }
}

// 페이지 번호 버튼 생성 함수
function createPageButton(pageNum, currentPage) {
    return pageNum === currentPage
        ? `<button class="btn btn-dark mx-2 btn-sm active">${pageNum}</button>`
        : `<button class="btn btn-secondary mx-2 btn-sm">${pageNum}</button>`;
}

// 페이지 번호 버튼 클릭 이벤트
pagination.on('click', 'button', function () {
    const pageNum = $(this).text();
    if (!isNaN(pageNum)) {
        currentPage = parseInt(pageNum);
        const newPageUrl = `${baseUrl}?page=${currentPage}`;
        fetchGalleryData2(newPageUrl);
    }
});

// 이전 페이지 버튼 클릭 이벤트
pagination.on('click', '#prev', function () {
    if (currentPage > 1) {
        currentPage--;
        const newPageUrl = `${baseUrl}?page=${currentPage}`;
        fetchGalleryData2(newPageUrl);
    }
});

// 다음 페이지 버튼 클릭 이벤트
pagination.on('click', '#next', function () {
    currentPage++;
    const newPageUrl = `${baseUrl}?page=${currentPage}`;
    fetchGalleryData2(newPageUrl);
});


$(document).on('click', '.like2', function () {
    const postId = $(this).closest('.gallery-item').data('id');  // 게시물 ID 가져오기
    const accessToken = localStorage.getItem('access_token');  // access_token 가져오기

    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
    }

    const likeButton = $(this); // 클릭된 좋아요 버튼을 변수에 저장

    // 좋아요 버튼 클릭시 AJAX 요청 보내기
    $.ajax({
        url: apiGlobalURL + `/api/articles/${postId}/like/`,
        method: "POST",
        headers: { 'Authorization': 'Bearer ' + accessToken },
        dataType: 'json',
        contentType: 'application/json',
        timeout: 100000,
        success: function (response) {
            // 서버에서 받은 응답 메시지
            const message = response.message;
            alert(message);  // 기본 브라우저 알림으로 표시

            // 성공적인 응답 후 like_count를 업데이트
            // 현재 페이지의 게시물 목록을 다시 가져오고 렌더링
            fetchGalleryData2();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // 에러 처리
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
});



