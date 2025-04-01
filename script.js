document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggler = document.getElementById('chatbot-toggler');
  const closeBtn = document.getElementById('close-btn');
  const sendButton = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const messagesContainer = document.getElementById('chat-messages');

  // Toggle chatbot visibility
  chatbotToggler.addEventListener('click', () => {
    document.body.classList.toggle('show-chatbot');
  });

  closeBtn.addEventListener('click', () => {
    document.body.classList.remove('show-chatbot');
  });

  sendButton.addEventListener('click', sendMessage);

  async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    // Display user's message
    const userMessage = document.createElement('li');
    userMessage.classList.add('chat', 'outgoing');
    userMessage.innerHTML = `<p>${userText}</p>`;
    messagesContainer.appendChild(userMessage);

    // Add loading message below the user message
    const loadingMessage = document.createElement('li');
    loadingMessage.classList.add('chat', 'incoming', 'loading');
    loadingMessage.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>Loading...</p>`;
    messagesContainer.appendChild(loadingMessage);

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Call Google Gemini API
    const botResponse = await askGemini(userText);

    // Remove the loading message
    messagesContainer.removeChild(loadingMessage);

    // Display AI's response
    const botMessage = document.createElement('li');
    botMessage.classList.add('chat', 'incoming');
    botMessage.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${botResponse}</p>`;
    messagesContainer.appendChild(botMessage);

    // Scroll to the latest message
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Clear input field
    userInput.value = '';
  }

  async function askGemini(query) {
    const apiKey = "AIzaSyDpCq9i7JPvHMimjR1c8f03NF_YEF6kRq4"; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
      contents: [{ parts: [{ text: query }] }],
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find an answer.";
    } catch (error) {
      console.error("Error fetching response:", error);
      return "Sorry, something went wrong!";
    }
  }
});
