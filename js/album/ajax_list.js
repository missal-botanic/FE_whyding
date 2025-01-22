$(document).ready(function () {
  const gallery = $("#gallery");
  const pagination = $("#pagination");
  const accessToken = localStorage.getItem('access_token');
  const baseUrl = apiGlobalURL + '/api/articles/my_articles/';
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
            <button class="btn-share" data-id="${item.id}">
              <i class="${item.is_public ? 'ri-lock-unlock-line' : 'ri-lock-fill'}"></i>
            </button>
            <button class="btn-download"><i class="ri-file-download-line"></i></button>
            <button class="btn-delete" data-id="${item.id}"><i class="ri-delete-bin-line"></i></button>
          </div>
        </div>
        <div class="gallery-info">
          <p class="fw-bold mt-2" id="isPublicText"><i class="ri-git-repository-private-fill fs-8"></i> ${item.is_public ? "공개" : "비공개"}</p>
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
      url: apiGlobalURL + `/api/articles/${id}/`,
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

  // 공개/비공개 상태를 변경하는 함수
  function togglePublicStatus(id, isPublic, button) {
    
    const accessToken = localStorage.getItem('access_token');
    
    // 보내는 데이터 형식
    const data = {
      content: "-",
      is_public: isPublic
    };
    console.log(data,"변경완료")
    $.ajax({
      url: apiGlobalURL + `/api/articles/${id}/`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      data: JSON.stringify(data), // data를 JSON 형식으로 변환하여 전송
      success: function (response) {

        if (isPublic) {
          button.find('i').removeClass('ri-lock-fill').addClass('ri-lock-unlock-line');
        } else {
          button.find('i').removeClass('ri-lock-unlock-line').addClass('ri-lock-fill');
        }

//페이지 기억시키고 재로딩
        const currentPageUrl = `${baseUrl}?page=${currentPage}`;
        fetchGalleryData(currentPageUrl);
        
      },
      error: function (jqXHR, textStatus, errorThrown) {
        let errorMessage = "상태 변경에 실패했습니다.";
        if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
          errorMessage = jqXHR.responseJSON.message; // 서버에서 보내는 오류 메시지
        }
        alert(errorMessage);
      }
    });
  }

  // 초기 데이터 로드
  fetchGalleryData(baseUrl);

  // 공유 버튼 클릭 이벤트

  gallery.on("click", ".btn-share", function () {
    const id = $(this).data("id");
    
    // 클릭된 아이콘의 상태 확인 (비공개 상태 = true, 공개 상태 = false)
    const isPublic = $(this).find('i').hasClass('ri-lock-fill'); // 현재 상태 (비공개)
    
    togglePublicStatus(id, isPublic, $(this)); // 상태 반전 후 전송
  });
  
});
