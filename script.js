document.addEventListener('DOMContentLoaded', () => {
  const chatbotToggler = document.getElementById('chatbot-toggler');
  const closeBtn = document.getElementById('close-btn');
  const sendButton = document.getElementById('send-btn');
  const userInput = document.getElementById('user-input');
  const messagesContainer = document.getElementById('chat-messages');
  const imageUpload = document.getElementById('image-upload');
  const imageIcon = document.getElementById('image-icon');

  // Toggle chatbot visibility
  chatbotToggler.addEventListener('click', () => {
    document.body.classList.toggle('show-chatbot');
  });

  closeBtn.addEventListener('click', () => {
    document.body.classList.remove('show-chatbot');
  });

  sendButton.addEventListener('click', () => sendMessage());
  imageIcon.addEventListener('click', () => imageUpload.click());

  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) sendImage(file);
  });

  async function sendMessage() {
    const userText = userInput.value.trim();
    if (!userText) return;

    displayUserMessage(userText);
    displayLoader();

    const botResponse = await askGemini({ text: userText });

    removeLoader();
    displayBotMessage(botResponse);

    userInput.value = '';
  }

  async function sendImage(file) {
    displayUserMessage(`📷 Image uploaded: ${file.name}`);
    displayLoader();

    const botResponse = await askGemini({ image: file });

    removeLoader();
    displayBotMessage(botResponse);
  }

  async function askGemini({ text, image }) {
    const apiKey = "AIzaSyDpCq9i7JPvHMimjR1c8f03NF_YEF6kRq4";  // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    let requestBody;

    if (image) {
      const base64Image = await convertToBase64(image);
      requestBody = {
        contents: [{ parts: [{ inline_data: { mime_type: image.type, data: base64Image } }] }]
      };
    } else {
      requestBody = {
        contents: [{ parts: [{ text }] }]
      };
    }

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

  function displayUserMessage(message) {
    const userMessage = document.createElement('li');
    userMessage.classList.add('chat', 'outgoing');
    userMessage.innerHTML = `<p>${message}</p>`;
    messagesContainer.appendChild(userMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function displayBotMessage(message) {
    const botMessage = document.createElement('li');
    botMessage.classList.add('chat', 'incoming');
    botMessage.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>`;
    messagesContainer.appendChild(botMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function displayLoader() {
    const loader = document.createElement('li');
    loader.classList.add('chat', 'incoming', 'loading');
    loader.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>Loading...</p>`;
    loader.id = "loading-message";
    messagesContainer.appendChild(loader);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeLoader() {
    const loader = document.getElementById("loading-message");
    if (loader) loader.remove();
  }

  async function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); // Extract base64 data
      reader.onerror = (error) => reject(error);
    });
  }
});
