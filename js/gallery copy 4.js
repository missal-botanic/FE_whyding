$(document).ready(function () {
    $('#gal-refreshButton').on('click', refreshButtonClick); // 클릭 시 새로 고침 함수 시작
    $('#gal-refreshButton').trigger('click'); // 새로 고침 시작

    // 체크박스 상태 변화 이벤트 리스너 추가
    $('input[name="checkStyle[]"]').on('change', function () {
        // 현재 체크된 체크박스의 개수 세기
        var checkedCount = $('input[name="checkStyle[]"]:checked').length;

        // 체크된 체크박스가 없으면 모두 체크
        if (checkedCount === 0) {
            $('input[name="checkStyle[]"]').prop('checked', true);
        }
    });
});

var galleryImages = $('.gallery-images');
var numImages = 9; // 로딩할 이미지 개수
// 더미 로딩 이미지 생성
function baseImages() {
    // 기존 로딩 더미 요소 제거
    galleryImages.empty(); // 또는 galleryImages.find('.loading-dummy').remove();

    // 더미 로딩 이미지 생성
    for (var i = 0; i < numImages; i++) {
        galleryImages.append(`
            <div class="loading-dummy" style="width: 100%; height: 0; padding-bottom: 75%; background-color: #ccc; position: relative; margin: 1px; opacity: 0.1;">
                <div id="dummy-loading-${i}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;">
                    loading...
                </div>
            </div>
        `);
    }
}

// 이미지 로딩 함수
function loadImages() {

    var selectedFolder = document.getElementById("gal-quarter").value;

    // 체크된 스타일 확인
    var selectedFolders = [];
    $('input[name="checkStyle[]"]:checked').each(function () {
        selectedFolders.push($(this).val());
    });

    // 선택된 폴더가 없으면 기본 폴더 사용
    if (selectedFolders.length === 0) {
        selectedFolders.push('white', 'black', 'color');
    }

    var allImages = [];
    $.ajax({
        url: 'gallery.php',
        type: 'POST',
        data: { selectedFolder: selectedFolder }, // 선택된 폴더 이름 전달
        dataType: 'json',
        success: function (data) {
            // 이미지들을 하나로 모음
            console.log(data);
            for (var i = 0; i < selectedFolders.length; i++) {
                var folder = selectedFolders[i];
                if (data.hasOwnProperty(folder)) {
                    allImages = allImages.concat(data[folder]);
                }
            }

            // 이미지 랜덤으로 선택
            var randomImages = [];
            while (randomImages.length < numImages && allImages.length > 0) {
                var randomIndex = Math.floor(Math.random() * allImages.length);
                randomImages.push(allImages.splice(randomIndex, 1)[0]);
            }

            // 로딩 더미 div를 이미지로 교체
            // 이미지 로딩 후 처리
            $.each(randomImages, function (i, imageUrl) {
                setTimeout(function () {
                    var dummy = galleryImages.find('.loading-dummy').eq(i);

                    // 배경 이미지를 설정하고 투명도 조정
                    dummy.css({
                        backgroundImage: 'url(' + imageUrl + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 1
                    }).addClass('loaded');

                    // 'loading' 텍스트 숨기기 (투명하게 만들기)
                    $('#dummy-loading-' + i).css('color', 'transparent');

                }, i * 800);
            });

           // 갤러리 이미지 클릭 이벤트
galleryImages.on('click', '.loading-dummy.loaded', function () {
    // 클릭한 이미지에만 테두리 레이어 추가
    var borderLayer = $(this).find('.border-layer');
    if (borderLayer.length === 0) {
        $(this).append('<div class="border-layer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 8px solid #dc3545; box-sizing: border-box; z-index: 1;"></div>');
    }

    // 다른 이미지들의 테두리 레이어 제거
    galleryImages.find('.loading-dummy.loaded').not(this).each(function () {
        $(this).find('.border-layer').remove(); // 테두리 레이어 제거
    });

    // 이미지 URL 추출
    var imageURL = $(this).css('background-image').replace(/url\(["']?/, '').replace(/["']?\)/, '');

    // 클릭한 이미지를 타겟에 미리보기로 표시
    $('#previewTarget').attr('src', imageURL).show();

    // 이미지를 Base64로 변환하여 imageBase64Target에 저장
    convertImageToBase64(imageURL);

    lastClickedImage = $(this); // 클릭한 이미지 저장
});

// 첫 번째 이미지 클릭 시 타겟 이미지로 표시 및 Base64 변환
setTimeout(function () {
    var firstImage = galleryImages.find('.loading-dummy.loaded:first-child');
    
    // 첫 번째 이미지를 클릭한 것처럼 처리
    var imageURL = firstImage.css('background-image').replace(/url\(["']?/, '').replace(/["']?\)/, '');
    
    // 타겟 이미지 미리보기로 설정
    $('#previewTarget').attr('src', imageURL).show();
    
    // 이미지를 Base64로 변환하여 imageBase64Target에 저장
    convertImageToBase64(imageURL);
}, 500);

// 이미지 URL을 Base64로 변환
function convertImageToBase64(imageURL) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
            // Base64 데이터에서 불필요한 부분 제거하고 imageBase64Target에 저장
            imageBase64Target = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
            // 해당 Base64 데이터를 처리하는 함수 호출 (예: 버튼 활성화 등)
            genButtonDisableCheck();
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', imageURL);
    xhr.responseType = 'blob';
    xhr.send();
}

// 마우스 진입 이벤트 처리
galleryImages.on('mouseenter', '.loading-dummy.loaded', function () {
    // 이미지 확대
    $(this).css({
        // 'transition': 'transform 0.2s ease',
        // 'transform': 'scale(1.5)',
        // 'z-index': 2,
    });
}).on('mouseleave', '.loading-dummy.loaded', function () {
    // 이미지 원래 크기로 복귀
    $(this).css({
        // 'transition': 'transform 0.2s ease',
        // 'transform': 'scale(1)',
        // 'z-index': 1,
    });
});


        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('AJAX Error:', textStatus, errorThrown);
        }
    });
}

// 새로 고침 버튼 클릭 이벤트 처리 함수
function refreshButtonClick() {
    var button = $(this);
    baseImages(); // 더미 이미지 생성
    loadImages(); // 이미지 로딩

    // 스피너 보이기
    $('#spinner2').css('opacity', '0').show().animate({ opacity: 1 }, 300); // 스피너를 투명도 0에서 1로 보이게 함

    button.prop('disabled', true).css('opacity', '0.4').text('Loading');

    // 일정 시간 후 버튼 활성화 및 스피너 숨기기
    setTimeout(function () {
        button.prop('disabled', false).css('opacity', '1').text('Refresh');

        // 스피너 숨기기
        $('#spinner2').animate({ opacity: 0 }, 300, function() {
        });
    }, 8000); // 스피너가 돌아가는 시간
}
