#!/usr/bin/python3

import json
import urllib.request
import urllib.error

def call_llm(api_key, messages, model="deepseek-chat", stream=False):
  url = "https://api.deepseek.com/chat/completions"
  headers = {
      "Content-Type": "application/json",
      "Authorization": f"Bearer {api_key}"
  }
  data = {
      "model": model,
      "messages": messages,
      "stream": stream
  }

  req = urllib.request.Request(
    url,
    data=json.dumps(data).encode('utf-8'),
    headers=headers,
    method="POST"
  )

  try:
    with urllib.request.urlopen(req) as response:
      return json.loads(response.read().decode('utf-8'))
  except urllib.error.URLError as e:
    return {"error": str(e)}

def main():
  api_key = "sk-4a46a2aa2f494f26bfbc79ba91072af2"
  sentence = input("Enter a sentence to classify: ")

  prompt = f'''
Given a sentence, classify it into one or more of the following pragmatic English sentence types based on its primary function(s) in context:

- Declaratives: Utterances whose primary function is to make statements. Example: "The sky is blue."  
- Interrogatives: Utterances whose primary function is to ask questions. Example: "What time is it?"  
- Imperatives: Utterances whose primary function is to issue commands or requests. Example: "Close the door."  
- Exclamatories: Utterances whose primary function is to express strong emotions. Example: "Do not sit there!"  
- Optatives: Utterances whose primary function is to express wishes. Example: "I wish you were here."  
- Performatives: Utterances whose primary function is to perform an action by stating it. Example: "I apologize for being late."  
- Hortatives: Utterances whose primary function is to encourage joint action, often starting with "Let's do that". Example: "Let's go to the park."  

Consider that a sentence may belong to multiple sets due to context or multifunctionality or none at all, because is not an English sentence or is a malformed sentence, or not a sentence at all. Provide your classification as JSON. Use the following JSON scheme: {{"sentence":<input-sentence>,"sets":[<set-name-initial>],"comment":<shot-comment>}}.

Examples:
Input: "The sky is blue."
Output: {{"sentence":"The sky is blue.", "sets":["D"], "comment":"pure declarative (statement)"}}

Input: "I protest!"
Output: {{"sentence":"I protest!", "sets":["E", "P"], "comment":"performs objection, exclaimed"}}

Input: "44 oubw foui"
Output: {{"sentence":"44 oubw foui", "sets":NULL, "comment":"Not a sentence"}}

Input: "{sentence}"
Output:
'''

  messages = [
    {"role": "system", "content": "You are an linguistics assistant that helps to classify sentences."},
    {"role": "user", "content": prompt}
  ]

  result = call_llm(api_key, messages)

  if "error" in result:
    print("Error:", result["error"])
  else:
    classification = result["choices"][0]["message"]["content"]
    print(classification)

if __name__ == "__main__":
  main()