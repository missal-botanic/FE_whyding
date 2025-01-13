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
        <!-- 이미지 영역 -->
        <div class="gallery-image" style="background-image: url('${item.image || ''}');">
            <!-- 공유 버튼 -->
            <button class="btn-share">
                <i class="ri-share-forward-line"></i>
            </button>
            <!-- 다운로드 버튼 -->
            <button class="btn-download">
                <i class="ri-file-download-line"></i>
            </button>
            <!-- 삭제 버튼 -->
            <button class="btn-delete" data-id="${item.id}">
                <i class="ri-delete-bin-line"></i>
            </button>
        </div>
        <!-- 정보 영역 -->
        <div class="gallery-info fs-8">
            <p><i class="ri-calendar-fill"></i> ${formatDate(item.created_at)}</p>
            <p><i class="ri-git-repository-private-fill"></i> ${item.is_public ? "공개" : "비공개"}</p>
            
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
  $(document).ready(function () {
    const gallery = $("#gallery");
    const pagination = $("#pagination");
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
          renderPagination(data.next, data.previous, data.count, currentPage); // currentPage를 여기서 사용
        },
        error: function () {
          console.error("Failed to fetch gallery data.");
          renderEmptyGallery();
        },
      });
    }

    // 페이지 번호 버튼 클릭 이벤트
    pagination.on('click', 'button', function () {
      const pageNum = $(this).text();
      console.log("Selected Page (Button Text):", pageNum); // 디버깅: 버튼의 텍스트 값 확인
      if (!isNaN(pageNum)) {
        currentPage = parseInt(pageNum); // 현재 페이지 번호 업데이트
        const newPageUrl = `http://127.0.0.1:8000/api/articles/my_articles/?page=${currentPage}`;
        console.log("Updated Current Page:", currentPage); // 디버깅: 업데이트된 currentPage 값
        fetchGalleryData(newPageUrl); // 해당 페이지 데이터 로드
      }
    });

    // 이전 페이지 버튼 클릭 이벤트
    pagination.on('click', '#prev', function () {
      console.log("Prev Button Clicked"); // 디버깅: 이전 버튼 클릭 확인
      if (currentPage > 1) { // 현재 페이지가 1보다 클 때만 감소
        currentPage--;
        const newPageUrl = `http://127.0.0.1:8000/api/articles/my_articles/?page=${currentPage}`;
        console.log("Updated Current Page (Prev):", currentPage); // 디버깅: 이전 버튼으로 업데이트된 currentPage
        fetchGalleryData(newPageUrl); // 해당 페이지 데이터 로드
      }
    });

    // 다음 페이지 버튼 클릭 이벤트
    pagination.on('click', '#next', function () {
      console.log("Next Button Clicked"); // 디버깅: 다음 버튼 클릭 확인
      currentPage++;
      const newPageUrl = `http://127.0.0.1:8000/api/articles/my_articles/?page=${currentPage}`;
      console.log("Updated Current Page (Next):", currentPage); // 디버깅: 다음 버튼으로 업데이트된 currentPage
      fetchGalleryData(newPageUrl); // 해당 페이지 데이터 로드
    });

    // 페이지네이션 렌더링 함수
    function renderPagination(nextUrl, prevUrl, totalCount, currentPage) {
      pagination.empty(); // 페이지네이션 초기화

      const itemsPerPage = 9; // 한 페이지에 표시할 아이템 수
      const totalPages = Math.ceil(totalCount / itemsPerPage); // 총 페이지 수 계산

      if (prevUrl) {
        pagination.append('<button id="prev" class="btn btn-dark mx-2 btn-sm">이전</button>');
      } else {
        pagination.append('<button id="prev" class="btn btn-secondary mx-2 btn-sm" disabled>이전</button>');
      }

      for (let i = 1; i <= totalPages; i++) {
        console.log("Rendering Page Button:", i, "Current Page:", currentPage); // 디버깅: 각 페이지 버튼 렌더링 시 currentPage 확인
        if (i === currentPage) { // currentPage 값을 제대로 사용하도록 수정
          pagination.append(`<button class="btn btn-dark mx-2 btn-sm active">${i}</button>`);
        } else {
          pagination.append(`<button class="btn btn-secondary mx-2 btn-sm">${i}</button>`);
        }
      }

      if (nextUrl) {
        pagination.append('<button id="next" class="btn btn-dark mx-2 btn-sm">다음</button>');
      } else {
        pagination.append('<button id="next" class="btn btn-secondary mx-2 btn-sm" disabled>다음</button>');
      }
    }

    // 초기 데이터 로드
    fetchGalleryData(currentPageUrl);
  });
  // 다운로드 버튼 클릭 이벤트
  gallery.on("click", ".btn-download", function () {
    // 배경 이미지 URL 추출
    const backgroundImage = $(this).closest(".gallery-image").css("background-image");

    // URL에서 실제 경로만 추출 (예: url("http://example.com/image.jpg") -> http://example.com/image.jpg)
    const imageUrl = backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)$/, '');

    // 이미지 데이터를 Blob으로 다운로드
    fetch(imageUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("이미지를 다운로드할 수 없습니다.");
        }
        return response.blob(); // Blob으로 변환
      })
      .then((blob) => {
        // Blob을 사용해 다운로드
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = imageUrl.split('/').pop(); // 파일 이름 설정
        document.body.appendChild(a); // 임시로 추가
        a.click(); // 다운로드 트리거
        document.body.removeChild(a); // DOM에서 제거
        URL.revokeObjectURL(blobUrl); // Blob URL 해제
      })
      .catch((error) => {
        console.error("다운로드 오류:", error);
        alert("이미지를 다운로드할 수 없습니다.");
      });
  });


  // 초기 데이터 로드
  fetchGalleryData(currentPageUrl);
});

