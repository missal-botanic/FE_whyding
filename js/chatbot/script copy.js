$(document).ready(function () {
  const $chatbotToggler = $(".chatbot-toggler");
  const $closeBtn = $(".close-btn");
  const $imageUpload = $("#image-upload");
  const $chatbox = $(".chatbox");

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
      const $thinkingMessage = createChatLi("Thinking...", "incoming", null, "img/chatbot/ch.png");
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
      const sortedTags = Object.entries(tags)
        .sort(([, valueA], [, valueB]) => valueB - valueA)
        .map(([key]) => key)
        .slice(0, 5);

      const tagString = sortedTags.join(", ");

      // Thinking 메시지 제거 후 응답 메시지 표시
      $thinkingMessage.remove();
      const $responseMessage = createChatLi(
        `이 이쁜 그림에 들어간 태그는 '${tagString}' 이야!`,
        "incoming",
        null,
        "img/chatbot/ch.png"
      );
      $chatbox.append($responseMessage);
      $chatbox.scrollTop($chatbox[0].scrollHeight);
    }
  });
});