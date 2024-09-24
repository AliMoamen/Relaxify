const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit-btn');
const newChatButton = document.getElementById('new-chat-btn'); // Button for starting new chats
let isWaitingForResponse = false; // Track if we're waiting for a response from the bot
let chatHistory = []; // Store the chat history


window.onload = function() {
    const savedChat = localStorage.getItem('relaxifyChatHistory');
    if (savedChat) {
        // Parse the saved chat history from localStorage
        const chatHistory = JSON.parse(savedChat);

        // Send the chat history to the server
        fetch('/load_chat_history', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatHistory: chatHistory })  // Send the entire chat history to the server
        })
        .then(response => response.text())
        .then(data => {
            console.log('Chat history loaded on server:', data);  // Confirm the chat history has been sent
        })
        .catch(error => {
            console.error('Error sending chat history to the server:', error);
        });

        // Render the chat history on the page
        chatHistory.forEach(chat => {
            const messageElement = document.createElement('div');
            messageElement.classList.add(chat.type === 'user' ? 'user-message' : 'bot-message');
            messageElement.innerText = chat.message;
            chatContainer.appendChild(messageElement);
        });

        // Scroll to the bottom to see the last message
        scrollToBottom(); 
    }
};

// Function to scroll to the bottom of the chat container
function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Disable the submit button if the input is empty or while waiting for a response
function toggleSubmitButton() {
    if (messageInput.value.trim() === "" || isWaitingForResponse) {
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#ccc"; // Change the button style when disabled
    } else {
        submitButton.disabled = false;
        submitButton.style.backgroundColor = "#5cb85c"; // Restore the button style
    }
}

// Check the input every time it changes
messageInput.addEventListener('input', toggleSubmitButton);

messageForm.addEventListener('submit', e => {
    e.preventDefault();

    // If we're already waiting for a response, prevent further submissions
    if (isWaitingForResponse) return;

    const message = messageInput.value.trim();
    if (message === "") return; // Prevent submission if the input is empty

    // Clear the input field and disable the submit button
    messageInput.value = '';
    toggleSubmitButton();

    const messageElement = document.createElement('div');
    messageElement.classList.add("user-message");
    messageElement.innerText = message;
    chatContainer.appendChild(messageElement);
    chatHistory.push({ type: 'user', message: message }); // Save user message to history
    scrollToBottom(); // Scroll to the bottom after sending a message

    // Save the chat history to local storage
    localStorage.setItem('relaxifyChatHistory', JSON.stringify(chatHistory));

    // Set waiting status to true (disable input while waiting for response)
    isWaitingForResponse = true;
    toggleSubmitButton();

    // Create the XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/chatbot');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // When the response comes back
    xhr.onload = () => {
        if (xhr.status === 200) {
            // Success - process the response
            const response = xhr.responseText;
            const responseElement = document.createElement('div');
            responseElement.classList.add("bot-message");
            responseElement.innerText = response;
            chatContainer.appendChild(responseElement);
            chatHistory.push({ type: 'bot', message: response }); // Save bot response to history
            scrollToBottom(); // Scroll to the bottom after receiving a response
        } else {
            // Handle error responses
            const errorElement = document.createElement('div');
            errorElement.classList.add("bot-message");
            errorElement.innerText = "Oops! Something went wrong. Please try again.";
            chatContainer.appendChild(errorElement);
            scrollToBottom();
        }

        // Save the chat history to local storage
        localStorage.setItem('relaxifyChatHistory', JSON.stringify(chatHistory));

        // Reset the flag to allow further submissions
        isWaitingForResponse = false;
        toggleSubmitButton();
    };

    // Handle any errors in making the request
    xhr.onerror = () => {
        const errorElement = document.createElement('div');
        errorElement.classList.add("bot-message");
        errorElement.innerText = "There was an issue connecting to the server.";
        chatContainer.appendChild(errorElement);
        scrollToBottom();

        // Reset the flag to allow further submissions
        isWaitingForResponse = false;
        toggleSubmitButton();
    };

    // Send the request
    xhr.send('message=' + encodeURIComponent(message));
});

// Handle the new chat button click
newChatButton.addEventListener('click', (event) => {
    event.preventDefault()
    fetch('/new_chat', { method: 'POST' })
        .then(response => {
            if (response.ok) {
                // Clear the chat container
                chatContainer.innerHTML = '';
                chatHistory = [];  // Clear the chat history stored in the frontend
                localStorage.removeItem('relaxifyChatHistory');  // Clear saved chats in local storage
            }
        })
        .catch(err => console.error('Failed to reset the chat:', err));
});
