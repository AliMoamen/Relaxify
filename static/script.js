const chatContainer = document.getElementById('chat-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const submitButton = document.getElementById('submit-btn');
let isWaitingForResponse = false; // Track if we're waiting for a response from the bot

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
    scrollToBottom(); // Scroll to the bottom after sending a message

    // Set waiting status to true (disable input while waiting for response)
    isWaitingForResponse = true;
    toggleSubmitButton();

    // Debugging log to ensure the request is being made
    console.log('Sending message to API:', message);

    // Create the XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/chatbot');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // When the response comes back
    xhr.onload = () => {
        if (xhr.status === 200) {
            // Success - process the response
            const response = xhr.responseText;
            console.log('API response:', response); // Debugging log to check the response
            const responseElement = document.createElement('div');
            responseElement.classList.add("bot-message");
            responseElement.innerText = response;
            chatContainer.appendChild(responseElement);
            scrollToBottom(); // Scroll to the bottom after receiving a response
        } else {
            // Handle error responses
            console.error('Error with API call:', xhr.statusText);
            const errorElement = document.createElement('div');
            errorElement.classList.add("bot-message");
            errorElement.innerText = "Oops! Something went wrong. Please try again.";
            chatContainer.appendChild(errorElement);
            scrollToBottom();
        }

        // Reset the flag to allow further submissions
        isWaitingForResponse = false;
        toggleSubmitButton();
    };

    // Handle any errors in making the request
    xhr.onerror = () => {
        console.error('Request failed.');
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