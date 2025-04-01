document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();
  
      if (username === "user" && password === "password123") {
        alert("Login successful! Redirecting to chatbot...");
        window.location.href = "index.html";  // Redirect to the chatbot page (make sure you have this file).
      } else {
        errorMessage.textContent = "Invalid username or password. Please try again.";
      }
    });
  });
  