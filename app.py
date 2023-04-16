from flask import Flask, request, render_template
import openai
from transformers import pipeline
import pandas as pd
Qs = ""
app = Flask(__name__)

# Set up OpenAI API credentials
openai.api_key = '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'

# Set up prompt and engine
history = '''Answer as if you were a doctor helping a patient with stress scientifically. Show empathy, sympathesis, and carefulness when dealing with patient.'''
messages=[
        {"role": "system", "content": "You are a therapist helping a patient with stress scientifically. Show empathy, sympathesis, and carefulness when dealing with patient. Ask follow up questions for the user and be concise"},
    ]
engine = "text-davinci-002"

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
    global history
    global messages
    # history = history + f"\nPerson: {Q}" + "\nDoctor: "
    messages.append({'role': 'user', 'content': Q})
    global Qs
    Qs += Q
    response = openai.ChatCompletion.create(
        # engine=engine,
        model="gpt-3.5-turbo",
        # prompt=history,
        messages=messages,
        max_tokens=200,
        # n=1,
        # stop=None,
        temperature=0.4,
    )
    print(response)
    response_text =  response.choices[0]['message']['content']
    messages.append({'role': 'assistant', 'content': response.choices[0]['message']['content']})
    # history += response.choices[0].text
    return response_text
    # return response.choices[0].text.strip()


@app.route('/emotions')
def emotions():
    MyEmotions = sentiment(Qs)[1]
    return render_template("emotions.html", MyEmotions = MyEmotions)

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
    for output in results:
        Result.append([output['label'],output['score']])
    df = pd.DataFrame(Result)
    print(df)
    return Result, df


if __name__ == '__main__':
    app.run(debug=True)
