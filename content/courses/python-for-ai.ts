// Python & Foundations for Generative AI — Basic → Intermediate → Advanced (19 topics)
// Extracted verbatim from python_for_AI.docx (Course 1 of 9, Generative AI domain).
// Diagrams served from /public/python_for_AI_images/image_*.png
// Course id: "python-for-ai"  →  registered in content/index.ts
//
// Create these in the super-admin UI (/super-admin/courses); lesson `order` is
// global across the course, so it must match the keys below exactly.
//
//   Basic         — Foundations every GenAI developer needs before writing a line of AI code.
//     1  Python Programming Essentials
//     2  Python for Data & APIs
//     3  Math & Statistics Foundations
//     4  Intro to ML & NLP Basics
//     5  Neural Network Fundamentals
//     6  Tooling, Environments & Compute
//     7  Bridge to GenAI: Math + Development Setup
//   Intermediate  — Applying Python professionally: real SDKs, data pipelines, and project structure.
//     8  Python for LLM Applications
//     9  Data Handling for AI Applications
//    10  API & JSON Fundamentals
//    11  Git & Project Structure
//    12  Virtual Environments & Package Management
//    13  GPU/CPU Compute Basics
//   Advanced      — Production-grade patterns: async, resilience, testing, secrets, and performance.
//    14  Production Python Patterns for AI
//    15  Async Programming for AI APIs
//    16  API Integration Patterns
//    17  Testing & Debugging AI Applications
//    18  Environment & Secret Management
//    19  Performance-Aware AI Development

const pythonForGenAIContent: Record<number, string> = {
1: `# TOPIC 1: Python Programming Essentials

Python is the primary programming language used across almost all of Generative AI — from calling LLM APIs to building RAG pipelines to fine-tuning models. Nearly every major GenAI framework (LangChain, LangGraph, LlamaIndex, Hugging Face Transformers) is written in Python and designed to be used from Python. This topic revisits the fundamentals you will use constantly throughout the rest of this course.

:::definition
**Python**
Python is a high-level, interpreted programming language known for its simple, readable syntax. It is the dominant language in the AI/ML ecosystem because of its extensive libraries (NumPy, Pandas, PyTorch, LangChain, etc.), gentle learning curve, and speed of prototyping.
:::

:::insight
**Why This Matters**
Almost every GenAI tutorial, research paper's reference implementation, and production framework assumes Python. Weak Python fundamentals are the single biggest reason learners get stuck later when reading LangChain or Hugging Face source code.
:::

## 1.1 Variables and Core Data Types

Python variables do not need explicit type declarations — the type is inferred automatically at runtime. The core built-in types you will use constantly when working with AI APIs are:
- str — text, e.g. a prompt, a model name, or an API response
- int and float — numeric settings such as max_tokens (int) or temperature (float)
- bool — flags such as is_streaming or stream=True
- list — ordered collections, e.g. a list of chat messages
- dict — key-value data, e.g. a JSON request/response body
- tuple and set — less common, but tuples are used for fixed-size records and sets for deduplication

**Example — Core Data Types in an AI Config**

\`\`\`python
model_name = "gpt-4o"          # str
max_tokens = 512                # int
temperature = 0.7               # float
is_streaming = True             # bool
messages = ["system", "user"]   # list
config = {"top_p": 0.9, "n": 1} # dict

print(type(temperature))        # <class 'float'>
print(f"Model: {model_name}, Temp: {temperature}")
\`\`\`

**Explanation**
- model_name stores text, so Python infers it as a str.
- temperature stores a decimal number, so it becomes a float — this matters because LLM API parameters like temperature and top_p must be sent as floats in the request JSON, not strings.
- An f-string (f"...") lets you embed variables directly inside a string using curly braces {} — this is the standard way prompts are built dynamically in Python.

:::mistake
A very common bug: sending temperature="0.7" (a string) instead of temperature=0.7 (a float) when building a request dictionary manually. Some APIs silently coerce this; others reject the request with a validation error.
:::

## 1.2 Control Flow — if / for / while

Control flow statements let your program make decisions and repeat actions — essential when looping through API responses, retrying failed requests, or processing a batch of documents one at a time.

**Example — A Retry Loop Pattern (used constantly with LLM APIs)**

\`\`\`python
max_retries = 3
attempt = 0
success = False

while attempt < max_retries and not success:
    attempt += 1
    try:
        response = call_llm_api()   # assume defined elsewhere
        success = True
    except Exception as e:
        print(f"Attempt {attempt} failed: {e}")

if success:
    print("Request succeeded")
else:
    print("All retries exhausted")
\`\`\`

**Explanation**
- This is the exact shape of the retry logic used in almost every production LLM client — APIs occasionally time out or rate-limit, so retrying inside a loop with try/except is standard practice.
- The while loop keeps trying until either success becomes True or max_retries is reached, whichever happens first.

## 1.3 Functions

Functions package reusable logic so you don't repeat yourself. In AI applications, you will constantly write small functions to format prompts, parse responses, or wrap API calls behind a clean interface.

**Example — A Reusable Prompt-Formatting Function**

\`\`\`python
def build_prompt(user_question: str, context: str = "") -> str:    """Builds a simple RAG-style prompt from a question and optional context."""
    if context:
        return f"Context:\\n{context}\\n\\nQuestion: {user_question}\\nAnswer:"
    return f"Question: {user_question}\\nAnswer:"

prompt = build_prompt(
    "What is RAG?",
    context="RAG stands for Retrieval-Augmented Generation.",
)
print(prompt)
\`\`\`

Output

\`\`\`text
Context:
RAG stands for Retrieval-Augmented Generation.

Question: What is RAG?
Answer:
\`\`\`

:::note
Type hints (user_question: str, -> str) don't change how Python runs the code, but they document expected types clearly — this is standard practice in professional AI codebases and lets tools like Pydantic and FastAPI validate data automatically, which you'll use heavily at the Advanced level.
:::

## 1.4 Classes & Objects (OOP Basics)

Object-Oriented Programming lets you bundle data and behavior together into a single unit called an object. Most LLM SDKs (OpenAI, Anthropic, LangChain) are built around classes — you will constantly instantiate client objects and call their methods, so recognizing the pattern is essential.

**Example — A Simple Chat Session Class**

\`\`\`python
class ChatSession:    def __init__(self, system_prompt: str):
        self.system_prompt = system_prompt
        self.history = []

    def add_message(self, role: str, content: str):
        self.history.append({"role": role, "content": content})

    def get_messages(self):
        return [{"role": "system", "content": self.system_prompt}] + self.history

session = ChatSession("You are a helpful assistant.")
session.add_message("user", "Hello!")
print(session.get_messages())
\`\`\`

**Explanation**
- __init__ is the constructor — it runs automatically when ChatSession(...) is called, setting up the object's starting state.
- self refers to the specific object instance, letting each ChatSession keep its own independent history — you could create session_a and session_b and their histories would never mix.
- This exact pattern — a class managing a growing list of conversation turns — is the foundation of essentially every chat application you will build with LLMs later in this course.

![Figure 1.1 — Python sits at the center of the GenAI tooling ecosystem, connecting data libraries, web frameworks, and AI/ML libraries into working applications.](/python_for_AI_images/image_1.png)

**Figure 1.1** — Python sits at the center of the GenAI tooling ecosystem, connecting data libraries, web frameworks, and AI/ML libraries into working applications.

:::tip
Practice writing small, single-purpose functions and simple classes. Nearly every GenAI framework you'll encounter later (LangChain, LangGraph, LlamaIndex) is just Python functions and classes composed together — strong fundamentals here pay off everywhere else in this course.
:::`,

2: `# TOPIC 2: Python for Data & APIs

Generative AI applications constantly move data around: reading source files, calling REST APIs over the internet, and parsing the responses that come back. This topic covers the everyday Python tools for exactly that.

## 2.1 Working with Files

Most GenAI pipelines start by reading raw content — text files, PDFs, transcripts — that will later be cleaned, chunked, and embedded for retrieval (covered in depth in Course 5).

**Example — Reading a Text File for RAG Ingestion**

\`\`\`python
with open("policy_document.txt", "r", encoding="utf-8") as f:
    text = f.read()

print(f"Loaded {len(text)} characters")
print(text[:120])   # preview the first 120 characters
\`\`\`

:::note
Always use the \`with\` statement when opening files. It automatically closes the file even if an error occurs partway through — this prevents resource leaks in long-running AI services that process thousands of documents.
:::

## 2.2 Making HTTP Requests

Almost every LLM provider (OpenAI, Anthropic, Cohere, Hugging Face) exposes a REST API. The \`requests\` library is the most common way to call these APIs directly in Python, before you move on to official SDKs at the Intermediate level.
Syntax

\`\`\`python
requests.post(url, headers=None, json=None, params=None, timeout=None)
\`\`\`

| Parameter | Type | Purpose |
|---|---|---|
| url | string | The API endpoint to call |
| headers | dict | Auth tokens, content-type, etc. |
| json | dict | Request body, auto-serialized to JSON |
| timeout | float (seconds) | Prevents the request from hanging forever |

**Example — Calling a REST API Directly**

\`\`\`python
import requests

url = "https://api.example.com/v1/chat"
headers = {"Authorization": "Bearer YOUR_API_KEY"}
payload = {"model": "gpt-4o", "messages": [{"role": "user", "content": "Hi"}]}

response = requests.post(url, headers=headers, json=payload, timeout=30)
print(response.status_code)
print(response.json())
\`\`\`

**Explanation**
- response.status_code tells you if the call succeeded (200) or failed (4xx = client error, 5xx = server error).
- response.json() automatically parses the JSON response body into a Python dictionary you can index into directly.
- Always set a timeout — without one, a slow or hung API can freeze your entire application, which is especially damaging in a service handling many concurrent users.

:::mistake
Never hardcode an API key directly in a string like the example above does for illustration. You'll learn the correct approach (environment variables) later in this same topic level, and in depth in the Advanced level's Environment & Secret Management topic.
:::

![Figure 2.1 — The request/response cycle when calling an LLM API over HTTP: your client sends a JSON request body and receives a JSON response back.](/python_for_AI_images/image_2.png)

**Figure 2.1** — The request/response cycle when calling an LLM API over HTTP: your client sends a JSON request body and receives a JSON response back.`,

3: `# TOPIC 3: Math & Statistics Foundations

You don't need a PhD in mathematics to build with GenAI, but a working understanding of vectors, probability, and basic statistics makes concepts like embeddings, attention, and token sampling far easier to reason about instead of feeling like a black box.

:::definition
**Vector**
A vector is an ordered list of numbers representing a point or direction in space, e.g. [0.12, -0.48, 0.91]. In GenAI, text, images, and audio are all converted into vectors (embeddings) so models can process them mathematically and compare them for similarity.
:::

## 3.1 Vectors and Similarity

The dot product measures how aligned two vectors are, and cosine similarity normalizes this into a score between -1 and 1. This single idea is the mathematical basis of every similarity search used in RAG systems and vector databases.

**Example — Computing Similarity with NumPy**

\`\`\`python
import numpy as np
 query_vec = np.array([0.2, 0.8, 0.1])
doc_vec_a = np.array([0.19, 0.79, 0.15])   # very similar direction
doc_vec_b = np.array([-0.9, 0.1, 0.3])     # very different direction

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

print(cosine_similarity(query_vec, doc_vec_a))  # close to 1.0
print(cosine_similarity(query_vec, doc_vec_b))  # close to 0, or negative
\`\`\`

**Explanation**
- Cosine similarity ranges from -1 (opposite direction) to 1 (identical direction); 0 means the vectors are unrelated (orthogonal).
- This exact function is what vector databases (Pinecone, Chroma, FAISS, pgvector) run internally, potentially millions of times per query, to find the most relevant documents for a search.

## 3.2 Probability and the Softmax Function

Language models don't output a single deterministic 'answer' — they output a probability distribution over the entire vocabulary for what the next token might be. The softmax function is what converts a model's raw internal scores (called logits) into probabilities that sum to exactly 1.

**Example — Softmax From Scratch**

\`\`\`python
import numpy as np

def softmax(logits):
    exp_scores = np.exp(logits - np.max(logits))  # subtract max for numerical stability
    return exp_scores / exp_scores.sum()
logits = np.array([2.0, 1.0, 0.1])   # raw scores for 3 candidate next tokens
probs = softmax(logits)
print(probs)          # e.g. [0.659, 0.242, 0.099]
print(probs.sum())    # 1.0
\`\`\`

:::note
Every time an LLM picks the next token, it is sampling from a softmax probability distribution over its entire vocabulary. The \`temperature\` parameter you pass to an API directly reshapes this distribution — low temperature sharpens it toward the highest-probability token (more deterministic, focused output), while high temperature flattens it, making lower-probability tokens more likely to be chosen (more random, creative output).
:::

## 3.3 Mean, Variance, and Why They Matter

Basic descriptive statistics show up constantly when evaluating GenAI systems — for example, when measuring average response latency, the spread of evaluation scores across a test set, or how consistent a model's outputs are across repeated runs.

| Statistic | What It Tells You | GenAI Example |
|---|---|---|
| Mean (average) | The central, typical value | Average latency of 100 API calls |
| Standard deviation | How spread out values are | How consistent response quality scores are across a test set |
| Percentile (e.g. p95) | The value below which X% of data falls | p95 latency — used for SLAs, since it captures the slow tail, not just the average |

:::insight
**Why This Matters**
Production AI teams almost always report p95 or p99 latency rather than just the average — a model that's fast 95% of the time but occasionally takes 10 seconds will frustrate users even if its average looks fine.
:::`,

4: `# TOPIC 4: Intro to ML & NLP Basics

:::definition
**Machine Learning**
Machine Learning is a field of AI where a system learns patterns from data instead of being explicitly programmed with hand-written rules. It improves at a task through exposure to examples rather than through step-by-step instructions.
:::

## 4.1 Types of Machine Learning

| Type | Description | Example |
|---|---|---|
| Supervised Learning | Learns from labeled input-output pairs | Spam email classification |
| Unsupervised Learning | Finds patterns in unlabeled data | Customer segmentation, clustering |
| Reinforcement Learning | Learns via rewards/penalties from actions taken in an environment | RLHF, used to align chat models with human preferences |

Large Language Models are trained using a combination of these approaches: an initial supervised-style stage (predicting the next word across huge amounts of text) followed by reinforcement learning from human feedback (RLHF) to align the model's behavior with what people actually find helpful and safe.

## 4.2 What is NLP?

:::definition
**Natural Language Processing (NLP)**
NLP is the branch of AI focused on enabling computers to understand, interpret, and generate human language. Generative AI language models are, at their core, advanced NLP systems.
:::

Classic NLP pipelines built before the deep learning era involved many separate, manually engineered steps: tokenization, stemming (reducing words to their root form), part-of-speech tagging, and rule-based grammar parsing. Each step was its own small model or rule set, and errors in early steps compounded through the pipeline.
Modern LLMs collapse almost this entire pipeline into a single trained neural network. Instead of separate tokenizers, taggers, and parsers built by different teams, one transformer model (covered in depth in Course 3) learns to handle tokenization, grammar, meaning, and generation together, trained end-to-end on massive text datasets.

## 4.3 Classical NLP vs. Modern LLMs

| Aspect | Classical NLP (pre-2017) | Modern LLMs |
|---|---|---|
| Architecture | Separate rule-based / statistical components | Single trained transformer neural network |
| Feature engineering | Manual — humans design features | Learned automatically from data |
| Generalization | Narrow — tuned per task | Broad — one model handles many tasks via prompting |
| Typical use today | Lightweight, low-latency specific tasks | General-purpose reasoning, generation, chat |

:::note
You will still encounter lightweight classical NLP techniques (like simple keyword matching or regex-based extraction) inside modern GenAI systems — for example, as a fast pre-filter before an expensive LLM call, or in guardrails that flag banned words. Classical NLP isn't obsolete; it's now often a supporting layer around the LLM rather than the whole system.
:::`,

5: `# TOPIC 5: Neural Network Fundamentals

:::definition
**Neural Network**
A neural network is a computational model loosely inspired by the brain, made of layers of connected 'neurons.' Each connection has a weight; the network learns by gradually adjusting these weights to reduce prediction error on training data.
:::

![Figure 5.1 — A simple feed-forward neural network with an input layer, two hidden layers, and an output layer. Every line represents a weighted connection.](/python_for_AI_images/image_3.png)

**Figure 5.1** — A simple feed-forward neural network with an input layer, two hidden layers, and an output layer. Every line represents a weighted connection.

## 5.1 Layers, Weights, and Activation Functions

Data flows through a network layer by layer. At each neuron, incoming values are multiplied by learned weights, summed together with a bias term, and then passed through an activation function that introduces non-linearity — without this non-linearity, stacking many layers would mathematically collapse into the same power as a single layer.

**Example — A Single Neuron in Plain Python**

\`\`\`python
import numpy as np

def relu(x):
    return np.maximum(0, x)

inputs = np.array([1.0, 0.5, -1.2])
weights = np.array([0.4, -0.6, 0.3])
bias = 0.1

z = np.dot(inputs, weights) + bias
output = relu(z)
print(f"Weighted sum: {z:.3f}, Neuron output: {output:.3f}")
\`\`\`

**Explanation**
- z is the weighted sum plus bias — the neuron's 'raw signal' before activation.
- ReLU (Rectified Linear Unit) zeroes out negative values and passes positive values through unchanged — it is the most common activation function used in modern deep learning because it's simple and fast to compute.
- Stacking millions of neurons like this, arranged into layers and connected in specific patterns, is what forms the transformer architecture behind every modern LLM (studied in depth in Course 3).

## 5.2 Training: Loss and Gradient Descent

Training a network means repeatedly cycling through three steps: (1) make a prediction, (2) measure how wrong it is using a loss function, and (3) adjust every weight slightly in the direction that reduces that loss — a process called gradient descent, repeated over and over across many examples.

| Term | Plain-English Meaning |
|---|---|
| Loss function | A single number measuring how wrong a prediction was |
| Gradient | The direction and size of the change needed to reduce the loss |
| Learning rate | How big a step to take when updating weights each round |
| Epoch | One complete pass through the entire training dataset |

:::note
You will not typically train a neural network from scratch when building GenAI applications — but understanding this predict → measure loss → update weights loop is essential background for understanding fine-tuning, which you'll study in depth in Course 7.
:::`,

6: `# TOPIC 6: Tooling, Environments & Compute

Before writing GenAI code, you need a properly configured development environment. This topic covers the essential everyday tools every AI developer relies on, and how to reason about which compute (CPU vs GPU, local vs cloud) a given task actually needs.

## 6.1 Package Management with pip

Python projects depend on external libraries. \`pip\` is Python's standard package manager for installing, listing, and removing these dependencies.
Common Commands

\`\`\`bash
pip install openai anthropic langchain          # install packages
pip install -r requirements.txt                 # install from a list
pip freeze > requirements.txt                    # export installed packages
pip show openai                                  # inspect a package
\`\`\`

## 6.2 Jupyter Notebooks vs. Python Scripts

| Aspect | Jupyter Notebook (.ipynb) | Python Script (.py) |
|---|---|---|
| Best for | Exploration, experiments, prompt testing | Production code, reusable modules |
| Execution | Cell by cell, interactive, keeps state between cells | Whole file, top to bottom, fresh state each run |
| Version control | Harder to diff cleanly (mixed output + code) | Diffs cleanly in Git |

:::tip
A common professional workflow: prototype prompts and pipeline logic in a notebook, then once it works, refactor the working logic into clean functions inside a .py module for the actual application — the exploratory and production stages use different tools on purpose.
:::

## 6.3 Choosing Compute — Local vs. Cloud, CPU vs. GPU

![Figure 6.1 — CPUs handle general-purpose logic with a few powerful cores; GPUs accelerate the massive parallel matrix math used inside neural networks with thousands of smaller cores.](/python_for_AI_images/image_4.png)

**Figure 6.1** — CPUs handle general-purpose logic with a few powerful cores; GPUs accelerate the massive parallel matrix math used inside neural networks with thousands of smaller cores.

:::note
For most GenAI application development — calling hosted APIs, building RAG pipelines — you don't need a GPU at all — a GPU is only required when you're running a model locally or fine-tuning one yourself. Renting cloud GPU compute (Google Colab, AWS, RunPod) on demand is usually far more practical than buying dedicated hardware for learning and small projects.
:::`,

7: `# TOPIC 7: Bridge to GenAI: Math + Development Setup

This closing topic of the Basic level ties everything together — showing how the Python, math, and tooling foundations you've just covered combine into an actual, small, end-to-end Generative AI workflow.

![Figure 7.1 — The journey from raw data, through preprocessing and a model, to a working Generative AI application that a user can actually interact with.](/python_for_AI_images/image_5.png)

**Figure 7.1** — The journey from raw data, through preprocessing and a model, to a working Generative AI application that a user can actually interact with.

## 7.1 Putting It All Together

A minimal but realistic GenAI script combines everything from this level: variables and functions (Topic 1) to structure the code, an HTTP request (Topic 2) to reach the model, and a probability-shaping parameter like temperature (Topic 3) to control the model's output style.

**Example — A Complete, Minimal LLM Call**

\`\`\`python
import os
import requests
 API_KEY = os.environ.get("OPENAI_API_KEY")

def ask_llm(question: str) -> str:
    url = "https://api.openai.com/v1/chat/completions"
    headers = {"Authorization": f"Bearer {API_KEY}"}
    payload = {
        "model": "gpt-4o-mini",
        "messages": [{"role": "user", "content": question}],
        "temperature": 0.7,
    }
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    data = response.json()
    return data["choices"][0]["message"]["content"]

if __name__ == "__main__":
    answer = ask_llm("Explain embeddings in one sentence.")
    print(answer)
\`\`\`

**Explanation**
- os.environ.get() reads the API key from an environment variable instead of hardcoding it — a security practice you'll formalize in the Advanced level's Environment & Secret Management topic.
- The function combines everything from this level: a function definition (1.3), an HTTP POST request (2.2), and a probability-shaping parameter, temperature (3.2).
- This roughly 15-line script is structurally the same shape as production LLM client code — just without retries, logging, and validation, which you'll add progressively at the Intermediate and Advanced levels.

:::tip
Re-read this script after finishing every remaining topic in this course. Each new topic you cover next — async calls, testing, secret management, performance — is really just making this one small script safer, faster, and production-ready, piece by piece.
:::`,

8: `# TOPIC 1: Python for LLM Applications

At the Intermediate level, we move from raw HTTP calls to using official provider SDKs, structuring multi-turn conversations properly, and handling streaming responses — the daily-driver skills for building real LLM-powered applications.

![Figure 1.1 — A typical Python-based LLM application flow: user input -> app logic -> LLM API -> response, optionally augmented with tools or a vector database.](/python_for_AI_images/image_6.png)

**Figure 1.1** — A typical Python-based LLM application flow: user input -> app logic -> LLM API -> response, optionally augmented with tools or a vector database.

## 1.1 Why Use an SDK Instead of Raw Requests?

SDKs wrap the raw REST API in convenient, typed Python classes, handling authentication headers, retries, and response parsing for you. This removes an entire category of bugs (typo'd header names, malformed JSON) that come from hand-writing HTTP calls.

| Aspect | Raw requests library | Official SDK |
|---|---|---|
| Authentication | You build the header dict manually | Handled automatically from an env variable |
| Response shape | Untyped dict — response.json()["choices"][0]... | Typed object — response.content[0].text |
| Retries on rate limits | You implement it yourself | Often built in and configurable |
| Autocomplete in your editor | None — you're guessing key names | Full autocomplete and inline docs |

**Example — Anthropic SDK Pattern**

\`\`\`python
from anthropic import Anthropic
 client = Anthropic()   # reads ANTHROPIC_API_KEY from environment automatically

response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=[{"role": "user", "content": "Summarize RAG in two lines."}],
)

print(response.content[0].text)
\`\`\`

:::note
SDKs return typed Python objects (e.g. response.content[0].text), not raw dictionaries like requests.post(...).json() — this gives you editor autocomplete and catches typos at development time instead of causing a silent runtime KeyError.
:::

## 1.2 Structuring Multi-Turn Conversations

An LLM has no memory between API calls by default — every call is stateless. To have a coherent multi-turn conversation, your application must resend the entire message history on every single request.

**Example — Growing a Conversation List**

\`\`\`python
messages = [{"role": "user", "content": "What is an embedding?"}]
response = client.messages.create(model="claude-sonnet-4-6", max_tokens=300, messages=messages)
assistant_reply = response.content[0].text

# Add the assistant's reply, then the next user turn, before calling again
messages.append({"role": "assistant", "content": assistant_reply})
messages.append({"role": "user", "content": "How is that different from a token?"})
\`\`\`

:::insight
**Why This Matters**
This is exactly why longer conversations cost more per turn — you are re-sending the entire growing history each time, and providers bill by total tokens processed, not just the newest message. Context management (trimming or summarizing old turns) becomes important as conversations grow, and is covered in Course 4 and Course 6.
:::

## 1.3 Streaming Responses

Instead of waiting for the full response to finish generating, streaming lets your application print or display tokens as they're generated — essential for responsive, 'typing' chat UIs.

**Example — Streaming a Response**

\`\`\`python
with client.messages.stream(
    model="claude-sonnet-4-6",
    max_tokens=500,
    messages=[{"role": "user", "content": "Write a haiku about embeddings."}],
) as stream:
    for text_chunk in stream.text_stream:
        print(text_chunk, end="", flush=True)
\`\`\`

**Explanation**
- stream.text_stream yields small pieces of text as the model generates them, instead of returning everything in one go at the end.
- end="" and flush=True make each chunk print immediately, side by side, mimicking a live-typing effect instead of buffering output.`,

9: `# TOPIC 2: Data Handling for AI Applications

GenAI applications constantly ingest messy, real-world data — PDFs, CSVs, web pages, support tickets — and must clean and structure it before it can be meaningfully embedded or sent to a model.

## 2.1 Working with Pandas for Structured Data

Pandas is the standard Python library for tabular data. In AI pipelines it's commonly used to load, filter, and clean datasets before they are converted into text chunks for embedding.

**Example — Cleaning a Dataset Before Embedding**

\`\`\`python
import pandas as pd
df = pd.read_csv("support_tickets.csv")
df = df.dropna(subset=["ticket_text"])          # remove rows with no text
df["ticket_text"] = df["ticket_text"].str.strip()
df = df[df["ticket_text"].str.len() > 20]        # drop very short/noisy rows

print(df.shape)
print(df.head(2))
\`\`\`

:::mistake
'Garbage in, garbage out' applies strongly to RAG systems — embedding poorly cleaned text (HTML tags, boilerplate headers/footers, encoding errors) produces poor retrieval quality later, no matter how good the embedding model or the LLM is. Data cleaning is often the single highest-leverage step in a RAG pipeline.
:::

## 2.2 Serializing Data with JSON

JSON (JavaScript Object Notation) is the near-universal format for exchanging structured data with APIs. Python's built-in \`json\` module converts freely between Python dictionaries and JSON text.

**Example — Converting Between Python Objects and JSON**

\`\`\`python
import json

record = {"id": 101, "question": "What is fine-tuning?", "tags": ["llm", "training"]}

json_string = json.dumps(record, indent=2)   # Python dict -> JSON string
print(json_string)

parsed_back = json.loads(json_string)        # JSON string -> Python dict
print(parsed_back["tags"])
\`\`\`

:::note
json.dumps() and json.loads() are opposites — 'dump to string' and 'load from string.' It's easy to mix them up when reading unfamiliar code; a good rule of thumb: -s functions (dumps, loads) work with in-memory strings, while the plain versions (dump, load) work directly with open files.
:::`,

10: `# TOPIC 3: API & JSON Fundamentals

:::definition
**REST API**
A REST API is a web service that exposes functionality over HTTP using standard verbs (GET, POST, PUT, DELETE) and typically exchanges data in JSON format. Nearly all LLM providers expose REST APIs, and every SDK is ultimately a wrapper around one.
:::

## 3.1 HTTP Status Codes You'll See Constantly

| Code | Meaning | Typical Cause in LLM APIs |
|---|---|---|
| 200 | OK | Request succeeded |
| 400 | Bad Request | Malformed JSON or an invalid parameter value |
| 401 | Unauthorized | Missing or invalid API key |
| 429 | Too Many Requests | Rate limit exceeded — safe to retry after a delay |
| 500 / 503 | Server Error | Provider-side issue — usually safe to retry |

:::insight
**Why This Matters**
Distinguishing 4xx from 5xx errors matters for how your code should react: a 400 means your request itself was wrong and retrying identically will fail again — you need to fix the payload. A 429 or 5xx means the request was probably fine, and retrying (ideally after a delay) is the right move. This distinction underpins the retry logic covered in the Advanced level.
:::

## 3.2 Structured Output with JSON Schemas

Instead of parsing free-form text and hoping it's formatted consistently, you can instruct the model to return data matching a strict JSON schema — critical for reliably feeding LLM output into downstream code, databases, or other APIs.

**Example — Requesting Structured JSON Output**

\`\`\`python
import json

prompt = (
    "Extract the name and price from this sentence and reply ONLY with JSON "
    "in the form {\\"name\\": string, \\"price\\": number}.\\n\\n"
    "Sentence: 'The Model X headphones cost $149.'"
)

raw_output = ask_llm(prompt)      # assume defined elsewhere, returns model text
data = json.loads(raw_output)     # e.g. {"name": "Model X headphones", "price": 149}
\`\`\`

\`\`\`python
print(data["price"] * 1.08)      # now usable as real Python data, e.g. adding tax
\`\`\`

:::tip
Where possible, prefer your provider's native 'structured outputs' / tool-calling feature over asking the model to 'just output JSON' in plain text. Native structured output modes validate against a schema server-side and fail far less often than hoping the model remembers not to add explanatory text before the JSON.
:::`,

11: `# TOPIC 4: Git & Project Structure

As GenAI projects grow beyond a single script, version control and a clean, predictable project structure become essential for collaboration, reproducibility, and simply not losing work.

![Figure 4.1 — A typical Git branching workflow for an AI project: feature branches merge into main via pull requests.](/python_for_AI_images/image_7.png)

**Figure 4.1** — A typical Git branching workflow for an AI project: feature branches merge into main via pull requests.

## 4.1 Core Git Commands

\`\`\`bash
git init                                # start a new repo
git checkout -b feature/rag-pipeline    # create + switch to a branch
git add .                               # stage changes
git commit -m "Add document chunking logic"
git push origin feature/rag-pipeline    # push branch to remote
\`\`\`

## 4.2 A Standard GenAI Project Layout

Consistent project structure makes it far easier for a teammate — or your future self — to find where prompts, business logic, and configuration live.

\`\`\`text
genai_project/
├── app/
│   ├── __init__.py
│   ├── main.py           # entry point (e.g. FastAPI app)
│   ├── prompts/          # prompt templates
│   └── services/         # LLM client, retriever, etc.
├── tests/
├── .env                  # secrets (never committed)
├── .gitignore
├── requirements.txt
└── README.md
\`\`\`

:::mistake
Always add .env to .gitignore before your first commit — not after. A leaked API key in Git history is one of the most common, and most costly, mistakes in AI projects, since old commits often remain recoverable even after later 'deleting' the file and can be found by automated scanners within minutes of a public push.
:::`,

12: `# TOPIC 5: Virtual Environments & Package Management

:::definition
**Virtual Environment**
A virtual environment is an isolated Python installation with its own independently installed packages, kept separate from your system Python and from other projects' environments.
:::

![Figure 5.1 — Separate virtual environments keep each project's dependencies, and their exact versions, isolated from one another.](/python_for_AI_images/image_8.png)

**Figure 5.1** — Separate virtual environments keep each project's dependencies, and their exact versions, isolated from one another.

## 5.1 Creating and Using venv

\`\`\`bash
python -m venv .venv                 # create the environment
source .venv/bin/activate            # activate (Mac/Linux)
.venv\\Scripts\\activate               # activate (Windows)
pip install langchain openai         # installs only inside .venv
deactivate                           # exit the environment
\`\`\`

:::insight
**Why This Matters**
Different GenAI projects often need conflicting library versions — for example, two projects each requiring a different major version of LangChain, whose APIs change significantly between versions. Without virtual environments, installing one project's dependencies can silently break another project on the same machine.
:::

## 5.2 Reproducible Installs

A requirements file records the exact versions used, so the same environment can be recreated on a teammate's machine, a CI server, or a production container.

\`\`\`bash
pip freeze > requirements.txt        # lock exact versions
pip install -r requirements.txt      # reproduce the same environment elsewhere
\`\`\`

:::note
Newer tools like \`uv\` and \`poetry\` are increasingly popular alternatives to plain pip + venv — they add faster installs and stricter dependency-locking. The underlying concept (isolated environment + a lock file) is the same; only the tooling differs.
:::`,

13: `# TOPIC 6: GPU/CPU Compute Basics

Understanding when your workload actually needs a GPU — and how to check what's available at runtime — helps you avoid wasted cost and correctly configure ML libraries.

## 6.1 Checking Available Compute in Python

**Example — Detecting a GPU with PyTorch**

\`\`\`python
import torch

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

if torch.cuda.is_available():
    print(torch.cuda.get_device_name(0))
\`\`\`

**Explanation**
- torch.cuda.is_available() returns True only if a compatible NVIDIA GPU and drivers are detected on the machine.
- Setting device once and reusing it (model.to(device), tensor.to(device)) is the standard pattern for writing code that runs unmodified on both a CPU-only laptop and a GPU server.

## 6.2 When You Actually Need a GPU

| Task | GPU Needed? |
|---|---|
| Calling a hosted LLM API (OpenAI, Anthropic) | No |
| Building a RAG pipeline with a hosted embedding API | No |
| Running a local open-source LLM (e.g. via Ollama, 7B+ params) | Recommended |
| Fine-tuning a model, even with lightweight methods like LoRA | Yes |

:::tip
If you're only calling hosted APIs, skip GPU setup entirely and save the time and cost — you will need it later in this course, specifically in Course 7 (Fine-Tuning) and when running local open-source models in Course 6.
:::`,

14: `# TOPIC 1: Production Python Patterns for AI

Moving an AI script from a notebook to production requires patterns for validation, configuration, and clean separation of concerns. This topic covers the patterns used in real GenAI codebases, not just toy examples.

## 1.1 Data Validation with Pydantic

:::definition
**Pydantic**
Pydantic is a Python library for defining data models with type-validated fields. It is used throughout the AI ecosystem (FastAPI, LangChain, OpenAI SDK) to validate API requests and structured LLM outputs.
:::

**Example — Validating an LLM Request**

\`\`\`python
from pydantic import BaseModel, Field

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    model: str = "claude-sonnet-4-6"

# Valid input
req = ChatRequest(message="Hello", temperature=1.2)
print(req.model_dump())

# Invalid input raises a clear validation error
bad_req = ChatRequest(message="Hi", temperature=5.0)   # error: must be <= 2.0
\`\`\`

:::insight
**Why This Matters**
Validating inputs before they reach the LLM API saves cost and latency — a request that will obviously fail (e.g. temperature=5.0) is rejected instantly by your own code instead of round-tripping to the provider and burning a network call for nothing.
:::

## 1.2 The Service Pattern — Decoupling Business Logic from the Provider

Separating 'what the LLM does' (a service layer) from 'how the app uses it' (application/business logic) makes code testable and lets you swap providers — or add a fallback provider — without rewriting business logic.

**Example — Abstracting the LLM Provider Behind an Interface**

\`\`\`python
from abc import ABC, abstractmethod
 class LLMService(ABC):
    @abstractmethod
    def generate(self, prompt: str) -> str: ...

class AnthropicService(LLMService):
    def __init__(self, client):
        self.client = client

    def generate(self, prompt: str) -> str:
        resp = self.client.messages.create(
            model="claude-sonnet-4-6", max_tokens=500,
            messages=[{"role": "user", "content": prompt}],
        )
        return resp.content[0].text

def summarize(service: LLMService, text: str) -> str:
    return service.generate(f"Summarize:\\n{text}")
\`\`\`

**Explanation**
- summarize() depends only on the abstract LLMService interface, not on any specific provider's SDK.
- You could swap in an OpenAIService or a MockLLMService for tests without changing summarize() at all — this decoupling is the entire point of the pattern, and it's exactly how you'll implement provider fallbacks in Topic 3 (API Integration Patterns) below.`,

15: `# TOPIC 2: Async Programming for AI APIs

:::definition
**Asynchronous Programming**
Asynchronous programming lets a program start a slow operation (like a network request) and continue other work while waiting for it to finish, instead of blocking. Python implements this with the async/await keywords and the asyncio event loop.
:::

![Figure 2.1 — asyncio's event loop switches between multiple in-flight tasks while each awaits I/O, enabling concurrent LLM API calls on a single thread.](/python_for_AI_images/image_9.png)

**Figure 2.1** — asyncio's event loop switches between multiple in-flight tasks while each awaits I/O, enabling concurrent LLM API calls on a single thread.

## 2.1 Why Async Matters for LLM Applications

LLM API calls are I/O-bound — the vast majority of the time is spent waiting for the network and the model to respond, not doing local CPU work. Async lets you fire off many requests concurrently instead of one strictly after another, dramatically improving throughput for batch workloads.

**Example — Running Multiple LLM Calls Concurrently**

\`\`\`python
import asynciofrom anthropic import AsyncAnthropic

client = AsyncAnthropic()

async def ask(question: str) -> str:
    resp = await client.messages.create(
        model="claude-sonnet-4-6", max_tokens=200,
        messages=[{"role": "user", "content": question}],
    )
    return resp.content[0].text

async def main():
    questions = ["What is RAG?", "What is LoRA?", "What is an agent?"]
    # Runs all three requests concurrently instead of one after another
    results = await asyncio.gather(*(ask(q) for q in questions))
    for q, r in zip(questions, results):
        print(f"{q} -> {r[:60]}...")

asyncio.run(main())
\`\`\`

**Explanation**
- asyncio.gather() runs all three ask() calls concurrently; total wall-clock time is roughly the duration of the single slowest call, not the sum of all three.
- For 3 calls at roughly 2 seconds each, sequential code takes roughly 6 seconds total; the concurrent version above takes roughly 2 seconds.

:::mistake
A very common mistake: mixing sync and async code, e.g. calling a blocking requests.post() inside an async function. This blocks the entire event loop and defeats the purpose of using async at all — always use an async-capable client (httpx.AsyncClient, AsyncAnthropic, AsyncOpenAI) inside async functions.
:::`,

16: `# TOPIC 3: API Integration Patterns

Production AI systems must handle rate limits, transient network failures, and partial provider outages gracefully rather than crashing or hanging. This topic covers the resilience patterns every AI backend needs.

## 3.1 Retry with Exponential Backoff

When a request fails for a retryable reason (like a rate limit), waiting a short, increasing delay before each retry — rather than retrying instantly — gives the overloaded system time to recover.

**Example — Robust Retry Logic**

\`\`\`python
import timeimport random

class RateLimitError(Exception):
    pass

def call_with_retry(fn, max_attempts=5, base_delay=1.0):
    for attempt in range(1, max_attempts + 1):
        try:
            return fn()
        except RateLimitError:
            if attempt == max_attempts:
                raise
            delay = base_delay * (2 ** (attempt - 1)) + random.uniform(0, 0.5)
            print(f"Rate limited. Retrying in {delay:.1f}s (attempt {attempt})")
            time.sleep(delay)
\`\`\`

**Explanation**
- Exponential backoff (roughly 1s, 2s, 4s, 8s...) avoids hammering an already-overloaded API with immediate repeated retries.
- Adding random jitter (random.uniform(0, 0.5)) prevents many clients from retrying at exactly the same moment and re-triggering the rate limit together in a synchronized wave.

## 3.2 Circuit Breakers and Fallbacks

:::definition
**Circuit Breaker**
A circuit breaker is a pattern that temporarily stops sending requests to a failing service after repeated errors, giving it time to recover, and periodically checks if it's healthy again before resuming full traffic.
:::

:::tip
Combine retries (for short, transient blips) with a circuit breaker (for sustained outages) and a fallback — a secondary model provider or a cached response — as a three-layer approach. This is standard in production LLM gateways and is exactly what the LLMService abstraction from Topic 1 makes easy to implement, since swapping to a fallback provider is just swapping which service instance you call.
:::`,

17: `# TOPIC 4: Testing & Debugging AI Applications

Testing AI applications is harder than testing typical software because LLM outputs are non-deterministic — the same prompt can produce slightly different wording on different runs. This topic covers practical strategies for testing code that depends on an LLM without testing the model itself.

![Figure 4.1 — Most tests should be fast unit tests; fewer, slower integration and end-to-end tests sit above them.](/python_for_AI_images/image_10.png)

**Figure 4.1** — Most tests should be fast unit tests; fewer, slower integration and end-to-end tests sit above them.

## 4.1 Mocking LLM Calls in Unit Tests

A unit test should verify your own code's logic, not the LLM's judgment. Replacing the real LLM call with a mock object lets you test how your code handles a given response, instantly and for free.

**Example — Testing Business Logic Without Calling a Real LLM**

\`\`\`python
from unittest.mock import MagicMock

def summarize(service, text):
    return service.generate(f"Summarize: {text}")

def test_summarize_calls_service_correctly():
    mock_service = MagicMock()
    mock_service.generate.return_value = "A short summary."

    result = summarize(mock_service, "Long document text...")

    assert result == "A short summary."
    mock_service.generate.assert_called_once_with(
        "Summarize: Long document text..."
    )
\`\`\`

**Explanation**
- MagicMock() stands in for the real LLM service — no API key, network call, or cost is needed to run this test.
- This test verifies your code calls the service correctly, not that the LLM's answer is 'good' — output quality needs separate evaluation techniques, covered in depth in Course 9 (GenAI Evaluation & Production).

## 4.2 Debugging Non-Deterministic Output

When a test or a user report shows unexpected model behavior, a few practical habits make root-causing far faster:
- Set temperature=0 while debugging to make outputs as reproducible as possible from run to run.
- Log the full prompt and the raw response (not just the parsed result) so you can replay exactly what the model actually saw and produced.
- Prefer 'property' checks in tests (e.g. 'output is valid JSON' / 'output contains a phone number pattern') over exact string matches, since exact wording will legitimately vary between runs.

:::mistake
A subtle trap: temperature=0 makes output far more consistent, but most providers do not guarantee it is perfectly deterministic across requests. Don't build tests that assume byte-for-byte identical output every time, even at temperature=0.
:::`,

18: `# TOPIC 5: Environment & Secret Management

:::definition
**Secret**
A secret is any sensitive value — API keys, database passwords, tokens — that must never appear in source code or version control.
:::

![Figure 5.1 — Secrets flow from a gitignored .env file, through environment variables, into the application — never hardcoded in source.](/python_for_AI_images/image_11.png)

**Figure 5.1** — Secrets flow from a gitignored .env file, through environment variables, into the application — never hardcoded in source.

## 5.1 Loading Secrets with python-dotenv

**Example — .env File and Loader**

\`\`\`bash
# .env  (never committed to Git)
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
DATABASE_URL=postgresql://user:pass@localhost/db
\`\`\`

\`\`\`python
from dotenv import load_dotenv
import os

load_dotenv()   # reads .env into environment variables

api_key = os.environ["ANTHROPIC_API_KEY"]
# api_key is now available WITHOUT ever appearing in the source code
\`\`\`

:::note
For production deployments, prefer a managed secret store (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault) over .env files — these provide key rotation, access auditing, and avoid secrets sitting in plaintext on disk on a production server.
:::

## 5.2 Config Layering by Environment

| Environment | Where Secrets Live | Notes |
|---|---|---|
| Local development | .env file (gitignored) | Fast iteration, never shared |
| CI/CD pipeline | CI secret store (e.g. GitHub Actions secrets) | Injected at build/test time, never printed to logs |
| Production | Cloud secret manager | Rotated regularly, access-logged |

:::insight
**Why This Matters**
A key with unlimited scope and no rotation policy is a much bigger blast radius if leaked than one that's short-lived and narrowly scoped. Treating secret management as an afterthought is one of the most common ways real AI projects suffer costly incidents — this topic is not just theoretical hygiene.
:::`,

19: `# TOPIC 6: Performance-Aware AI Development

LLM API calls are typically the slowest and most expensive part of an AI application by a wide margin. This closing topic covers how to identify where time and money actually go, and the highest-leverage ways to reduce both.

![Figure 6.1 — In most AI pipelines, the LLM API call dominates total latency, making it the highest-priority place to optimize.](/python_for_AI_images/image_12.png)

**Figure 6.1** — In most AI pipelines, the LLM API call dominates total latency, making it the highest-priority place to optimize.

## 6.1 Caching Repeated Requests

If the same or very similar prompts are sent repeatedly — a common pattern in support bots, documentation Q&A, or batch jobs reprocessing similar inputs — caching the result avoids paying for and waiting on the same generation twice.

**Example — Simple Response Caching**

\`\`\`python
import hashlib

cache = {}

def cached_ask(prompt: str) -> str:
    key = hashlib.sha256(prompt.encode()).hexdigest()
    if key in cache:
        return cache[key]
    result = ask_llm(prompt)     # only calls the LLM on a cache miss
    cache[key] = result
    return result
\`\`\`

**Explanation**
- Hashing the prompt gives a compact, fixed-length cache key regardless of prompt length, avoiding storing enormous strings as dictionary keys.
- In production, this in-memory dict would be replaced with Redis or another shared cache, so that multiple application instances (behind a load balancer) all share the same cache hits instead of each keeping their own.

## 6.2 Other High-Impact Optimizations

- Batch embedding calls instead of embedding one document at a time — most embedding APIs accept a list of texts per request, which is far more efficient than one call per document.
- Stream responses to reduce perceived latency, even when total generation time is unchanged — users perceive a streaming response as faster.
- Right-size the model — use a smaller, cheaper, faster model for simple sub-tasks (classification, routing, simple extraction) and reserve the largest, most capable model for complex reasoning steps.
- Set max_tokens deliberately rather than leaving it very high 'just in case' — an unnecessarily high limit can increase cost and, on some provider configurations, latency.

:::tip
Profile before optimizing. Log the latency of every stage (data load, preprocessing, the LLM call itself, postprocessing) so you optimize the actual bottleneck — almost always the LLM call — rather than spending effort speeding up a part of the pipeline that was never the slow part to begin with.
:::`,

}

export default pythonForGenAIContent
