// 갤러리 로드 함수


// function loadGallery(url, containerId) {
//     // API 호출
//     $.get(url, function (data) {
//         // 받은 데이터에서 'results' 배열을 가져옴
//         const articles = data.results;

//         // 갤러리 아이템을 저장할 HTML 내용
//         let galleryHTML = '';

//         // 최대 9개의 이미지로 갤러리 구성
//         for (let i = 0; i < Math.min(9, articles.length); i++) {
//             const article = articles[i];

//             // 이미지가 있을 때만 처리
//             if (article.image) {
//                 galleryHTML += `
//                     <div class="col-md-4 mb-4 gallery-item" data-id="${article.id}">
//                         <div class="item hover-img">
//                             <div class="image-container">
//                                 <div class="like2">
//                                     <i class="ri-heart-3-fill"></i>
//                                 </div>
//                                 <img src="${article.image}" class="card-img-top" alt="${article.title}" 
//                                      style="width: 100%; height: auto; border-radius: 30px; cursor: pointer;">
//                                 <div class="card-body">
//                                     <p class="card-text"> 
//                                         <i class="ri-eye-fill"></i> ${article.view_count} | <i class="ri-star-fill"></i> ${article.like_count}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//             }
//         }

//         // 갤러리 영역에 HTML 삽입
//         $(containerId).html(galleryHTML);
//     });
// }

// 갤러리 로드 함수
function loadGallery(url, containerId) {
    // API 호출
    $.get(url, function (data) {
        // 받은 데이터에서 'results' 배열을 가져옴
        const articles = data.results;
        // 갤러리 아이템을 저장할 HTML 내용
        let galleryHTML = '';

        // 최대 9개의 이미지로 갤러리 구성
        for (let i = 0; i < Math.min(9, articles.length); i++) {
            const article = articles[i];

            // 이미지가 있을 때만 처리
            if (article.image) {
                galleryHTML += `
                    <div class="col-md-4 mb-4 gallery-item" data-id="${article.id}">
                        <div class="item hover-img">
                            <div class="image-container">
                                <div class="like2" onclick="submitLike2(event)">
                                    <i class="ri-heart-3-fill"></i>
                                </div>
                                <img src="${article.image}" class="card-img-top" alt="${article.title}" 
                                     style="width: 100%; height: auto; border-radius: 30px; cursor: pointer;">
                                <div class="card-body">
                                    <p class="card-text"> 
                                        <i class="ri-eye-fill"></i> ${article.view_count} | <i class="ri-heart-3-fill"></i> ${article.like_count}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        // 기존 갤러리 내용 비우기
        $(containerId).html('')

        // 새로운 갤러리 HTML 삽입
        $(containerId).html(galleryHTML);
    });
}


// 페이지네이션 로드 함수
function loadPagination(url, containerId) {
    $.get(url, function (data) {
        const totalCount = data.count;
        const nextUrl = data.next;
        const prevUrl = data.previous;

        const itemsPerPage = 9;
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        // 페이지네이션 버튼 HTML
        let paginationHTML = '';

        // 이전 버튼
        // if (prevUrl) {
        //     paginationHTML += '<button id="prev" class="btn btn-dark mx-2 btn-sm">이전</button>';
        // } else {
        //     paginationHTML += '<button id="prev" class="btn btn-secondary mx-2 btn-sm" disabled>이전</button>';
        // }

        // 페이지 번호 버튼
        const currentPage = getQueryParam('page', url) || 1;
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `
                <button class="btn btn-sm mx-1 ${i === currentPage ? 'btn-dark active' : 'btn-secondary'}" 
                        data-page="${i}">${i}</button>
            `;
        }
        // 다음 버튼
        // if (nextUrl) {
        //     paginationHTML += '<button id="next" class="btn btn-dark mx-2 btn-sm">다음</button>';
        // } else {
        //     paginationHTML += '<button id="next" class="btn btn-secondary mx-2 btn-sm" disabled>다음</button>';
        // }

        // 페이지네이션 삽입
        $(containerId).html(paginationHTML);
    });
}

// 페이지네이션 버튼 클릭 이벤트
$(document).on('click', '#pagination-middle button', function () {
    const currentPage = $(this).data('page');
    if (currentPage) {
        const url = apiGlobalURL + `/api/articles/public_articles/?page=${currentPage}`;
        loadGallery(url, '#gallery-middle');
        loadPagination(url, '#pagination-middle');
    }

    if ($(this).attr('id') === 'prev' || $(this).attr('id') === 'next') {
        const url = apiGlobalURL + `/api/articles/public_articles/?page=${currentPage + ($(this).attr('id') === 'prev' ? -1 : 1)}`;
        loadGallery(url, '#gallery-middle');
        loadPagination(url, '#pagination-middle');
    }
});

// 좋아요 기능 처리
// $(document).on('click', '.like2', function () {
//     const postId = $(this).closest('.gallery-item').data('id');
//     const accessToken = localStorage.getItem('access_token');
   
//     if (!accessToken) {
//         alert("로그인이 필요합니다.");
//         return;
//     }

//     const likeButton = $(this);

//     $.ajax({
//         url: apiGlobalURL + `/api/articles/${postId}/like/`,
//         method: 'POST',
//         headers: {
//             'Authorization': 'Bearer ' + accessToken
//         },
//         success: function (response) {
//             alert(response.message);
//             loadGallery(apiGlobalURL + '/api/articles/public_articles/', '#gallery-middle');
//         },
//         error: function () {
//             alert('오류가 발생했습니다. 다시 시도해주세요.');
//         }
//     });
// });

function submitLike2(event) {
    // 이벤트 발생한 .like2 요소에서 postId 가져오기
    const postId = $(event.target).closest('.gallery-item').data('id');
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
    }

    // 좋아요 버튼을 클릭한 요소
    const likeButton = $(event.target);

    // AJAX 요청
    $.ajax({
        url: apiGlobalURL + `/api/articles/${postId}/like/`,
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function (response) {
            alert(response.message);
            loadGallery(apiGlobalURL + '/api/articles/public_articles/', '#gallery-middle');
        },
        error: function () {
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    });
}


// 쿼리 파라미터 추출 함수
function getQueryParam(name, url) {
    const urlParams = new URLSearchParams(url);
    return urlParams.get(name);
}

// 페이지 로드 시 첫 번째 페이지 로드
$(document).ready(function () {
    const firstPageUrl = apiGlobalURL + '/api/articles/public_articles/?page=1';
    loadGallery(firstPageUrl, '#gallery-middle');
    loadPagination(firstPageUrl, '#pagination-middle');
});
