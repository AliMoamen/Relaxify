from flask import Flask, request, render_template
import openai
from transformers import pipeline
import pandas as pd
import os
Qs = ""
app = Flask(__name__)

# Set up OpenAI API credentials
openai.api_key = os.getenv("API")

# Set up prompt 
messages=[
        {"role": "system", "content": "You are a therapist helping a patient with stress scientifically. Show empathy, sympathesis, and carefulness when dealing with patient. Ask follow up questions for the user and be concise. Only answer questions within the scope of your job. If asked about the job, you are a therapist helping patients dealing with stress and anxiety"},
    ]


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
    global Qs
    Qs += Q
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=200,
        temperature=0.4
    )
    response_text =  response.choices[0]['message']['content']
    messages.append({'role': 'assistant', 'content': response.choices[0]['message']['content']})
    return response_text


@app.route('/emotions')
def emotions():
    MyEmotions = sentiment(Qs)
    MyEmotions = MyEmotions[0][:10]
    New = ""
    for emo in MyEmotions:
        New += str(emo) +"\n"
    return render_template("emotions.html", MyEmotions = New)

def sentiment(text):
    _emotions_model = "joeddav/distilbert-base-uncased-go-emotions-student"

    emotions = pipeline(
        "text-classification",
        model=_emotions_model,
        return_all_scores=True,
    )
    #Call to the function
    results = emotions(text)[0]
    results = sorted(results, reverse=True, key=lambda x: x["score"])
    Result = []
    Keys = []
    Values = []

    for output in results:
        Result.append([output['label'],round(output['score'],2)])
        Keys.append(output['label'])
        Values.append(output['score'])
    df = pd.DataFrame(Result)
    return Result, df, Keys, Values



if __name__ == '__main__':
    app.run(debug=True)
