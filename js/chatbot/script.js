$(document).ready(function() {
  const $chatbotToggler = $(".chatbot-toggler");
  const $closeBtn = $(".close-btn");
  const $chatbox = $(".chatbox");
  const $chatInput = $(".chat-input textarea");
  const $sendChatBtn = $(".chat-input span");

  let userMessage = null; // Variable to store user's message
  const inputInitHeight = $chatInput[0].scrollHeight;

  const responses = [
    "지금 다른 조 상담 중이라 조금만 기다려줄래?",
    "아직 구현이 안 되어 있어!"
  ];

  const createChatLi = (message, className) => {
    const $chatLi = $("<li>").addClass("chat").addClass(className);
    const chatContent = className === "outgoing"
      ? "<p></p>"
      : '<img src="img/chatbot/ch.png" alt="smart_toy" style="width: 35px; height: 35px;"><p></p>';
    $chatLi.html(chatContent);
    $chatLi.find("p").text(message);
    return $chatLi;
  };

  const generateResponse = (chatElement) => {
    const $messageElement = $(chatElement).find("p");

    // Simulate a random response after a brief delay
    setTimeout(() => {
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      $messageElement.text(randomResponse);
      $chatbox.scrollTop($chatbox[0].scrollHeight);
    }, 1000);
  };

  const handleChat = () => {
    userMessage = $chatInput.val().trim(); // Get user entered message and remove extra whitespace
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    $chatInput.val("");
    $chatInput.height(inputInitHeight);

    // Append the user's message to the chatbox
    $chatbox.append(createChatLi(userMessage, "outgoing"));
    $chatbox.scrollTop($chatbox[0].scrollHeight);

    // Remove previous "Thinking..." message if present, then add new response
    setTimeout(() => {
      const $existingThinkingMessage = $chatbox.find(".incoming");
      if ($existingThinkingMessage.length) {
        $existingThinkingMessage.remove(); // Remove the old "Thinking..." message
      }

      const $incomingChatLi = createChatLi("Thinking...", "incoming");
      $chatbox.append($incomingChatLi);
      $chatbox.scrollTop($chatbox[0].scrollHeight);
      generateResponse($incomingChatLi);
    }, 600);
  };

  $chatInput.on("input", () => {
    // Adjust the height of the input textarea based on its content
    $chatInput.height(inputInitHeight);
    $chatInput.height($chatInput[0].scrollHeight);
  });

  $chatInput.on("keydown", (e) => {
    // Prevent default behavior for Enter key and only handle chat when Enter is pressed
    if (e.key === "Enter" && !e.shiftKey && $(window).width() > 800) {
      e.preventDefault();
      handleChat();
    }
  });

  // Fixing the double input issue by handling input more efficiently
  $sendChatBtn.on("click", handleChat);
  $closeBtn.on("click", () => $("body").removeClass("show-chatbot"));
  $chatbotToggler.on("click", () => $("body").toggleClass("show-chatbot"));
});
