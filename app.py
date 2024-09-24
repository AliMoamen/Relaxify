from flask import Flask, request, render_template
from openai import OpenAI
import os

# Initialize the global variables
messages = [
 {"role": "system", "content": "You are a compassionate and empathetic therapist who specializes in helping people manage stress and anxiety. Your responses should be supportive, understanding, and scientifically grounded. You should guide the conversation with thoughtful, open-ended questions, encourage the user to share more about their feelings, and offer concise advice. Your goal is to create a safe and non-judgmental space for the user to express themselves, while providing actionable suggestions and encouragement based on the principles of stress management. You should strictly stick to your role as a therapist and politely decline to answer any questions or provide assistance on topics outside your scope, such as programming, technical tasks, or unrelated topics."}
]

app = Flask(__name__)

# Set up OpenAI API credentials
client = OpenAI(
    api_key= os.getenv("API")
)

# Define route for homepage
@app.route('/')
def home():
    return render_template('index.html')

# Define route for chatbot
@app.route('/chatbot', methods=['POST'])
def chatbot():
    message = request.form['message']
    response = ask(message)
    return response

# Define function to generate response using OpenAI API
def ask(Q):
    global messages
    messages.append({'role': 'user', 'content': Q})
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=200,
        temperature=0.4
    )
    response_text = response.choices[0].message.content
    messages.append({'role': 'assistant', 'content': response_text})
    return response_text
# Route to reset chat history and Qs variable
@app.route('/new_chat', methods=['POST'])
def new_chat():
    global messages
    messages = [
    {"role": "system", "content": "You are a compassionate and empathetic therapist who specializes in helping people manage stress and anxiety. Your responses should be supportive, understanding, and scientifically grounded. You should guide the conversation with thoughtful, open-ended questions, encourage the user to share more about their feelings, and offer concise advice. Your goal is to create a safe and non-judgmental space for the user to express themselves, while providing actionable suggestions and encouragement based on the principles of stress management. You should strictly stick to your role as a therapist and politely decline to answer any questions or provide assistance on topics outside your scope, such as programming, technical tasks, or unrelated topics."}
    ]
    return "Chat reset", 200

# New route to load the chat history and append to the messages list
@app.route('/load_chat_history', methods=['POST'])
def load_chat_history():
    global messages
    data = request.json  # Receive the JSON data from the frontend
    if 'chatHistory' in data:
        chat_history = data['chatHistory']
        
        # Loop through the chat history and append it to the messages list
        for chat in chat_history:
            if chat['type'] == 'user':
                messages.append({'role': 'user', 'content': chat['message']})
            else:
                messages.append({'role': 'assistant', 'content': chat['message']})
        
        return "Chat history loaded successfully", 200
    else:
        return "No data received", 400

if __name__ == '__main__':
    app.run(debug=True)
