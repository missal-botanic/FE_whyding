
$(document).ready(function () {

    function handleFileSelect(event) {
        event.preventDefault();  // 기본 동작을 막기 (드래그 앤 드롭 시)
    
        var file;
        
        if (event.type === 'drop') {
            file = event.originalEvent.dataTransfer.files[0];  // 드래그 앤 드롭 파일 처리
        } else if (event.target && event.target.files) {
            file = event.target.files[0];  // 파일 선택 시 처리
        }
        
        if (file) {
            // 파일 크기 및 타입 체크 (3MB 이하, jpg, jpeg, png 형식)
            if (file.size <= 3 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png')) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var imageRoot = e.target.result;
                    // 이미지를 wPaint에 설정
                    $("#wPaint").wPaint("image", imageRoot);
                };
                reader.readAsDataURL(file);  // 파일을 DataURL로 읽기
            } else {
                alert('Please upload a file with size less than or equal to 3MB and in jpg, jpeg, or png format.');
            }
        }
    }
    
    // wPaint 기본 설정
    $.extend($.fn.wPaint.defaults, {
        mode: 'pencil',
        lineWidth: '20',
        fillStyle: '#666666',
        strokeStyle: '#CCCCCC',
        bg: '#CCCCCC',
    });

    // 파일 업로드 버튼 클릭 시 파일 입력을 트리거
    $('#wpUpload').on('click', function () {
        $('#fileInput').click();
    });

    // 파일 선택 처리
    $('#fileInput').on('change', handleFileSelect);

    // drag and drop 처리
    $('#wpDrop-area').on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass('dragover');
    }).on('dragleave', function (e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    }).on('drop', function (e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        handleFileSelect(e);
    });

    // 이미지 저장 처리
    function saveImg(image) {
        var _this = this;
        $.ajax({
            type: 'POST',
            url: '/test/upload.php',
            data: { image: image },
            success: function (resp) {
                _this._displayStatus('Image saved successfully');
                resp = $.parseJSON(resp);
                images.push(resp.img);
                $('#wPaint-img').attr('src', image);
            }
        });
    }

    // 배경 이미지 로드 함수
    function loadImgBg() {
        this._showFileModal('bg', images);
    }

    // 전경 이미지 로드 함수
    function loadImgFg() {
        this._showFileModal('fg', images);
    }

    // wPaint 초기화
    $('#wPaint').wPaint({
        menuOffsetLeft: -35,
        menuOffsetTop: -50,
        saveImg: saveImg,
        loadImgBg: loadImgBg,
        loadImgFg: loadImgFg
    });

    // 캔버스 초기화 버튼
    $('#wpClear').on('click', function () {
        $("#wPaint").wPaint("image", "img/WPbg.svg");
    });
    $("#wpClear").click();

    // 배경 버튼 클릭 시 배경 이미지 적용
    $('.wpBGbutton').on('click', function () {
        var imagePath = $(this).attr('src');
        $('#wPaint').wPaint('bg', imagePath);
        $('#wPaint').wPaint('clear');
    });

    // 이미지 초기화 버튼
    $('#clearImage').on('click', function () {
        $('#preview').empty();
        $('#fileInput').val('');
        $('#drop-text-area').show();
        $(this).hide();
        genButtonDisableCheck();
        $('#wpDrop-area').css('border', '2px dashed #fff');
    });
});
