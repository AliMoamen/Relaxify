

## Relaxify - AI-Powered Mental Health Chatbot 

**Relaxify** is an AI-powered chatbot developed to help users manage stress and anxiety. The chatbot provides scientifically grounded advice with empathy and compassion, offering actionable suggestions for managing mental well-being. It is built using **Flask**, and integrates with the **OpenAI GPT-3.5 API** to deliver responses.

### Features
- 🧠 AI-powered mental health chatbot.
- 💬 Provides empathetic, stress-relieving conversations.
- 🔄 Persistent chat history using `localStorage`.
- 🔐 Integration with **OpenAI GPT-3.5** to generate responses.

---

## Demo
You can try the deployed version of Relaxify here:
[https://relaxify-production.up.railway.app/](https://relaxify-production.up.railway.app/)

---

## Technologies

- **Python 3.8+**
- **Flask** - Python web framework.
- **JavaScript** - For front-end interaction and `localStorage` management.
- **HTML/CSS** - For the chatbot interface.
- **OpenAI GPT-3.5 API** - Powers the chatbot's responses.
- **Railway** - Used for deployment.
  
---

## Usage

Once the Flask server is running, you can visit the chatbot in your browser at `http://127.0.0.1:5000`. You can start chatting with Relaxify to get helpful and empathetic responses for stress management.

### Key Features:
- **Clear Chat History**: Click the "Clear History" button to reset the conversation.
- **Persistent Messages**: Chat history is saved locally using `localStorage` and restored when the page is refreshed.
- **Responsive UI**: A clean and intuitive interface for engaging conversations.

---

## API Integration

Relaxify integrates with the **OpenAI GPT-3.5 API** to generate natural language responses. You will need an OpenAI API key, which you can get from [OpenAI's website](https://beta.openai.com/signup/).

The core API interaction happens in `index.py`:

```python
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=messages,
    max_tokens=200,
    temperature=0.4
)
```

- `model`: Specifies the AI model used (`gpt-3.5-turbo`).
- `messages`: Holds the chat history and system prompt for generating responses.
- `max_tokens`: Limits the length of the generated response.
- `temperature`: Controls the randomness of the response.

---

