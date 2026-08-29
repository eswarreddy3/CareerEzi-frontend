// Generative AI Fundamentals — Basic → Intermediate → Advanced (18 topics)
// Extracted verbatim from GenAI-Fundamentals.docx (Course 2 of 9, Generative AI domain).
// Diagrams served from /public/GenAI_images/image_*.png
// Course id: "genai-fundamentals"  →  registered in content/index.ts
//
// Create these in the super-admin UI (/super-admin/courses); lesson `order` is
// global across the course, so it must match the keys below exactly.
//
//   Basic         — What Generative AI actually is, where it fits, and the landscape you're stepping into.
//     1  Introduction to Generative AI        4  Generative AI Applications
//     2  Generative AI Ecosystem              5  GenAI Limitations
//     3  Types of Generative Models           6  GenAI Development Landscape
//   Intermediate  — Going one layer deeper: how foundation models are built, trained, and shaped into real applications.
//     7  Foundation Models                   10  Multimodal Generative AI
//     8  Large Language Models               11  Model Capabilities & Limitations
//     9  Model Training Concepts             12  GenAI Architecture Patterns
//   Advanced      — System-level thinking: the full lifecycle, adaptation strategy, model selection, and production architecture.
//    13  LLM Lifecycle                       16  Generative AI System Design
//    14  Model Adaptation                    17  Advanced GenAI Patterns
//    15  Model Selection                     18  GenAI Trends & Emerging Technologies

const genaiFundamentalsContent: Record<number, string> = {
1: `# TOPIC 1: Introduction to Generative AI

Generative AI refers to a class of artificial intelligence systems that create new content — text, images, audio, code, or video — rather than simply analyzing or classifying existing content. It is the technology behind tools like ChatGPT, Claude, Midjourney, and GitHub Copilot, and it represents one of the fastest shifts in how software gets built in the last decade.

:::definition
**Generative AI**
Generative AI (GenAI) is a category of AI models that learn the underlying patterns and structure of training data well enough to generate new, original examples that plausibly could have come from that same data — a new sentence, a new image, a new melody — rather than only labeling or scoring existing input.
:::

:::insight
**Why This Matters**
Every other topic in this course builds on this one distinction. Once you can clearly separate 'generating new content' from 'classifying existing content,' concepts like prompting, RAG, fine-tuning, and agents all become variations on the same generative core rather than separate, unrelated ideas.
:::

## 1.1 Generative vs. Discriminative AI

Traditional machine learning is dominated by discriminative models: systems trained to draw a boundary between existing categories — is this email spam or not, is this transaction fraudulent or not, is this a cat or a dog. A generative model instead learns the full distribution the data came from, which means it can sample from that distribution to produce something new.

![Figure 1.1 — Discriminative AI classifies existing input; Generative AI produces new content.](/GenAI_images/image_1.png)

**Figure 1.1** — Discriminative AI classifies existing input; Generative AI produces new content.

| Aspect | Discriminative Model | Generative Model |
|---|---|---|
| What it learns | A decision boundary between labels | The underlying data distribution itself |
| Typical output | A label or a score | New text, image, audio, or code |
| Example task | Spam vs. not spam | Write a new email from a description |
| Example model | Logistic regression, a spam classifier | GPT, Claude, Stable Diffusion |

## 1.2 A Short History, in Three Waves

- Wave 1 — Statistical & rule-based generation (pre-2014): Markov chains and template systems produced crude, often incoherent text; useful for narrow tasks only.
- Wave 2 — Deep generative models (2014–2020): GANs (2014) and VAEs made realistic image generation possible; early transformer language models (2017 onward) showed language generation could scale.
- Wave 3 — Foundation models & the LLM era (2020–present): massive transformer models trained on internet-scale data, refined with RLHF, made general-purpose, instruction-following generative AI available as a product for the first time (GPT-3 in 2020, ChatGPT in 2022, and the current generation of frontier models).

:::note
You don't need to memorize exact years or paper names. What matters is the shape of the trend: each wave made generation more general-purpose and more controllable — from narrow, brittle output to fluent, instructable, multi-domain generation.
:::

## 1.3 What Makes Modern GenAI Different

Three properties distinguish the current generation of generative AI from everything before it: scale (models trained on a meaningful fraction of all publicly available text), generality (one model handles translation, coding, summarization, and reasoning without being retrained for each), and instructability (you can steer behavior with plain-language prompts instead of writing new code for every new task).

:::tip
When someone asks 'what is Generative AI, in one sentence?' — a strong answer is: 'AI that has learned the patterns in data well enough to produce believable new examples of that data, and that you can steer with plain language instead of code.' Both halves of that sentence matter.
:::`,

2: `# TOPIC 2: Generative AI Ecosystem

No single company or tool 'is' Generative AI — it's an ecosystem of layers that stack on top of each other, from raw training data at the bottom to the chat app or copilot a user actually touches at the top. Understanding these layers helps you know where a new tool or headline actually fits.

![Figure 2.1 — The five layers of the Generative AI ecosystem, from raw data to the application a user touches.](/GenAI_images/image_2.png)

**Figure 2.1** — The five layers of the Generative AI ecosystem, from raw data to the application a user touches.

## 2.1 The Five Layers

| Layer | What Lives Here | Examples |
|---|---|---|
| Data | Training corpora, embeddings, eval/fine-tuning datasets | Common Crawl, licensed datasets, proprietary company data |
| Infrastructure | Compute, hosting, storage, vector databases | GPU clouds, Pinecone, Chroma, model-serving stacks |
| Model | The foundation models themselves | GPT, Claude, Gemini, Llama, Mistral |
| Orchestration | Frameworks that connect models to tools & data | LangChain, LangGraph, LlamaIndex |
| Application | What the end user actually interacts with | Chatbots, copilots, RAG search assistants, agents |

:::insight
**Why This Matters**
Most 'is GenAI hype' confusion comes from conflating layers. A new model release (model layer) is a different kind of news than a new agent framework (orchestration layer) or a new consumer app (application layer) — they move at different speeds and matter to different people.
:::

## 2.2 Open vs. Closed Models

Within the model layer, a key distinction is closed/proprietary models (accessed only through an API, weights never released — e.g. GPT, Claude, Gemini) versus open-weight models (weights are downloadable and can be run or fine-tuned locally — e.g. Llama, Mistral, and many Hugging Face community models). This choice shapes cost, control, privacy, and customization options for everything built on top.

:::mistake
'Open source' and 'open weight' are often used loosely and interchangeably, but they are not the same thing. Most 'open' LLMs release the trained weights (open-weight) without releasing the full training data or training code — true end-to-end open-source models remain comparatively rare.
:::`,

3: `# TOPIC 3: Types of Generative Models

'Generative AI' is an umbrella term covering several genuinely different model families. They share the goal of producing new content, but the mechanisms differ significantly — and knowing which family a model belongs to tells you a lot about its strengths, weaknesses, and typical use case.

![Figure 3.1 — The major families of generative models and representative examples of each.](/GenAI_images/image_3.png)

**Figure 3.1** — The major families of generative models and representative examples of each.

## 3.1 Generative Adversarial Networks (GANs)

:::definition
**GAN (Generative Adversarial Network)**
A GAN pits two neural networks against each other: a Generator that tries to produce realistic fake data, and a Discriminator that tries to tell real data from the Generator's fakes. Both improve through this competition until the Generator produces output the Discriminator can no longer reliably distinguish from real data.
:::

GANs were historically dominant for photorealistic image generation (StyleGAN faces, deepfakes) and are still used for tasks like image super-resolution and style transfer, though diffusion models have overtaken them for most general image generation.

## 3.2 Variational Autoencoders (VAEs)

A VAE compresses input data into a smaller 'latent space' representation (encoding) and then reconstructs data from that compressed representation (decoding). By sampling new points in the latent space, a VAE can generate new, plausible outputs. VAEs tend to produce smoother but blurrier results than GANs, and are prized for having a well-structured, interpretable latent space.

## 3.3 Diffusion Models

Diffusion models — the technology behind Stable Diffusion, DALL-E, and Midjourney — work by learning to reverse a gradual noising process. During training, images are progressively corrupted with random noise; the model learns to predict and remove that noise step by step. To generate a new image, the model starts from pure random noise and denoises it, guided by a text prompt, into a coherent image.

:::note
Diffusion models currently dominate image and video generation because they tend to produce higher-fidelity, more diverse output than GANs and are more stable to train, even though generation is comparatively slower since it happens over many denoising steps.
:::

## 3.4 Autoregressive Models & Transformer-Based LLMs

Autoregressive models generate output one piece at a time, with each new piece conditioned on everything generated so far. Large Language Models are the most prominent example: they generate text one token at a time, each token predicted from all previous tokens. Modern LLMs combine this autoregressive approach with the transformer architecture's self-attention mechanism (covered in full depth in Course 3), which is what allows them to scale to hundreds of billions of parameters while remaining trainable.

| Model Family | Core Mechanism | Best Known For | Example Tools |
|---|---|---|---|
| GANs | Generator vs. Discriminator competition | Photorealistic faces, style transfer | StyleGAN, CycleGAN |
| VAEs | Encode → compress → decode | Structured latent spaces, anomaly detection | Beta-VAE, VQ-VAE |
| Diffusion Models | Learn to reverse a noising process | Image & video generation | Stable Diffusion, DALL-E, Midjourney |
| Autoregressive / Transformer LLMs | Predict the next token from all prior tokens | Text, code, reasoning, chat | GPT, Claude, Gemini, Llama |`,

4: `# TOPIC 4: Generative AI Applications

Generative AI has moved from research demos to production use across nearly every knowledge-work domain. This topic maps the main application categories you'll encounter — and later build — across the rest of this course.

## 4.1 Application Categories by Modality

| Modality | Representative Applications | Example Tools |
|---|---|---|
| Text | Chatbots, drafting & summarization, code generation, translation | ChatGPT, Claude, GitHub Copilot |
| Image | Text-to-image art, product mockups, image editing/inpainting | Midjourney, DALL-E, Stable Diffusion |
| Audio | Text-to-speech, voice cloning, music generation | ElevenLabs, Suno, Murf |
| Video | Text-to-video, video editing, avatar generation | Sora, Runway, Synthesia |
| Code | Autocomplete, code generation, code review, test generation | GitHub Copilot, Cursor, Claude Code |

## 4.2 Application Categories by Business Function

- Customer support — chatbots that resolve tickets, draft responses, or summarize long threads for a human agent.
- Content & marketing — first-draft blog posts, ad copy variants, product descriptions at scale.
- Software engineering — code completion, code review assistance, automated test generation, documentation.
- Knowledge management — RAG-based search assistants that answer questions over internal company documents.
- Data & analytics — natural-language-to-SQL, automated report summarization, anomaly explanation.

:::insight
**Why This Matters**
Recognizing these categories helps you scope a real project quickly: 'we need a customer support chatbot grounded in our documentation' immediately tells you you're building a text-modality, knowledge-management RAG application — which points to specific tools you'll study in Course 5 and Course 6.
:::`,

5: `# TOPIC 5: GenAI Limitations

Generative AI is powerful but not magic. Understanding its real limitations — not just its capabilities — is what separates a developer who builds reliable systems from one who gets blindsided in production. Every limitation below reappears later in this course as a design constraint you'll actively work around.

## 5.1 Hallucination

:::definition
**Hallucination**
Hallucination is when a generative model produces output that is fluent and confident-sounding but factually incorrect or entirely fabricated — an invented citation, a nonexistent API function, a fake statistic — presented with the same tone of confidence as accurate output.
:::

Hallucination happens because LLMs are fundamentally next-token predictors optimized to produce plausible-sounding text, not verified-fact retrievers. Nothing in the base architecture checks output against ground truth at generation time — which is exactly the gap that Retrieval-Augmented Generation (Course 5) is designed to narrow.

## 5.2 Other Core Limitations

| Limitation | What It Means | Common Mitigation |
|---|---|---|
| Knowledge cutoff | The model has no knowledge of events after its training data was collected | Web search tools, RAG over current data |
| Bias | Models can reproduce and amplify biases present in training data | Curated data, evaluation for fairness, guardrails |
| Reasoning limits | Struggles with precise multi-step logic, arithmetic, and long-horizon planning | Chain-of-thought prompting, tool use (e.g. a calculator) |
| Context window limits | Can only 'see' a finite amount of text at once | Chunking, summarization, RAG |
| Cost & latency | Large models are computationally expensive and can be slow | Smaller models for simple tasks, caching |

:::mistake
A dangerous mental model is 'the model is basically a search engine that knows things.' It's closer to 'a system that produces the statistically most plausible continuation of your prompt' — which is usually correct, but is not the same guarantee as factual retrieval. Treat unverified factual claims from an LLM the way you'd treat a claim from a confident but unverified colleague.
:::

## 5.3 Non-Determinism

The same prompt sent twice to an LLM can produce different wording, and occasionally different conclusions, because generation involves sampling from a probability distribution over possible next tokens. This is fundamentally different from traditional software, where the same input reliably produces the same output — and it has real consequences for testing, evaluation, and user trust, which you'll address directly in Course 9 (GenAI Evaluation & Production).

:::note
None of these limitations mean GenAI is unreliable by default — they mean reliable GenAI systems are engineered, not assumed. Every advanced topic later in this course (RAG, evaluation, guardrails, system design) exists specifically to manage one or more of the limitations listed here.
:::`,

6: `# TOPIC 6: GenAI Development Landscape

Before writing your first line of GenAI code, it helps to have a mental map of who builds what. This topic closes out the Basic level by surveying the landscape of model providers, open-source projects, tooling, and infrastructure you'll navigate throughout the rest of this course.

![Figure 6.1 — The GenAI development landscape organized into four overlapping areas.](/GenAI_images/image_4.png)

**Figure 6.1** — The GenAI development landscape organized into four overlapping areas.

## 6.1 The Major Players

| Category | Who's There | What They Provide |
|---|---|---|
| Frontier model labs | OpenAI, Anthropic, Google DeepMind, Meta AI | Foundation models, accessed via API or open weights |
| Open-source hubs | Hugging Face, EleutherAI | Model hosting, datasets, community fine-tunes |
| Orchestration frameworks | LangChain, LangGraph, LlamaIndex | Glue code connecting models to tools, memory, and data |
| Vector databases | Pinecone, Chroma, Weaviate, pgvector | Storage & similarity search for embeddings (Course 5) |
| Cloud & GPU infrastructure | AWS, GCP, Azure, RunPod, Modal | Compute for hosting, fine-tuning, and inference |

## 6.2 How to Navigate a Fast-Moving Field

- Anchor to fundamentals, not tools — transformer architecture, RAG, fine-tuning concepts stay stable even as specific product names change every few months.
- Treat model leaderboards as a rough signal, not gospel — benchmarks are frequently gamed or don't reflect your specific use case; always test on your own task.
- Expect vendor lock-in risk — building your application logic around a specific SDK makes switching providers costly later; the Service Pattern from Course 1 (Advanced) exists specifically to reduce this risk.

:::tip
A practical habit: bookmark one or two high-signal sources (a model provider's official changelog, and a well-regarded independent benchmark site) rather than trying to track every daily headline — the field moves fast, but the fundamentals you're learning in this course change slowly.
:::`,

7: `# TOPIC 1: Foundation Models

At the Basic level you learned that GenAI produces new content. Now we go one layer deeper: almost every application you'll build sits on top of a foundation model — a single, general-purpose model trained once, at enormous cost, and then adapted many different ways for many different downstream uses.

:::definition
**Foundation Model**
A foundation model is a large model trained on broad, diverse data at scale, designed to be adapted (via prompting, fine-tuning, or other techniques) to a wide range of downstream tasks — rather than being trained from scratch for each individual task, as was standard before this approach became dominant.
:::

![Figure 1.1 — One foundation model, pretrained once, becomes the base for many downstream applications.](/GenAI_images/image_5.png)

**Figure 1.1** — One foundation model, pretrained once, becomes the base for many downstream applications.

## 1.1 Why 'Foundation' Is the Right Word

Before foundation models, building an AI system for a new task typically meant collecting task-specific labeled data and training a model from scratch for that task alone — expensive, slow, and each model useful for only one narrow job. A foundation model inverts this: pretraining happens once, on general data, producing a model with broad capabilities that many teams can then adapt cheaply and quickly to their specific needs.

:::insight
**Why This Matters**
This single shift — train once, adapt many times — is the economic engine behind the entire modern GenAI industry. It's why a startup can build a competitive product without training a model from scratch, and it's the reason Course 7 (Fine-Tuning) and Advanced Topic 2 of this course (Model Adaptation) exist as dedicated subjects.
:::

## 1.2 Properties of Foundation Models

| Property | What It Means in Practice |
|---|---|
| Scale | Trained on massive datasets (often trillions of tokens) using massive compute |
| Generality | Not built for one task — capable of translation, coding, reasoning, and more from one model |
| Emergent capabilities | Some abilities appear only past a certain scale, not by explicit design |
| Adaptability | Serves as a starting point for fine-tuning, RAG, or prompt-based specialization |

:::note
Not every foundation model is a language model — foundation models exist for images (e.g. models behind Stable Diffusion), audio, and increasingly multimodal combinations. 'Foundation model' describes a training philosophy and role in the ecosystem, not one specific architecture or modality.
:::`,

8: `# TOPIC 2: Large Language Models

Large Language Models (LLMs) are the specific, dominant type of foundation model behind the current wave of Generative AI products. This topic gives you the conceptual map; Course 3 (Large Language Models & Transformers) covers the internal architecture in full technical depth.

:::definition
**Large Language Model (LLM)**
An LLM is a foundation model trained primarily on text, built on the transformer architecture, that learns statistical patterns of language well enough to generate coherent text, answer questions, follow instructions, and perform a wide range of language-based tasks — all from a single set of trained weights.
:::

## 2.1 What 'Large' Actually Refers To

'Large' in LLM refers primarily to parameter count — the number of learned numerical weights inside the network, often in the tens or hundreds of billions — and to the scale of training data, typically measured in trillions of tokens. Both dimensions correlate loosely with capability, but scale alone doesn't guarantee quality; training data quality, architecture choices, and post-training (Topic 3 below) all matter enormously.

| Model Size Class | Rough Parameter Range | Typical Use Case |
|---|---|---|
| Small / edge models | < 3B parameters | On-device, latency-sensitive tasks, simple classification |
| Mid-size models | 3B – 30B parameters | Cost-efficient general assistants, self-hosted deployments |
| Large / frontier models | 70B+ parameters (exact counts often undisclosed) | Complex reasoning, coding, high-stakes applications |

:::mistake
Exact parameter counts for the most capable closed models (GPT-4-class, Claude, Gemini) are usually not publicly disclosed by their providers. Treat any specific number you see quoted online for these models with skepticism unless it comes directly from the provider.
:::

## 2.2 What LLMs Are Good and Bad At

- Strong: fluent language generation, summarization, translation, code generation, following nuanced instructions, broad general knowledge up to a training cutoff.
- Weak by default: precise arithmetic on large numbers, guaranteed factual accuracy, truly long-horizon multi-step planning without external structure, and access to information after their training cutoff.

:::tip
A useful shorthand: LLMs are excellent language engines but unreliable calculators and unreliable up-to-the-minute encyclopedias. Course 4 (Prompt Engineering) and Course 5 (RAG) are largely about compensating for exactly this gap.
:::`,

9: `# TOPIC 3: Model Training Concepts

How does a foundation model go from 'predicts the next word reasonably well' to 'a helpful, instructable assistant like Claude or ChatGPT'? The answer is a multi-stage training pipeline. This topic explains each stage conceptually — Course 7 covers the hands-on fine-tuning mechanics.

![Figure 3.1 — The multi-stage pipeline that turns a raw pretrained model into a helpful, aligned assistant.](/GenAI_images/image_6.png)

**Figure 3.1** — The multi-stage pipeline that turns a raw pretrained model into a helpful, aligned assistant.

## 3.1 Stage 1 — Pretraining

Pretraining is the initial, most expensive stage: the model is trained on a huge corpus of text (web pages, books, code, and more) to predict the next token given all previous tokens — a task called next-token prediction, or more formally, self-supervised learning, since the 'labels' (the actual next word) come for free from the raw text itself, no human annotation required. The result is a base model: fluent, but not yet aligned to follow instructions or behave safely by default.

## 3.2 Stage 2 — Supervised Fine-Tuning (SFT)

In SFT, the base model is further trained on a smaller, curated dataset of high-quality prompt → ideal-response pairs, often written or reviewed by human annotators. This stage teaches the model to follow instructions and respond in a helpful, structured way, rather than simply continuing text in whatever direction is statistically most likely.

## 3.3 Stage 3 & 4 — Reward Modeling and RLHF

:::definition
**RLHF (Reinforcement Learning from Human Feedback)**
RLHF is a training technique where human evaluators rank multiple model outputs for the same prompt from best to worst; a separate reward model learns to predict these human preferences, and the main model is then further trained using reinforcement learning to produce outputs the reward model scores highly.
:::

RLHF is what pushes a model from 'follows instructions' toward 'follows instructions in the way people actually prefer' — more helpful, more honest, and safer refusals on harmful requests. It's a major reason modern assistants feel noticeably more aligned with user intent than earlier, purely pretrained-and-SFT'd models.

:::insight
**Why This Matters**
Every quality you experience when talking to a well-behaved assistant — helpfulness, appropriate refusals, following formatting instructions — is a direct product of this post-training pipeline, not the pretraining stage alone. This is why two models with similar pretraining scale can feel very different to actually use.
:::

:::note
You will rarely, if ever, run full pretraining yourself — it requires resources only a handful of organizations have. What you will do constantly, starting in Course 7, is lightweight adaptation on top of an already-trained foundation model (fine-tuning, LoRA) — a vastly cheaper operation than any of the four stages shown above.
:::`,

10: `# TOPIC 4: Multimodal Generative AI

Early generative models were single-modality specialists — a model for text, a separate model for images. Modern frontier models are increasingly multimodal: a single model that can accept and/or produce more than one type of content.

:::definition
**Multimodal Model**
A multimodal model is a generative model capable of processing and/or producing more than one modality — such as text, images, audio, or video — often by learning a shared internal representation space where concepts from different modalities can be related to one another.
:::

![Figure 4.1 — A multimodal model accepting multiple input types and producing multiple output types.](/GenAI_images/image_7.png)

**Figure 4.1** — A multimodal model accepting multiple input types and producing multiple output types.

## 4.1 Common Multimodal Capabilities Today

| Capability | What It Does | Example |
|---|---|---|
| Vision-language (image → text) | Understands and describes image content | Ask Claude to describe a chart in a screenshot |
| Text-to-image | Generates an image from a text description | Midjourney, DALL-E |
| Speech-to-text | Transcribes spoken audio into text | Whisper |
| Text-to-speech | Generates natural-sounding spoken audio from text | ElevenLabs |
| Text-to-video | Generates short video clips from a text description | Sora, Runway |

## 4.2 Why Multimodality Is Hard

Different modalities have fundamentally different structures — text is discrete and sequential, images are continuous and spatial, audio is continuous and temporal. Building one model that reasons well across all of them requires representations general enough to bridge these structural differences without losing the fine-grained detail each modality needs. This is an active, fast-moving area of research, which is why multimodal capabilities are advancing especially quickly release over release.

:::tip
When evaluating whether to use a multimodal model for a task, ask: does the task genuinely require reasoning across modalities (e.g. 'read this chart and summarize the trend'), or would a simpler, cheaper single-modality pipeline (e.g. OCR + a text-only LLM) work just as well? Multimodal capability adds cost and complexity that isn't always necessary.
:::`,

11: `# TOPIC 5: Model Capabilities & Limitations

Topic 5 of the Basic level introduced limitations at a high level. Now that you understand foundation models, LLMs, and training stages, we can be far more precise about which limitations come from which part of the pipeline — essential for diagnosing real problems later.

## 5.1 Mapping Limitations to Their Source

| Limitation | Root Cause | Which Stage It Traces To |
|---|---|---|
| Knowledge cutoff | Training data has a fixed collection date | Pretraining |
| Hallucination | Model optimized for plausible text, not verified facts | Pretraining (fundamental) + insufficient grounding |
| Refusal on benign requests | Alignment training was overly cautious for the use case | RLHF / alignment stage |
| Inconsistent formatting | Insufficient instruction-following examples in SFT | Supervised fine-tuning |
| Weak math/logic on hard problems | Pattern-based generation, not symbolic computation | Pretraining (architectural, not a training bug) |

:::insight
**Why This Matters**
This mapping matters practically: a hallucination problem is best solved with RAG or grounding (Course 5), while an over-cautious refusal problem is often better solved with clearer system prompts or a different model choice (Advanced Topic 3 of this course) — not with more training data on your end, which you likely can't provide anyway.
:::

## 5.2 Capability Trends Worth Tracking

- Reasoning-focused models — a newer class of models trained to 'think' through intermediate steps before answering, substantially improving performance on multi-step logic and math (covered in depth in Course 3, Advanced level).
- Longer context windows — the amount of text a model can consider at once has grown from a few thousand tokens to hundreds of thousands, changing what's practical without RAG.
- Lower cost per token over time — capability that required a frontier model two years ago is often available in a much cheaper, smaller model today.`,

12: `# TOPIC 6: GenAI Architecture Patterns

Almost every GenAI application you'll ever build is a variation on a small number of recurring architecture patterns. Recognizing these patterns lets you quickly reason about a new system's cost, complexity, and failure modes — before writing a line of code.

![Figure 6.1 — Four common Generative AI application architecture patterns.](/GenAI_images/image_8.png)

**Figure 6.1** — Four common Generative AI application architecture patterns.

## 6.1 Pattern 1 — Prompt-Only

The simplest pattern: user input becomes a prompt, sent directly to an LLM, whose output is returned as-is. No external data, no tools, no memory beyond the current request. This is sufficient for tasks the model can already do well from its training alone — general Q&A, drafting, brainstorming.

## 6.2 Pattern 2 — RAG (Retrieval-Augmented Generation)

The user's query is first used to retrieve relevant documents from a knowledge base (typically a vector database), which are then inserted into the prompt alongside the original question before calling the LLM. This grounds the model's answer in specific, current, or proprietary information it wasn't necessarily trained on. Full depth in Course 5.

## 6.3 Pattern 3 — Fine-Tuned Model

Instead of (or in addition to) shaping behavior through the prompt, the model's weights themselves are further trained on domain-specific examples, baking the desired behavior, tone, or knowledge directly into the model. Full depth in Course 7.

## 6.4 Pattern 4 — Agentic

The LLM doesn't just respond once — it plans, calls external tools or APIs, observes the results, and repeats this loop until the task is complete, with much less predetermined structure than the previous three patterns. This is the foundation of everything covered in the Agentic AI domain of this curriculum.

| Pattern | Adds External Data? | Adds Actions/Tools? | Relative Complexity |
|---|---|---|---|
| Prompt-Only | No | No | Lowest |
| RAG | Yes | No | Low–Medium |
| Fine-Tuned Model | No (baked into weights) | No | Medium (training effort) |
| Agentic | Often yes | Yes | Highest |

:::note
These patterns are not mutually exclusive — a production system very often combines them: a fine-tuned model, used inside a RAG pipeline, given tool access, wrapped in an agentic loop. Recognizing each piece individually is what lets you understand a complex real system instead of seeing it as one undifferentiated black box.
:::`,

13: `# TOPIC 1: LLM Lifecycle

You've now seen training stages (Intermediate Topic 3) and architecture patterns (Intermediate Topic 6) as separate ideas. The LLM lifecycle connects them into a single continuous loop that describes how a model — and the application built on it — actually lives in production over time.

![Figure 1.1 — The LLM lifecycle is a continuous loop: monitoring and retraining feed back into earlier stages.](/GenAI_images/image_9.png)

**Figure 1.1** — The LLM lifecycle is a continuous loop: monitoring and retraining feed back into earlier stages.

## 1.1 The Seven Stages

| Stage | What Happens |
|---|---|
| Data Collection | Gathering and curating the raw data that will shape the model or its adaptation |
| Pretraining | Large-scale self-supervised training on that data (Intermediate Topic 3) |
| Fine-Tuning & Alignment | SFT and RLHF to make the model instructable and aligned |
| Evaluation | Benchmarking capability, safety, and task-specific quality (Course 9) |
| Deployment | Serving the model behind an API or embedding it in an application |
| Monitoring | Tracking real-world performance, drift, cost, and failures in production |
| Retraining / Updating | Incorporating new data or feedback, closing the loop back to the start |

:::insight
**Why This Matters**
Teams that treat deployment as the finish line consistently get surprised in production — quality silently degrades as real-world usage patterns drift from what was evaluated pre-launch. Treating the lifecycle as a loop, with monitoring feeding back into retraining or re-adaptation, is what separates a demo from a durable product.
:::

## 1.2 Who Owns Which Stage

For most application developers — including everyone following this curriculum — data collection, pretraining, and much of alignment are owned entirely by the model provider (OpenAI, Anthropic, etc.), not by you. Your practical lifecycle ownership typically starts around evaluation and runs through deployment, monitoring, and retraining/updating — usually meaning updating your prompts, your RAG data, or a lightweight fine-tune, not retraining a foundation model.

:::note
This is an important expectation-setting note if you're new to the field: 'working with LLMs' for the overwhelming majority of practitioners means adapting and operating an existing foundation model well, not training one from scratch. That distinction becomes very relevant in the next topic.
:::`,

14: `# TOPIC 2: Model Adaptation

Given a foundation model, how do you actually make it good at your specific task? There is a spectrum of adaptation strategies, ranging from free and instant to extremely expensive — and choosing the right point on that spectrum is one of the highest-leverage decisions in any GenAI project.

![Figure 2.1 — The model adaptation spectrum, from prompting to training from scratch.](/GenAI_images/image_10.png)

**Figure 2.1** — The model adaptation spectrum, from prompting to training from scratch.

## 2.1 The Spectrum, Explained

| Approach | What Changes | Cost & Speed | Best For |
|---|---|---|---|
| Prompt Engineering | Nothing about the model — only the input | Minutes, near-zero cost | Most tasks; always try this first |
| RAG | Nothing about the model — external data added at query time | Hours to days to set up | Grounding answers in specific/current knowledge |
| PEFT (LoRA / QLoRA) | A small number of additional trained parameters | Hours to days, modest compute cost | Teaching a style, format, or narrow skill |
| Full Fine-Tuning | All of the model's weights | Days, significant compute cost | Deep behavioral or domain shifts, at scale |
| Train from Scratch | Everything — no pretrained starting point | Months, extremely high cost | Almost never justified outside frontier labs |

:::insight
**Why This Matters**
The single most common and costly mistake in real GenAI projects is reaching for fine-tuning before exhausting prompting and RAG. Fine-tuning is slower to iterate on, harder to debug, and locks in behavior that's expensive to change — while a well-designed prompt or retrieval strategy can often solve 80% of the problem in an afternoon.
:::

## 2.2 A Practical Decision Order

- Start with prompt engineering — better instructions, examples, and structure (Course 4) solve more problems than most people expect.
- Add RAG if the problem is a knowledge gap — the model doesn't know something specific, current, or proprietary (Course 5).
- Consider PEFT (LoRA/QLoRA) if the problem is a behavior or format gap that persists across many prompts, and prompting alone hasn't fixed it (Course 7).
- Reserve full fine-tuning for cases with enough data, budget, and a clear need that the lighter-weight options have genuinely failed to address.

:::mistake
Fine-tuning is not a fix for hallucination or out-of-date knowledge — it bakes in patterns from a fixed training set at a point in time, and doesn't give the model live access to new facts. That's what RAG is for. Confusing these two purposes is one of the most common architecture mistakes teams make.
:::`,

15: `# TOPIC 3: Model Selection

With dozens of viable models available at any given time, choosing the right one for a given application is a genuine engineering decision — not just 'pick the newest, biggest model available.'

## 3.1 The Core Trade-Off Dimensions

| Dimension | Question to Ask |
|---|---|
| Capability | Does this task need frontier-level reasoning, or is it simple enough for a smaller model? |
| Cost | What's the per-token price, and how does that scale with expected usage volume? |
| Latency | Does the use case need a fast, responsive answer, or can it tolerate a slower, deeper response? |
| Context window | How much input text does a single request realistically need to include? |
| Modality | Does the task need vision, audio, or is text-only sufficient? |
| Deployment constraints | Does data sensitivity or compliance require self-hosting an open-weight model instead of a hosted API? |

## 3.2 A Practical Heuristic: Right-Sizing

A very common and effective production pattern is using different models for different sub-tasks within the same application: a small, fast, cheap model for classification, routing, or simple extraction, and a larger, more capable model reserved for the genuinely hard reasoning steps. This is often called 'model routing' or 'right-sizing,' and it can cut costs substantially without a noticeable quality drop for most of the pipeline.

:::tip
When in doubt, benchmark on your own task, with your own data, before committing. Public leaderboards are a reasonable starting shortlist, but they rarely predict performance on your specific domain and prompt style precisely enough to skip your own evaluation entirely.
:::

:::note
Model selection isn't a one-time decision. As new models release and prices shift — which happens frequently in this field — periodically re-evaluating your model choice against current alternatives is a normal, healthy part of maintaining a production GenAI system.
:::`,

16: `# TOPIC 4: Generative AI System Design

Zooming out from any single model decision, this topic covers what a real, production-grade GenAI system looks like end-to-end — the pieces around the model that make an application reliable, safe, and maintainable.

![Figure 4.1 — A production Generative AI system, showing the components that surround the LLM call itself.](/GenAI_images/image_11.png)

**Figure 4.1** — A production Generative AI system, showing the components that surround the LLM call itself.

## 4.1 Core Components

| Component | Purpose |
|---|---|
| API Gateway / Auth | Authenticates requests and enforces access control before anything reaches the model |
| Orchestration Layer | Coordinates prompt construction, retrieval, tool calls, and the LLM call itself |
| Cache / Rate Limiter | Avoids redundant LLM calls and protects the system from being overwhelmed |
| Vector DB / Retrieval | Supplies grounding context for RAG-based responses (Course 5) |
| Tools / External APIs | Lets the system take actions beyond text generation, when needed |
| Logging, Observability & Guardrails | Tracks behavior, costs, and failures; enforces safety and policy boundaries |

:::insight
**Why This Matters**
Notice how much of this diagram is not the LLM call itself. In a mature production system, the model call is often the smallest box in the architecture — most of the engineering effort goes into everything around it: routing, grounding, safety, and observability. This mirrors exactly what Course 9 (GenAI Evaluation & Production) covers in depth.
:::

## 4.2 Designing for Failure

- Assume the model provider will occasionally be slow, rate-limited, or briefly unavailable — design retries and, for critical paths, a fallback provider (a pattern first introduced in Course 1's Advanced level).
- Assume some fraction of outputs will be malformed, off-policy, or wrong — validate structured outputs before they reach downstream systems, and add guardrails for user-facing content.
- Assume costs will scale with usage in ways you didn't predict — build in cost monitoring and per-user or per-feature budget limits from the start, not after the first surprising bill.`,

17: `# TOPIC 5: Advanced GenAI Patterns

Beyond the four foundational architecture patterns from the Intermediate level, several more advanced patterns have emerged as production GenAI systems have matured. This topic previews the ones most worth recognizing.

![Figure 5.1 — Routing / Mixture-of-Experts: only the relevant experts activate per request.](/GenAI_images/image_12.png)

**Figure 5.1** — Routing / Mixture-of-Experts: only the relevant expert(s) activate per request.

## 5.1 Routing & Mixture-of-Experts (MoE)

Rather than sending every request through one monolithic model, a routing layer directs each request to the most appropriate specialized model or 'expert.' This appears at two levels: application-level routing (your own code decides which model to call, per Advanced Topic 3 above), and architecture-level Mixture-of-Experts, where a single trained model internally contains many expert sub-networks and a learned gating mechanism activates only a relevant subset per input — improving efficiency without sacrificing overall model capacity.

## 5.2 Other Notable Patterns

| Pattern | What It Does |
|---|---|
| Ensembling | Multiple models (or multiple calls to the same model) generate candidate answers; a selection step picks or merges the best one |
| Self-consistency | The model generates several independent reasoning paths for the same problem and takes the majority answer |
| Model cascading | A cheap model attempts the task first; only if it's uncertain does the request escalate to a more expensive model |
| Speculative decoding | A small, fast model drafts likely next tokens, which a larger model verifies in parallel — speeding up generation |

:::note
You don't need to implement these patterns yourself to benefit from many of them — cascading and MoE, in particular, are increasingly built into provider-side infrastructure and model architecture. What matters at this level is recognizing the pattern by name when you encounter it in documentation or research, so you understand what a system is actually doing.
:::`,

18: `# TOPIC 6: GenAI Trends & Emerging Technologies

This closing topic surveys the direction the field is currently moving — useful context for staying current after this course, without treating any single trend as guaranteed to play out exactly as described.

## 6.1 Trends Worth Watching

| Trend | What's Changing |
|---|---|
| Reasoning-focused models | Models trained to reason through intermediate steps before answering, improving hard-problem performance |
| Longer, cheaper context windows | Context windows have grown from thousands to hundreds of thousands of tokens, and cost per token keeps falling |
| Native multimodality | Single models increasingly handle text, image, and audio natively rather than through separate bolted-on components |
| Agentic capability | Models are increasingly trained and evaluated specifically for tool use and multi-step autonomous task completion |
| On-device / smaller efficient models | Capable smaller models are enabling more local, private, and low-latency deployment |
| Model & AI governance | Regulation, safety evaluation, and enterprise governance frameworks are maturing alongside capability |

## 6.2 How to Stay Current Without Chasing Every Headline

- Distinguish capability news (a new model release) from product news (a new consumer app or feature) — they require different levels of your attention as a developer.
- Re-evaluate your model and adaptation choices periodically, not constantly — the fundamentals in this course change slowly even when headlines suggest otherwise.
- Prioritize hands-on testing over reading about a new capability — a short experiment on your own task tells you more than a benchmark chart ever will.

:::tip
This closes the Generative AI Fundamentals course. The concepts here — foundation models, training stages, adaptation strategy, architecture patterns, and system design — are the scaffolding the rest of the GenAI domain (Courses 3–9) builds on directly, and the same scaffolding underpins the entire Agentic AI domain as well.
:::`,

}

export default genaiFundamentalsContent
