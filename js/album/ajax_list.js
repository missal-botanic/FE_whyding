$(document).ready(function () {
  const gallery = $("#gallery");
  const pagination = $("#pagination");
  const accessToken = localStorage.getItem('access_token');
  const baseUrl = "http://127.0.0.1:8000/api/articles/my_articles/";
  let currentPage = 1; // 현재 페이지 초기값

  // 데이터를 가져오는 함수
  function fetchGalleryData(url) {
    $.ajax({
      url: url,
      method: "GET",
      headers: { 'Authorization': 'Bearer ' + accessToken },
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
    gallery.empty();
    if (items.length > 0) {
      items.forEach(item => {
        gallery.append(createGalleryItem(item));
      });
    } else {
      renderEmptyGallery();
    }
  }

  // 갤러리 아이템 HTML 생성 함수
  function createGalleryItem(item) {
    return `
      <div class="col-md-4">
        <div class="gallery-item">
          <div class="gallery-image" style="background-image: url('${item.image || ''}');">
            <button class="btn-share"><i class="ri-share-forward-line"></i></button>
            <button class="btn-download"><i class="ri-file-download-line"></i></button>
            <button class="btn-delete" data-id="${item.id}"><i class="ri-delete-bin-line"></i></button>
          </div>

        </div>
                  <div class="gallery-info ">
            <p class="fw-bold mt-2"><i class="ri-git-repository-private-fill fs-8"></i> ${item.is_public ? "공개" : "비공개"}</p>
            <p class="font-small"> <i class="ri-calendar-fill fs-8"></i> ${formatDate(item.created_at)}</p>
            
          </div>
      </div>
    `;
  }

  // 데이터가 없을 때 빈 박스를 렌더링하는 함수
  function renderEmptyGallery() {
    for (let i = 0; i < 9; i++) {
      gallery.append(createEmptyGalleryItem());
    }
  }

  // 빈 갤러리 아이템 HTML 생성 함수
  function createEmptyGalleryItem() {
    return `
      <div class="col-md-4">
        <div class="gallery-item">
          <div class="gallery-image"></div>
          <div class="gallery-info">
            <p>No Data</p>
          </div>
        </div>
      </div>
    `;
  }

  // 날짜 포맷 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // 연도의 마지막 두 자리
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월 (1부터 시작하므로 +1)
    const day = date.getDate().toString().padStart(2, '0'); // 일

    return `${year}${month}${day}`;
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
    toggleSpinner100(0.5, 0.5);
    $.ajax({
      url: `http://127.0.0.1:8000/api/articles/${id}/`,
      method: "DELETE",
      headers: { 'Authorization': 'Bearer ' + accessToken },
      success: function () {
        gallery.empty();
        fetchGalleryData(baseUrl); // 삭제 후 데이터 재로드
      },
      error: function () {
        alert("삭제 실패.");
      },
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


  // function formatDate(dateString) {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // } 

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

  // 다운로드 버튼 클릭 이벤트
  gallery.on("click", ".btn-download", function () {
    const backgroundImage = $(this).closest(".gallery-image").css("background-image");
    const imageUrl = backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)$/, '');

    downloadImage(imageUrl);
  });

  // 이미지 다운로드 함수
  function downloadImage(imageUrl) {
    fetch(imageUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error("이미지를 다운로드할 수 없습니다.");
        }
        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = imageUrl.split('/').pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error("다운로드 오류:", error);
        alert("이미지를 다운로드할 수 없습니다.");
      });
  }

  // 초기 데이터 로드
  fetchGalleryData(baseUrl);
});