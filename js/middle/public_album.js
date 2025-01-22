const baseUrl = apiGlobalURL + '/api/articles/public_articles/';

let currentPage = 1;
const pagination = $('#pagination');
const gallery = $('#gallery');

// 게시물 데이터를 가져오는 함수
function fetchGalleryData() {
    const url = baseUrl + `?page=${currentPage}`;  // 현재 페이지에 맞는 URL 생성
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
    <div class="item">
        <div class="image-container">
            <div class="like2">
                <i class="ri-heart-3-fill"></i>
            </div>
            <img src="${item.image}" class="card-img-top" alt="${item.title}" style="width: 100%; height: auto; border-radius: 30px;">
            <div class="card-body">
                <p class="card-text"> <i class="ri-eye-fill"></i> ${item.view_count} | <i class="ri-star-fill"></i> ${item.like_count}</p>
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
        fetchGalleryData(newPageUrl);
    }
});

// 이전 페이지 버튼 클릭 이벤트
pagination.on('click', '#prev', function () {
    if (currentPage > 1) {
        currentPage--;
        const newPageUrl = `${baseUrl}?page=${currentPage}`;
        fetchGalleryData(newPageUrl);
    }
});

// 다음 페이지 버튼 클릭 이벤트
pagination.on('click', '#next', function () {
    currentPage++;
    const newPageUrl = `${baseUrl}?page=${currentPage}`;
    fetchGalleryData(newPageUrl);
});

