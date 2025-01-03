
<?php
// 허용할 오리진 정의
$allowedOrigin = "https://rr720.synology.me";

// 요청된 오리진 확인
if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] === $allowedOrigin) {
    header("Access-Control-Allow-Origin: $allowedOrigin");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Content-Type");
} else {
    // 허용되지 않은 경우 Forbidden 메시지 반환
    http_response_code(403);
    echo json_encode(array("message" => "Forbidden"));
    exit();
}

// POST로 전달된 폴더명 가져오기
$selectedFolder = $_POST['selectedFolder'];

// 각각의 이미지 폴더 경로 정의
$folders = array(
    'white' => $selectedFolder . '/white/',
    'black' => $selectedFolder . '/black/',
    'color' => $selectedFolder . '/color/'
);

// 모든 폴더에 대한 결과를 담을 배열 초기화
$allRandomFileUrls = array();

// 각 폴더에 대한 작업 수행
foreach ($folders as $key => $folder) {
    // 이미지 폴더에서 모든 파일 목록 가져오기
    $files = glob($folder . '*.{jpg,jpeg,png,gif}', GLOB_BRACE);

    // 랜덤한 이미지 9개 선택
    if (count($files) > 0) {
        $randomFiles = array_rand($files, min(9, count($files)));

        // 선택된 이미지들의 경로를 배열로 반환
        $randomFileUrls = array();
        foreach ((array)$randomFiles as $fileIndex) {
            $randomFileUrls[] = $files[$fileIndex];
        }

        // 결과 배열에 추가
        $allRandomFileUrls[$key] = $randomFileUrls;
    }
}

// 선택된 이미지들의 경로를 JSON 형식으로 반환
echo json_encode($allRandomFileUrls);
?>
