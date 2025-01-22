$(document).ready(function () {
    fetchGalleryData();  // 페이지가 로드될 때마다 데이터를 로드

    // 이미지 클릭 시 오버레이 띄우기 (이벤트 위임 방식 사용)
    $(document).on("click", ".gallery-item img", function () {
        const itemId = $(this).closest('.gallery-item').data("id");

        // API 호출하여 상세 정보 가져오기
        $.ajax({
            url: `https://whyding.site/api/articles/${itemId}/`,
            method: "GET",
            success: function (data) {
                // 오버레이에 정보 설정
                $("#overlayImage").attr("src", data.image);
                $("#overlayAuthor").html(`<i class="ri-user-fill"></i>  ${data.author.username}&nbsp;|&nbsp;`);
                $("#overlayDate").html(`<i class="ri-calendar-fill"></i>  ${formatDate(data.created_at)}&nbsp;|&nbsp;`);
                $("#overlayViewCount").html(`<i class="ri-eye-fill"></i>  ${data.view_count}&nbsp;|&nbsp;`);
                $("#overlayLikeCount").html(`<i class="ri-star-fill"></i> ${data.like_count}&nbsp;`);

                // 오버레이 표시
                $("#imageOverlay").fadeIn();
            },
            error: function () {
                alert("이미지 데이터를 불러오는데 실패했습니다.");
            }
        });
    });

    // 닫기 버튼 클릭 시 오버레이 닫기
    $("#closeOverlay").on("click", function () {
        $("#imageOverlay").fadeOut();
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
