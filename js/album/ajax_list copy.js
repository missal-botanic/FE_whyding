$(document).ready(function () {
    const gallery = $("#gallery");
    var accessToken = localStorage.getItem('access_token');

    
  

    // 데이터를 가져오는 함수
    function fetchGalleryData() {
      $.ajax({
        url: "http://127.0.0.1:8000/api/articles/",
        method: "GET",
        headers: {
          'Authorization': 'Bearer ' + accessToken
      },
        dataType: "json",
        success: function (data) {
          renderGallery(data.results);
        },
        error: function () {
          console.error("Failed to fetch gallery data.");
          renderEmptyGallery();
        },
      });
    }
  
    // 갤러리를 렌더링하는 함수
    function renderGallery(items) {
      if (items.length > 0) {
        items.forEach((item) => {
          const galleryItem = `
            <div class="col-md-4">
              <div class="gallery-item">
                <div class="gallery-image" style="background-image: url('${item.image || ''}');"></div>
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
          // alert("Item deleted successfully!");
          gallery.empty(); // 갤러리를 초기화하고 다시 로드
          fetchGalleryData();
        },
        error: function () {
          alert("삭제 실패.");
        },
      });
    }
  
    // 초기 데이터 로드
    fetchGalleryData();
  });