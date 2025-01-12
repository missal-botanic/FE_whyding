$(document).ready(function () {
  const gallery = $("#gallery");
  const pagination = $("#pagination"); // 페이지네이션을 표시할 곳
  var accessToken = localStorage.getItem('access_token');
  var currentPageUrl = "http://127.0.0.1:8000/api/articles/my_articles/"; // 기본 URL (첫 페이지)
  var currentPage = 1; // 현재 페이지 초기값

  // 데이터를 가져오는 함수
  function fetchGalleryData(url) {
    $.ajax({
      url: url,
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      dataType: "json",
      success: function (data) {
        renderGallery(data.results);
        renderPagination(data.next, data.previous, data.count, currentPage);
      },
      error: function () {
        console.error("Failed to fetch gallery data.");
        renderEmptyGallery();
      },
    });
  }

  // 갤러리를 렌더링하는 함수
  function renderGallery(items) {
    gallery.empty(); // 갤러리 초기화 후 새로 렌더링
    if (items.length > 0) {
      items.forEach((item) => {
        const galleryItem = `
<div class="col-md-4">
    <div class="gallery-item">
        <div class="gallery-image" style="background-image: url('${item.image || ''}');">
            <!-- 공유 버튼 추가 -->
            <button class="btn-share">
                <i class="ri-share-forward-line"></i>
            </button>
        </div>
        <div class="gallery-info fs-8">
            <p><i class="ri-calendar-fill"></i> ${formatDate(item.created_at)}</p>
            <p><i class="ri-git-repository-private-fill"></i> ${item.is_public ? "공개" : "비공개"}</p>
            <button class="btn btn-dark btn-sm btn-delete mb-2" data-id="${item.id}">Delete</button>
        </div>
    </div>
</div>
        `;
        gallery.append(galleryItem);
      });
    } else {
      renderEmptyGallery();
    }
  }

  // 데이터가 없을 때 빈 박스를 렌더링하는 함수
  function renderEmptyGallery() {
    for (let i = 0; i < 9; i++) {
      const emptyItem = `
        <div class="col-md-4">
          <div class="gallery-item">
            <div class="gallery-image"></div>
            <div class="gallery-info">
              <p>No Data</p>
            </div>
          </div>
        </div>
      `;
      gallery.append(emptyItem);
    }
  }

  // 날짜 포맷 함수
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // 삭제 버튼 클릭 이벤트
  gallery.on("click", ".btn-delete", function () {
    const id = $(this).data("id");
    if (confirm("완전히 삭제 됩니다.")) {
      deleteItem(id);
    }
  });

  // 삭제 요청 함수
  function deleteItem(id) {
    $.ajax({
      url: `http://127.0.0.1:8000/api/articles/${id}/`,
      method: "DELETE",
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      success: function () {
        gallery.empty(); // 갤러리를 초기화하고 다시 로드
        fetchGalleryData(currentPageUrl); // 현재 페이지 데이터 로드
      },
      error: function () {
        alert("삭제 실패.");
      },
    });
  }

  // 페이지네이션 렌더링 함수
  function renderPagination(nextUrl, prevUrl, totalCount, currentPage) {
    pagination.empty(); // 페이지네이션 초기화

    // 페이지 수 계산
    const itemsPerPage = 9; // 한 페이지에 표시할 아이템 수
    const totalPages = Math.ceil(totalCount / itemsPerPage); // 총 페이지 수 계산

    // 이전 페이지 버튼
    if (prevUrl) {
      pagination.append('<button id="prev" class="btn btn-dark mx-2 btn-sm">이전</button>');
    } else {
      pagination.append('<button id="prev" class="btn btn-secondary mx-2 btn-sm" disabled>이전</button>');
    }

    // 페이지 번호 버튼
    for (let i = 1; i <= totalPages; i++) {
      if (i === currentPage) {
        pagination.append(`<button class="btn btn-dark mx-2 btn-sm">${i}</button>`);
      } else {
        pagination.append(`<button class="btn btn-secondary mx-2 btn-sm">${i}</button>`);
      }
    }

    // 다음 페이지 버튼
    if (nextUrl) {
      pagination.append('<button id="next" class="btn btn-dark mx-2 btn-sm">다음</button>');
    } else {
      pagination.append('<button id="next" class="btn btn-secondary mx-2 btn-sm" disabled>다음</button>');
    }

    // 페이지 번호 클릭 이벤트
    pagination.find('button').not('#prev, #next').click(function () {
      const pageNum = $(this).text();
      const newPageUrl = `http://127.0.0.1:8000/api/articles/?page=${pageNum}`;
      currentPage = parseInt(pageNum); // 현재 페이지 번호 업데이트
      fetchGalleryData(newPageUrl); // 해당 페이지 데이터 로드
    });

    // 이전 페이지 버튼 클릭 이벤트
    $("#prev").click(function () {
      if (prevUrl) {
        fetchGalleryData(prevUrl);
        currentPage--; // 현재 페이지 번호 업데이트
      }
    });

    // 다음 페이지 버튼 클릭 이벤트
    $("#next").click(function () {
      if (nextUrl) {
        fetchGalleryData(nextUrl);
        currentPage++; // 현재 페이지 번호 업데이트
      }
    });
  }

  // 초기 데이터 로드
  fetchGalleryData(currentPageUrl);
});