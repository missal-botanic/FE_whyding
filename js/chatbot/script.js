$(document).ready(function () {
  const $chatbotToggler = $(".chatbot-toggler");
  const $closeBtn = $(".close-btn");
  const $imageUpload = $("#image-upload");
  const $chatbox = $(".chatbox");
  const $textArea = $('#exampleFormControlTextarea1'); // 텍스트 영역 참조

  // 챗봇 열기/닫기 기능
  $chatbotToggler.on("click", () => $("body").toggleClass("show-chatbot"));
  $closeBtn.on("click", () => $("body").removeClass("show-chatbot"));

  // 이미지 파일을 base64로 변환하는 함수
  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Base64 데이터 추출
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // 채팅 항목 생성 함수
  const createChatLi = (message, className, image = null, avatar = null) => {
    const $chatLi = $("<li>").addClass("chat").addClass(className);

    if (avatar) {
      $chatLi.append(
        `<img src="${avatar}" alt="avatar" style="width: 35px; height: 35px;">`
      );
    }

    if (image) {
      $chatLi.append(` 
        <p>
          <img src="${image}" alt="uploaded-image" style="max-width: 100px; max-height: 100px; display: block;">
          ${message}
        </p>
      `);
    } else {
      $chatLi.append(`<p>${message}</p>`);
    }

    return $chatLi;
  };

  // 이미지 업로드 이벤트 처리
  $imageUpload.on("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64Image = await toBase64(file);
      const previewImage = URL.createObjectURL(file);

      // 사용자가 업로드한 이미지를 채팅창에 표시
      $chatbox.append(createChatLi("", "outgoing", previewImage));
      $chatbox.scrollTop($chatbox[0].scrollHeight);

      // "Thinking..." 메시지 표시
      const $thinkingMessage = createChatLi("이미지를 분석중야...", "incoming", null, "img/chatbot/ch.png");
      $chatbox.append($thinkingMessage);
      $chatbox.scrollTop($chatbox[0].scrollHeight);

      // API 요청
      const response = await fetch("https://tagger.bluest-dealers0m.workers.dev/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: base64Image,
          model: "wd-v1-4-moat-tagger.v2",
          threshold: 0.1,
        }),
      });

      const data = await response.json();
      const tags = data.caption.tag;
      
      // 태그들을 내림차순으로 정렬하고, 상위 20개 태그를 가져옵니다.
      const sortedTags = Object.entries(tags)
        .sort(([, valueA], [, valueB]) => valueB - valueA)
        .map(([key]) => key)
        .slice(0, 20);
      
      // 특정 단어들을 제외할 배열을 정의합니다.
      const excludedTags = ['no humans', 'chinese clothes', 'see-through']; // 예시로 제외할 단어들
      
      // 태그 문자열 생성
      let tagString = sortedTags.join(", ");
      
      // 언더스코어를 공백으로 교체
      tagString = tagString.replace(/_/g, " ");
      
      // 제외할 단어들을 필터링합니다.
      tagString = tagString
        .split(", ")  // 문자열을 배열로 변환
        .filter(tag => !excludedTags.includes(tag))  // 제외할 단어를 필터링
        .join(", ");  // 다시 문자열로 합칩니다.

      // 랜덤 메시지 생성
      const responses = [
        `이 사진에 들어간 주요 태그는 ' ${tagString} '입니다. 이 태그들을 사용하면 더욱 멋진 웨딩 사진을 찾을 수 있어요!`,
        `오! 이 웨딩 사진의 프롬프트는 ' ${tagString} '으로 넣으면 비슷한 사진을 찾아볼 수 있을 거예요!`,
        `이 아름다운 웨딩 사진에서 대표적으로 사용할 태그는 ' ${tagString} '입니다.`,
        `이 사진을 보니, ' ${tagString} '와 관련된 태그가 딱 어울려요. 다른 사진에서도 이런 느낌을 찾을 수 있겠네요.`,
        `내가 보기엔 이 웨딩 사진에는 ' ${tagString} ' 태그가 정말 잘 맞는 것 같아요. 같은 느낌을 원하시면 이 태그들을 활용해 보세요!`,
        `이 멋진 결혼식 장면에서 ' ${tagString} ' 태그는 꼭 필요해요! 정말 로맨틱한 분위기를 잘 표현한 것 같아요.`,
        `이 웨딩 사진에는 ' ${tagString} ' 태그가 들어간다면, 완벽한 프롬프트가 될 거예요! 더욱 감동적인 순간을 포착한 사진이죠.`,
        `여기 있는 웨딩 사진에 ' ${tagString} ' 태그를 넣으면, 더 많은 결혼식 테마 사진을 찾을 수 있어요. 완벽한 선택!`,
        `이 사진을 보니, ' ${tagString} ' 태그가 잘 어울려요. 이 태그를 활용하면 결혼식 분위기에 맞는 사진을 찾을 수 있을 거예요.`,
        `이 웨딩 사진을 바탕으로 ' ${tagString} ' 태그를 입력하면 더욱 달콤한 결혼식 사진을 찾아볼 수 있을 거예요!`,
        `이 아름다운 결혼식 사진에 ' ${tagString} ' 태그를 추가하면 비슷한 스타일의 사진을 더욱 쉽게 찾을 수 있을 거예요.`
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      // Thinking 메시지 제거 후 응답 메시지 표시
      $thinkingMessage.remove();
      const $responseMessage = createChatLi(randomResponse, "incoming", null, "img/chatbot/ch.png");
      $chatbox.append($responseMessage);
      $chatbox.scrollTop($chatbox[0].scrollHeight);

      // "바로입력" 버튼 추가
      const $button = $('<button class="btn btn-link btn-sm">적용</button>');
      $responseMessage.append($button);

      // 버튼 클릭 시 textarea에 내용 추가ㅁ
      $button.on('click', function() {
        $textArea.val((i, val) => `${val} ${tagString} man`);
        $("body").toggleClass("show-chatbot")
      });
    }
  });
});
