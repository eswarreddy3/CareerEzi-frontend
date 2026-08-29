// Large Language Models & Transformers — Basic → Intermediate → Advanced (18 topics)
// Extracted verbatim from LLM&Transformers.docx (Course 3 of 9, Generative AI domain).
// Diagrams served from /public/LLM_images/image_*.png
// Course id: "llm-transformers"  →  registered in content/index.ts
//
// Create these in the super-admin UI (/super-admin/courses); lesson `order` is
// global across the course, so it must match the keys below exactly.
//
//   Basic         — How raw text becomes something a model can compute with, and how a model turns that back into words.
//     1  Introduction to LLMs
//     2  Tokens & Tokenization
//     3  Embeddings
//     4  LLM Inputs & Outputs
//     5  LLM Parameters
//     6  Next-Token Prediction
//   Intermediate  — Opening up the transformer: attention, multi-head attention, positional information, and how training actually works.
//     7  Neural Networks for LLMs
//     8  Transformer Architecture
//     9  Attention Mechanism
//    10  Multi-Head Attention
//    11  Positional Information
//    12  LLM Training
//   Advanced      — Efficiency, scale, inference mechanics, and how modern architectures diverge from the original transformer.
//    13  Advanced Attention
//    14  Transformer Internals
//    15  LLM Scaling
//    16  LLM Inference
//    17  Modern LLM Architectures
//    18  LLM Architecture Analysis

const llmTransformersContent: Record<number, string> = {
1: `# TOPIC 1: Introduction to LLMs

Large Language Models were introduced earlier at a conceptual level — a foundation model trained primarily on text. This course opens the hood: how text actually becomes something a neural network can process, and what's happening mechanically, layer by layer, between a prompt going in and a response coming out.

:::definition
**Large Language Model (LLM)**
A Large Language Model is a neural network — specifically, a transformer — trained on vast amounts of text to predict the next token in a sequence. Everything an LLM appears to 'do' (answer questions, write code, reason) emerges from this single trained skill, applied one token at a time.
:::

:::insight
**Why This Matters**
Every capability and every limitation you'll study across the rest of this curriculum traces back to this course. Hallucination, context window limits, why longer prompts cost more, why some tasks are easy and others hard for an LLM — all of it follows directly from the mechanics you're about to learn.
:::

## 1.1 What You'll Build a Mental Model Of

- Tokenization — how text is broken into the pieces a model actually reads.
- Embeddings — how those pieces become numbers a neural network can compute with.
- The transformer — the specific neural network architecture behind every modern LLM.
- Attention — the mechanism that lets a model relate any word to any other word in its context.
- Training and scaling — how these models learn, and why bigger tends to mean better.
- Inference — what actually happens, computationally, when you send a model a prompt.

## 1.2 Why 'It's Just Predicting the Next Word' Undersells It

It's technically true that an LLM's core mechanism is predicting one token at a time. But this framing undersells what's required to do that well: predicting the next token accurately across billions of diverse sentences forces the model to implicitly learn grammar, facts, reasoning patterns, and style — because getting the next word right, consistently, across nearly the entire span of human writing, requires understanding a great deal about the world that word came from.

:::note
A useful analogy: predicting the next move in chess sounds narrow too, but a system that predicts grandmaster moves with high accuracy has necessarily learned a great deal about chess strategy. Next-token prediction is the same kind of deceptively narrow-sounding task.
:::`,

2: `# TOPIC 2: Tokens & Tokenization

Before any neural network computation happens, raw text has to be broken into discrete units called tokens. This is the very first step in the pipeline, and it shapes everything downstream — including cost, context limits, and even some surprising model quirks.

:::definition
**Token**
A token is the basic unit of text an LLM processes — not necessarily a whole word. Modern tokenizers use subword tokenization, splitting text into frequently-occurring chunks that can be whole words, word pieces, or even single characters for rare text.
:::

![Figure 2.1 — Text is split into subword tokens, then mapped to integer IDs the model actually operates on.](/LLM_images/image_1.png)

**Figure 2.1** — Text is split into subword tokens, then mapped to integer IDs the model actually operates on.

## 2.1 Why Subword Tokenization, Not Whole Words

Splitting text into whole words seems intuitive, but it creates two problems: the vocabulary would need an entry for every word (impossible to cover typos, rare words, and new terms), and it wastes the model's fixed vocabulary budget on rare words while common word pieces get duplicated across many entries. Subword tokenization — algorithms like Byte-Pair Encoding (BPE) — solves this by learning a fixed-size vocabulary of frequent character sequences, so common words become one token while rare or unfamiliar words split into recognizable pieces.

:::scenario
**Tokenizing an Uncommon Word**
The word 'unbelievably' might split into ['un', 'believ', 'ably'] — three tokens built from pieces common enough to appear in the vocabulary, even though the whole word itself is comparatively rare. A common word like 'the' typically stays as a single token.
:::

## 2.2 Why Tokenization Matters Practically

| Practical Effect | Why It Happens |
|---|---|
| API costs are billed per token, not per word | Providers charge based on the tokens actually processed |
| Non-English text often costs more per word | Tokenizers are typically trained mostly on English text, so other languages split into more tokens |
| LLMs are weak at character-level tasks (e.g. counting letters) | The model sees tokens, not individual characters — 'strawberry' might be 2–3 tokens, obscuring letter-level detail |
| Context window limits are token limits, not word limits | A '128K context window' means 128,000 tokens, roughly 90,000–100,000 English words |

:::mistake
A very common source of confusion: assuming '1 token ≈ 1 word.' In practice, 1 token is closer to about 0.75 words for English text on average — meaning word counts and token counts diverge meaningfully, especially for code, non-English text, or text with lots of rare words or symbols.
:::`,

3: `# TOPIC 3: Embeddings

Tokens are still just IDs — integers with no inherent meaning to a neural network. Embeddings are the next step: converting each token ID into a vector of numbers that captures something about its meaning, positioned so that related concepts end up near each other in that numerical space.

:::definition
**Embedding**
An embedding is a learned vector of numbers — typically hundreds or thousands of dimensions — that represents a token's meaning in a way a neural network can compute with. Embeddings are learned during training such that tokens used in similar contexts end up with similar vectors.
:::

![Figure 3.1 — Embeddings place related words near each other in a high-dimensional space.](/LLM_images/image_2.png)

**Figure 3.1** — Embeddings place related words near each other in a high-dimensional space.

## 3.1 The Classic Example: Vector Arithmetic on Meaning

A famous illustration of what embeddings capture: the vector arithmetic king − man + woman lands close to the vector for queen. This works because embeddings don't just cluster similar words — they encode relationships (like gender, tense, or plurality) as consistent directions in the vector space, learned automatically from how words are used across huge amounts of text, with no explicit grammar rules programmed in.

:::insight
**Why This Matters**
This same idea — meaning as position and direction in a vector space — is the mathematical foundation not just for how LLMs process input internally, but for the embedding models used in RAG and semantic search. Once you understand embeddings here, that entire topic becomes a direct application of the same concept.
:::

## 3.2 Where Embeddings Live in the Pipeline

Every LLM has an embedding layer — a large lookup table, learned during training, mapping each token ID in the vocabulary to its embedding vector. This is the very first computation that happens when a prompt enters the model, before any transformer layers run. A second embedding table (or one shared with the first) also handles the reverse: converting the model's final internal representation back into a probability over possible next tokens.

:::note
Embeddings are learned, not hand-designed. Early in training, a token's embedding starts essentially random; by the end of training, tokens used in similar contexts converge toward similar vectors, purely as a side effect of the model getting better at next-token prediction.
:::`,

4: `# TOPIC 4: LLM Inputs & Outputs

With tokens and embeddings established, this topic zooms out to trace the complete path: what actually goes in, what actually comes out, and everything that happens in between at a high level — before the next levels of this course open up the transformer layers themselves.

![Figure 4.1 — The full input-to-output pipeline, repeated once per generated token.](/LLM_images/image_3.png)

**Figure 4.1** — The full input-to-output pipeline, repeated once per generated token.

## 4.1 The Full Pipeline, Step by Step

| Step | What Happens |
|---|---|
| 1. Tokenize | Raw text prompt is split into tokens and converted to integer IDs |
| 2. Embed | Each token ID is looked up in the embedding table to get its vector |
| 3. Transform | Embeddings pass through many stacked transformer layers (Intermediate level) |
| 4. Project | The final layer's output is projected into a score for every token in the vocabulary |
| 5. Sample | Scores become probabilities (via softmax); one token is sampled as the output |
| 6. Repeat | The new token is appended to the input, and the whole process runs again |

:::insight
**Why This Matters**
This 'repeat' step is the single most important thing to internalize about how LLMs actually work: a model doesn't generate a whole response at once. It generates one token, appends it, and reprocesses the entire growing sequence to generate the next one — which is exactly why longer generations take proportionally longer and cost more.
:::

## 4.2 Input and Output Are the Same Kind of Object

A subtlety worth internalizing early: from the model's perspective, there's no structural difference between 'the prompt' and 'the response so far' — both are just tokens in the sequence. This is why multi-turn conversations work by resending the entire history: the model has no persistent memory between calls, only whatever tokens are in the current input sequence.`,

5: `# TOPIC 5: LLM Parameters

The word 'parameters' is used two different ways in this field, and conflating them is a common source of confusion. This topic disambiguates them, then focuses on the everyday, request-level parameters you'll actually set constantly when calling an LLM API.

## 5.1 Two Meanings of 'Parameters'

| Meaning | What It Refers To | Example |
|---|---|---|
| Model parameters (weights) | The billions of learned numbers inside the network itself, fixed after training | "a 70-billion-parameter model" |
| Request / inference parameters | Settings you choose per API call to control generation behavior | temperature, max_tokens, top_p |

:::mistake
When someone says 'try adjusting the model's parameters,' context matters enormously — they almost certainly mean request parameters like temperature, not the model's trained weights, which you cannot adjust at all through an API call.
:::

## 5.2 The Request Parameters You'll Use Constantly

| Parameter | What It Controls | Typical Range |
|---|---|---|
| temperature | Randomness of sampling — low is focused, high is more varied | 0.0 – 2.0 (provider-dependent) |
| max_tokens | The maximum length of the generated response | Set based on expected output length |
| top_p (nucleus sampling) | Restricts sampling to the smallest set of tokens whose cumulative probability exceeds p | 0.0 – 1.0, often left near 1.0 |
| top_k | Restricts sampling to only the k most likely next tokens | Provider-dependent; less commonly exposed than top_p |
| stop sequences | Strings that, if generated, immediately end the response | Task-specific, e.g. "\n\n" or "END" |

:::tip
For most tasks, temperature is the one parameter worth actively tuning: near 0 for factual, deterministic tasks (extraction, classification, code), and higher (0.7–1.0) for creative or brainstorming tasks. Leave top_p and top_k at their defaults unless you have a specific reason to change them — combining multiple sampling controls aggressively can interact in ways that are hard to predict.
:::`,

6: `# TOPIC 6: Next-Token Prediction

This closing Basic-level topic goes one level deeper into the single mechanism this entire course orbits: how a model actually chooses the next token, and how temperature reshapes that choice.

![Figure 6.1 — The same underlying probabilities, reshaped by temperature into a sharper or flatter distribution.](/LLM_images/image_4.png)

**Figure 6.1** — The same underlying probabilities, reshaped by temperature into a sharper or flatter distribution.

## 6.1 From Raw Scores to a Probability Distribution

After processing the input, the model produces one raw score (called a logit) for every token in its vocabulary — tens of thousands of numbers, one per possible next token. These raw scores aren't probabilities yet; the softmax function converts them into a valid probability distribution that sums to exactly 1, so the model can sample from it.

:::definition
**Sampling**
Sampling is the process of actually choosing one token from the probability distribution the model produced, rather than always picking the single highest-probability token. Different sampling strategies (greedy, temperature-based, nucleus/top-p) trade off determinism against variety and creativity.
:::

## 6.2 Greedy Decoding vs. Sampling

The simplest strategy — greedy decoding — always picks the single highest-probability token. This sounds optimal but often produces repetitive, oddly generic text, because it never lets the model recover from a locally 'safe' but globally mediocre word choice. Temperature-based sampling introduces controlled randomness instead, letting lower-probability tokens occasionally get chosen, which tends to produce more natural, varied text.

:::insight
**Why This Matters**
This is the mechanical explanation for why the same prompt can produce different answers each time, and why setting temperature=0 — effectively closer to greedy decoding — makes output far more consistent, though not always perfectly identical, run to run.
:::

:::note
Everything in the Basic level of this course — tokens, embeddings, parameters, next-token prediction — describes the interface and outer mechanics of an LLM. The Intermediate level opens up what's actually happening inside those 'transformer layers' from Topic 4's pipeline.
:::`,

7: `# TOPIC 1: Neural Networks for LLMs

The basic neural network — layers, weights, activation functions, and gradient descent — was introduced earlier in this curriculum. Before diving into the transformer specifically, this topic reconnects those fundamentals directly to what's happening inside an LLM.

![Figure 1.1 — The same layered, weighted, activated structure underlies every transformer sub-component.](/LLM_images/image_5.png)

**Figure 1.1** — The same layered, weighted, activated structure underlies every transformer sub-component.

## 1.1 What's the Same, What's Different

A transformer is still, fundamentally, a neural network: layers of neurons connected by learned weights, with non-linear activation functions between them, trained via gradient descent to minimize a loss function. What makes a transformer distinct isn't a different kind of neuron — it's a specific, repeating arrangement of these familiar components, plus one new mechanism (attention) that earlier architectures didn't have.

| Familiar Neural Network Concept | Where It Reappears in a Transformer |
|---|---|
| Weights & biases | Inside every attention and feed-forward sub-layer |
| Activation functions (e.g. ReLU) | Inside the feed-forward network of every transformer block |
| Loss function & gradient descent | The training process for the entire transformer, end to end |
| Layers stacked sequentially | Transformer blocks stacked N times (Topic 2 below) |

## 1.2 Why Plain Feed-Forward Networks Weren't Enough

Before transformers, sequence models like RNNs (Recurrent Neural Networks) processed text one token at a time, in order, carrying forward a 'memory' of everything seen so far. This worked but had two major problems: it was slow to train (each step depends on the previous one, so you can't parallelize across a sequence), and it struggled to remember information from far earlier in a long sequence. The transformer's central innovation — attention — solves both problems at once, which is why it displaced RNNs almost entirely for language tasks after 2017.

:::insight
**Why This Matters**
This history matters because it explains why attention exists at all — it isn't an arbitrary design choice. It's a direct solution to the two biggest practical problems with the architectures that came before it, and that context makes the mechanism in Topic 3 far more intuitive than memorizing it as a formula.
:::`,

8: `# TOPIC 2: Transformer Architecture

This topic zooms out to the full architecture before the next two topics zoom into its most important component. Nearly every modern LLM — GPT, Claude, Gemini, Llama — uses a variant of the same decoder-only transformer architecture shown here.

:::definition
**Transformer**
The transformer is a neural network architecture, introduced in the 2017 paper 'Attention Is All You Need,' built around self-attention as its core mechanism for relating different positions in a sequence to each other, rather than processing tokens strictly one at a time in order.
:::

![Figure 2.1 — A single decoder-only transformer block, stacked N times to form a full model.](/LLM_images/image_6.png)

**Figure 2.1** — A single decoder-only transformer block, stacked N times to form a full model.

## 2.1 Anatomy of a Single Block

| Sub-Layer | What It Does |
|---|---|
| Masked multi-head self-attention | Lets each token gather information from earlier tokens in the sequence (Topics 3–4) |
| Add & layer norm | Adds the sub-layer's output back to its input (a residual connection) and normalizes it |
| Feed-forward network | A small neural network applied independently to each token's representation |
| Add & layer norm (again) | The same residual + normalization pattern after the feed-forward step |

A full model stacks this exact block N times — anywhere from a few dozen in smaller models to over a hundred in the largest frontier models — with the output of one block feeding directly into the next. Each stacked block lets the model build progressively more abstract representations of the input, similar in spirit to how deeper layers in a vision network detect progressively more complex visual features.

## 2.2 Why 'Decoder-Only'?

The original 2017 transformer had two halves: an encoder (which processes the full input at once) and a decoder (which generates output one token at a time, attending back to the encoder). Most modern LLMs — including GPT and Claude — use a decoder-only design: a single stack that both reads the prompt and generates the response, using the same masked self-attention mechanism throughout. This simplification turned out to scale extremely well and is now the dominant architecture for general-purpose LLMs.

:::note
'Masked' in masked self-attention means each token can only attend to itself and earlier tokens, never later ones — essential for a model that generates text left-to-right, one token at a time, without 'seeing the answer' during training.
:::`,

9: `# TOPIC 3: Attention Mechanism

Attention is the mechanism that made the transformer possible, and it's worth understanding thoroughly — nearly every advanced topic later in this course (KV caching, advanced attention variants, inference optimization) is really just attention viewed from a different angle.

![Figure 3.1 — Every token is projected into a Query, Key, and Value; attention scores determine how much each token contributes to the output.](/LLM_images/image_7.png)

**Figure 3.1** — Every token is projected into a Query, Key, and Value; attention scores determine how much each token contributes to the output.

## 3.1 The Intuition: A Soft, Weighted Lookup

Attention lets every token look at every other token in the sequence and decide how relevant each one is to understanding itself — then blend information from the relevant ones accordingly. In the classic example, 'The animal didn't cross the street because it was tired,' attention allows the token 'it' to look back and assign high relevance to 'animal' (not 'street'), correctly resolving what 'it' refers to — something a model without attention would struggle to do reliably.

## 3.2 Query, Key, Value — What They Actually Mean

:::definition
**Query, Key, Value (Q, K, V)**
For every token, the model computes three vectors via learned projections: a Query (what this token is 'looking for'), a Key (what this token 'offers' to others looking for it), and a Value (the actual content this token contributes if attended to). Attention scores come from comparing Queries against Keys; those scores then weight how much of each token's Value gets blended into the output.
:::

A commonly used analogy: think of it like a search engine. Your search text is the Query. Each document in the index has a Key (used to compute relevance to your query) and a Value (the actual content returned). Attention runs this same kind of relevance-weighted retrieval internally, for every token against every other token, computed freshly at every layer.

## 3.3 The Computation, in Plain Terms

- Compute a raw score for every pair of tokens: how well does this token's Query match that token's Key? (a dot product)
- Scale the scores down (dividing by the square root of the key dimension) to keep the numbers in a stable range for training.
- Apply softmax across the scores so they become a probability distribution — attention weights that sum to 1 for each token.
- Use those weights to compute a weighted sum of all the Value vectors — this weighted sum is the attention output for that token.

:::insight
**Why This Matters**
Every step above is fully parallelizable across all tokens in a sequence at once — unlike the strictly sequential processing of older RNN architectures. This parallelism is a major reason transformers train so much faster on modern GPU hardware, directly enabling the scale of training that makes today's LLMs possible.
:::`,

10: `# TOPIC 4: Multi-Head Attention

A single attention computation can only learn one kind of relationship pattern at a time. Multi-head attention runs several attention computations in parallel — each with its own learned Q, K, V projections — so the model can capture several different kinds of relationships simultaneously.

![Figure 4.1 — Multiple attention heads run in parallel, each free to specialize in a different kind of relationship.](/LLM_images/image_8.png)

**Figure 4.1** — Multiple attention heads run in parallel, each free to specialize in a different kind of relationship.

## 4.1 Why Multiple Heads Instead of One Bigger Head

You might expect one large, powerful attention computation to outperform several smaller parallel ones — but in practice, splitting attention into multiple smaller 'heads,' each with independent learned parameters, lets different heads specialize. Research examining trained models has found heads that appear to specialize in tracking syntax, others in coreference (like the 'it' example from Topic 3), and others in longer-range topical relationships — different heads genuinely learn to attend to different kinds of patterns.

| Term | What It Means |
|---|---|
| Head | One independent attention computation with its own Q, K, V projection weights |
| num_heads | How many parallel heads a given model uses (e.g. 32, 64, 96) — a fixed architecture choice |
| Head dimension | The size of each head's Q/K/V vectors — total model dimension divided across all heads |
| Concatenation | After all heads compute their outputs, they're joined back together and passed through one more learned projection |

:::note
You don't choose the number of attention heads when using a hosted LLM API — it's a fixed architectural property baked into the model at training time. This topic is about understanding what's happening inside the model you're calling, not a setting you control.
:::`,

11: `# TOPIC 5: Positional Information

Attention, as described in Topic 3, has a subtle but important gap: comparing Queries against Keys tells the model how related two tokens are, but nothing in that computation inherently encodes where each token sits in the sequence. Without an explicit fix, attention would treat a sentence as an unordered 'bag of tokens.'

![Figure 5.1 — Positional information is added to each token's embedding before it enters the first transformer layer.](/LLM_images/image_9.png)

**Figure 5.1** — Positional information is added to each token's embedding before it enters the first transformer layer.

## 5.1 Why Order Matters and Attention Alone Doesn't Capture It

'The dog chased the cat' and 'The cat chased the dog' contain exactly the same tokens — only their order differs, and that order completely changes the meaning. Since raw attention scores are computed the same way regardless of token position, the architecture needs an explicit mechanism to inject position information, or these two sentences would look identical to the attention mechanism.

:::definition
**Positional Encoding**
Positional encoding is a vector added to (or otherwise combined with) each token's embedding, encoding that token's position in the sequence, so the model can distinguish 'first word' from 'fifth word' from 'fiftieth word' even though attention itself is position-agnostic.
:::

## 5.2 A Few Approaches, Briefly

| Approach | Core Idea |
|---|---|
| Sinusoidal (original transformer) | Fixed sine/cosine patterns at different frequencies, not learned, generalizes to unseen lengths |
| Learned positional embeddings | A trainable vector per position, learned during training like any other parameter |
| Rotary Position Embedding (RoPE) | Encodes relative position by rotating Q/K vectors; used in many modern LLMs (Advanced level) |

:::tip
You don't need to memorize the mathematics behind each approach at this level — what matters is the underlying problem they all solve: giving a fundamentally order-agnostic attention mechanism a reliable sense of sequence order. RoPE specifically is covered in more depth in the Advanced level, since it directly affects context length and modern architecture choices.
:::`,

12: `# TOPIC 6: LLM Training

The training pipeline — pretraining, SFT, RLHF — was covered conceptually earlier in this curriculum. This topic returns to that pipeline with the architecture knowledge you now have, focusing on what's mechanically happening during training at the level of the transformer itself.

## 6.1 What 'Training' Actually Updates

Training a transformer means adjusting every learned weight in the network — the embedding table, every attention head's Q/K/V projections, every feed-forward layer, everything — to reduce the model's next-token prediction error across the training data. This happens through backpropagation and gradient descent: the model makes a prediction, the error is measured, and every weight is nudged slightly in the direction that would have reduced that specific error.

| Term | Plain-English Meaning |
|---|---|
| Forward pass | Running an input through the network to produce a prediction |
| Loss | How wrong that prediction was, compared to the actual next token in the training data |
| Backward pass (backpropagation) | Computing how much each individual weight contributed to that error |
| Optimizer step | Actually updating each weight, slightly, in the direction that reduces the loss |
| Batch | A group of training examples processed together before each weight update |

## 6.2 Why This Is Astonishingly Expensive at Scale

A frontier LLM might have hundreds of billions of weights, trained on trillions of tokens, with each token requiring a full forward and backward pass through every one of those weights. This is why pretraining a frontier model requires thousands of specialized GPUs running for weeks or months — and why virtually no one outside a handful of well-resourced labs pretrains a foundation model from scratch. Everything you'll do practically in this field builds on top of already-trained weights.

:::insight
**Why This Matters**
Understanding what training actually costs computationally explains why lightweight adaptation techniques like PEFT and LoRA are such a big deal: they achieve meaningful behavior change by training a tiny fraction of a percent of the total weights, instead of repeating this entire enormously expensive process.
:::

:::note
This closes the Intermediate level. You now have a working mechanical model of what happens between a prompt and a response: tokenize, embed, add positional information, pass through N transformer blocks (each combining multi-head attention with a feed-forward network), then project to a probability distribution and sample. The Advanced level goes further into how this gets optimized, scaled, and varied in modern architectures.
:::`,

13: `# TOPIC 1: Advanced Attention

The multi-head attention from the Intermediate level is powerful but computationally expensive — its cost grows quadratically with sequence length, since every token attends to every other token. This topic covers the variants modern models use to make attention faster and cheaper, especially for long contexts.

## 1.1 Why Standard Attention Gets Expensive

In standard self-attention, every one of N tokens computes a score against every other token — N × N comparisons. Double the sequence length, and the compute (and memory) required roughly quadruples. This quadratic scaling is the single biggest technical obstacle to longer context windows, and a large fraction of modern architecture research is specifically aimed at reducing it.

| Attention Variant | Core Idea | Benefit |
|---|---|---|
| Multi-Query Attention (MQA) | All heads share a single Key and Value projection, only Queries stay per-head | Much smaller KV cache, faster inference |
| Grouped-Query Attention (GQA) | A middle ground — groups of heads share Key/Value projections | Most of MQA's speed with less quality loss |
| Sliding Window Attention | Each token only attends to a fixed-size local window, not the full sequence | Linear rather than quadratic scaling |
| Sparse Attention | Only a structured subset of token pairs are compared, not all of them | Reduces compute for very long sequences |

:::insight
**Why This Matters**
GQA in particular has become close to a modern default, used in many recent open-weight models — it's a big part of why newer models can offer much longer context windows without a proportional explosion in serving cost, compared to models trained just a couple of years earlier with standard multi-head attention.
:::

## 1.2 RoPE, Revisited

Rotary Position Embedding (RoPE), introduced briefly in the Intermediate level, deserves a second look here because of a specific advanced property: it encodes relative position (how far apart two tokens are) rather than absolute position, by rotating Query and Key vectors based on position before computing attention scores. This relative framing is a major reason RoPE-based models can be extended to longer context windows after training more gracefully than models using fixed absolute positional embeddings.`,

14: `# TOPIC 2: Transformer Internals

This topic fills in the pieces of the transformer block that Intermediate Topic 2 named but didn't unpack: layer normalization, residual connections, and the feed-forward network — unglamorous but essential components that determine whether a deep stack of transformer blocks trains successfully at all.

## 2.1 Residual Connections: Why Deep Stacks Don't Collapse

:::definition
**Residual Connection**
A residual (or skip) connection adds a sub-layer's input directly to its output, rather than only passing the transformed result forward. This gives gradients a direct path backward through the network during training, which is essential for training very deep stacks — without residual connections, stacking dozens or hundreds of layers tends to make training unstable or fail outright.
:::

This is the 'Add' half of the 'Add & Layer Norm' step you saw in the transformer block diagram — a small architectural detail that turns out to be critical. Residual connections were actually introduced earlier, in image recognition networks (ResNets), before being adopted into the transformer.

## 2.2 Layer Normalization: Keeping Numbers Well-Behaved

As data flows through dozens or hundreds of stacked layers, the scale of the numbers involved can drift and grow unstable, making training difficult. Layer normalization rescales the values flowing through the network at each step, keeping them in a consistent, well-behaved range — a form of numerical housekeeping that, in practice, makes the difference between a deep transformer training successfully and one that doesn't converge at all.

## 2.3 The Feed-Forward Network's Role

While attention mixes information across different token positions, the feed-forward network inside each block processes each token's representation independently, typically expanding it to a much larger intermediate size before compressing it back down. If attention is where tokens exchange information with each other, the feed-forward network is where the model does per-token computation on the information it just gathered — commonly understood as where much of the model's factual and pattern-based knowledge is actually stored.

:::note
A rough mental split worth keeping: attention handles 'which other tokens matter to me and how,' while the feed-forward network handles 'given what I now know, what should I do with it.' Both repeat at every one of the N stacked blocks.
:::`,

15: `# TOPIC 3: LLM Scaling

Scale correlates with capability, as covered earlier in this curriculum. This topic makes that relationship precise: the scaling laws that let researchers predict, with real accuracy, how much a model will improve before it's ever trained.

![Figure 3.1 — Loss falls predictably as compute, data, and parameters scale up, following a power-law curve.](/LLM_images/image_10.png)

**Figure 3.1** — Loss falls predictably as compute, data, and parameters scale up, following a power-law curve.

## 3.1 What a Scaling Law Actually Says

:::definition
**Scaling Law**
A scaling law is an empirically observed, remarkably predictable relationship between a model's size (parameters), the amount of training data, the compute used to train it, and the resulting loss — typically following a power-law curve where loss decreases smoothly and predictably as any of these factors increases, with diminishing but non-zero returns.
:::

The practical significance is hard to overstate: labs can train a series of small, cheap models, measure how loss falls as they scale up each factor, and extrapolate that curve to predict — with meaningful accuracy — how a much larger, far more expensive model will perform before committing the budget to train it.

## 3.2 The Three Scaling Levers

| Lever | What Increasing It Means |
|---|---|
| Parameters | A larger network, with more weights to represent patterns |
| Data | More training tokens, exposing the model to more of language and the world |
| Compute | More total training operations — a function of both model size and data, run for longer |

A key research finding (often associated with the 'Chinchilla' scaling study) is that these levers must be scaled together, in roughly the right proportion, for a given compute budget — a very large model trained on too little data underperforms a smaller model trained on proportionally more data, for the same total compute cost. This finding shifted the industry's training strategy noticeably: several older large models were, in retrospect, undertrained relative to their size.

:::insight
**Why This Matters**
Scaling laws are the reason model releases follow a predictable cadence of 'bigger and better' rather than random walks in capability — labs aren't guessing. This is also why a smaller model trained well past the old scaling recommendations can outperform an older, larger model at a fraction of the inference cost.
:::`,

16: `# TOPIC 4: LLM Inference

Training happens once. Inference — actually running the trained model to generate responses — happens every single time someone sends a prompt, at massive scale, and its efficiency directly determines cost and latency for every application built on top of an LLM.

![Figure 4.1 — A KV cache avoids recomputing attention over the entire context at every new token.](/LLM_images/image_11.png)

**Figure 4.1** — A KV cache avoids recomputing attention over the entire context at every new token.

## 4.1 The KV Cache: Inference's Most Important Optimization

Recall from Intermediate Topic 3 that attention requires computing Keys and Values for every token in the context. Without optimization, generating each new token would mean recomputing Keys and Values for the entire growing sequence from scratch — wasteful, since earlier tokens' Keys and Values never change. A KV cache stores these values after they're first computed and reuses them, so each new token only requires computing its own Query, Key, and Value once, then attending back to everything already cached.

:::insight
**Why This Matters**
The KV cache is the single biggest reason modern LLM inference is as fast as it is. It's also the direct reason longer conversations use more memory on the serving side (the cache grows with context length) — a major factor in how much a provider can charge and how many concurrent users a given amount of GPU memory can serve, which is exactly why memory-efficient attention variants like GQA (Topic 1) matter so much at deployment scale.
:::

## 4.2 Two Phases of Inference

| Phase | What Happens | Bottleneck |
|---|---|---|
| Prefill | The entire prompt is processed at once, building the initial KV cache | Compute-bound — highly parallelizable |
| Decode | Tokens are generated one at a time, each attending back to the cache | Memory-bandwidth-bound — inherently sequential |

:::note
This two-phase split explains a pattern you may have noticed using LLM products: there's often a brief pause before the response starts streaming (prefill, proportional to prompt length), followed by a steadier token-by-token stream (decode, roughly constant speed per token) — two genuinely different computational regimes, not a single uniform process.
:::`,

17: `# TOPIC 5: Modern LLM Architectures

The 2017 transformer described in this course is the ancestor of every modern LLM, but production architectures today include years of refinements. This topic surveys the architectural choices that distinguish current-generation models.

![Figure 5.1 — Dense models activate every parameter per token; Mixture-of-Experts models activate only a relevant subset.](/LLM_images/image_12.png)

**Figure 5.1** — Dense models activate every parameter per token; Mixture-of-Experts models activate only a relevant subset.

## 5.1 Mixture-of-Experts (MoE), Revisited

Mixture-of-Experts (MoE) was introduced earlier at a conceptual level. Architecturally, MoE replaces a transformer block's single feed-forward network with several parallel 'expert' feed-forward networks and a learned gating mechanism that routes each token to only a small subset (often just 1–2) of those experts. This lets a model have a very large total parameter count — and thus a large capacity to store patterns — while keeping the compute cost per token similar to a much smaller dense model.

| Architectural Choice | What It Affects |
|---|---|
| Dense vs. MoE feed-forward layers | Total capacity vs. per-token inference cost |
| Attention variant (MHA / GQA / MQA) | Quality vs. KV cache size and inference speed |
| Positional encoding (RoPE, ALiBi, etc.) | How well the model generalizes to longer contexts than it was trained on |
| Normalization placement & type | Training stability, especially at very large scale |
| Activation function (e.g. SwiGLU vs. ReLU) | Modest but real gains in training efficiency and final quality |

## 5.2 Reasoning-Oriented Architectures and Training

A newer trend is models specifically trained to generate extended intermediate reasoning before producing a final answer — sometimes with additional reinforcement learning specifically rewarding correct multi-step reasoning traces, not just the final answer's quality. This is less a change to the core transformer block itself and more a change in training objective and inference-time behavior, but it represents one of the most active areas of current architecture and training research.

:::tip
You don't need to track every named architectural variant as it's published — new attention and efficiency tricks appear frequently. What's durable is the underlying pattern: nearly every modern refinement is optimizing one of a small number of things — inference cost, training stability, or context length — using the same core transformer block from Intermediate Topic 2 as its foundation.
:::`,

18: `# TOPIC 6: LLM Architecture Analysis

This closing topic brings the whole course together: given a new model's published specs, how do you actually read and reason about them? This is a practical skill for the model-selection decisions you'll make constantly in real projects.

## 6.1 Reading a Model Card

| Spec You'll See | What It Tells You | Connects to |
|---|---|---|
| Parameter count | Rough capacity signal, but not the whole story (see MoE) | Advanced Topic 5 |
| Context window | Maximum tokens the model can process at once | Basic Topic 2, Advanced Topic 1 |
| Attention type (if disclosed) | Inference efficiency and KV cache size implications | Advanced Topics 1 & 4 |
| Training data cutoff | How current the model's knowledge is | Basic Topic 5 (Limitations) |
| Active vs. total parameters (for MoE models) | The real per-token compute cost, distinct from total capacity | Advanced Topic 5 |

## 6.2 Questions Worth Asking About Any New Model

- Dense or MoE? If MoE, what's the active parameter count — that number matters more for cost and latency than the total.
- What attention variant, if disclosed? This hints at how efficiently the model will serve long-context requests.
- What's the context window, and does the model's quality hold up near that limit, or degrade well before it (a common real-world gap between advertised and effective context length)?
- Is this a reasoning-oriented model or a standard instruction-tuned model? They're often priced and evaluated differently.

:::insight
**Why This Matters**
This kind of informed reading directly feeds into the model-selection decisions you'll make constantly — you're no longer choosing a model based on marketing claims or a leaderboard position alone, but based on an understanding of what its architecture actually implies for your specific task's cost, latency, and context needs.
:::

:::note
This closes the course. You now have a working understanding of the full path from raw text to a trained model's response — tokenization, embeddings, attention, the transformer block, training, scaling, and inference — the mechanical foundation underneath every remaining topic in this curriculum, from Prompt Engineering through Agent Architectures.
:::`,

}

export default llmTransformersContent
