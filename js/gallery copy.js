$(document).ready(function () {

    $('#gal-refreshButton').on('click', refreshButtonClick); // 클릭 함수 시작
    $('#gal-refreshButton').trigger('click'); // 새로 고침 시작

    // 체크박스 상태 변경 이벤트 리스너 추가
    $('input[name="checkStyle[]"]').on('change', function () {
        // 현재 선택된 체크박스의 개수를 셈
        var checkedCount = $('input[name="checkStyle[]"]:checked').length;

        // 체크된 것이 없으면 모두 체크
        if (checkedCount === 0) {
            $('input[name="checkStyle[]"]').prop('checked', true);
        }
    });
});

var galleryImages = $('.gallery-images');
var numImages = 9;
// 더미 로딩 이미지
function baseImages() {
    // 기존의 loading-dummy 요소를 제거
    galleryImages.empty(); // 또는 galleryImages.find('.loading-dummy').remove();

    for (var i = 0; i < numImages; i++) {
        galleryImages.append(`
            <div class="loading-dummy" style="width: 100%; height: 0; padding-bottom: 75%; background-color: #ccc; position: relative; margin: 1px; opacity: 0.1;">
                <div id="dummy-loading-${i}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;">
                    loading...
                </div>
            </div>
        `);
    }
    console.log("baseImages");                                                     //로그
}

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

    console.log(selectedFolder, selectedFolder) //로그

    var allImages = [];
    $.ajax({
        url: 'gallery.php',
        type: 'POST',
        data: { selectedFolder: selectedFolder }, // 선택된 폴더 이름 전달
        dataType: 'json',
        success: function (data) {
            console.log(data)
            
            // 이미지를 하나의 배열로 모음
            for (var i = 0; i < selectedFolders.length; i++) {
                var folder = selectedFolders[i];
                if (data.hasOwnProperty(folder)) {
                    allImages = allImages.concat(data[folder]);
                }
            }

            // 이미지 랜덤 선택
            var randomImages = [];
            while (randomImages.length < numImages && allImages.length > 0) {
                var randomIndex = Math.floor(Math.random() * allImages.length);
                randomImages.push(allImages.splice(randomIndex, 1)[0]);
            }

            // loading-dummy div를 이미지로 교체
            // 이미지가 로드된 후 처리
            $.each(randomImages, function (i, imageUrl) {
                setTimeout(function () {
                    var dummy = galleryImages.find('.loading-dummy').eq(i);

                    // 배경 이미지 설정 및 투명도 조정
                    dummy.css({
                        backgroundImage: 'url(' + imageUrl + ')',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 1
                    }).addClass('loaded');

                    // 'loading' 텍스트 숨기기 (투명하게)
                    $('#dummy-loading-' + i).css('color', 'transparent');

                }, i * 800);
            });





            // 갤러리 이미지 클릭 이벤트
            galleryImages.on('click', '.loading-dummy.loaded', function () {
                // 클릭된 이미지에만 테두리 레이어 추가
                var borderLayer = $(this).find('.border-layer');
                if (borderLayer.length === 0) {
                    $(this).append('<div class="border-layer" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 8px solid #dc3545; box-sizing: border-box; z-index: 1;"></div>');
                }

                // 다른 이미지들에 있는 테두리 레이어는 제거
                galleryImages.find('.loading-dummy.loaded').not(this).each(function () {
                    $(this).find('.border-layer').remove(); // 테두리 레이어 제거
                });

                // 이미지 URL 추출
                var imageURL = $(this).css('background-image').replace(/url\(["']?/, '').replace(/["']?\)/, '');
                convertImageToBase64(imageURL);

                lastClickedImage = $(this); // 마지막으로 클릭한 이미지 저장
            });

            // 처음 시작 시 첫 번째 이미지 클릭
            setTimeout(function () {
                galleryImages.find('.loading-dummy.loaded:first-child').click();
            }, 500);

            function convertImageToBase64(imageURL) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        // 정규식을 이용해 불필요한 부분 제거하고 base64 데이터 저장
                        c_I2IBase64 = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                        genButtonDisableCheck();
                    };
                    reader.readAsDataURL(xhr.response);
                };
                xhr.open('GET', imageURL);
                xhr.responseType = 'blob';
                xhr.send();
            }

            // 이미지에 마우스 진입 이벤트 처리
            galleryImages.on('mouseenter', '.loading-dummy.loaded', function () {
                // 이미지 확대
                $(this).css({
                    'transition': 'transform 0.2s ease',
                    'transform': 'scale(1.5)',
                    'z-index': 2,
                });
            }).on('mouseleave', '.loading-dummy.loaded', function () {
                // 이미지 축소
                $(this).css({
                    'transition': 'transform 0.2s ease',
                    'transform': 'scale(1)',
                    'z-index': 1,
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
    baseImages();
    loadImages();

    // 스피너 표시
    $('#spinner').css('opacity', '0').show().animate({ opacity: 1 }, 300); // 스피너를 투명도 0에서 1로 보이게 함

    button.prop('disabled', true).css('opacity', '0.4').text('Loading');

    setTimeout(function () {
        button.prop('disabled', false).css('opacity', '1').text('Refresh');

        // 스피너 숨김
        $('#spinner').animate({ opacity: 0 }, 300, function() {
        });
    }, 8000); // 스피너 회전 시간
}
