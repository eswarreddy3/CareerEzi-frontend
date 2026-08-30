// Embeddings, Vector Databases & RAG — Basic → Intermediate → Advanced (21 topics)
// Extracted verbatim from embeddings_VD_RAG.docx (Course 5 of 9, Generative AI domain).
// Diagrams served from /public/embeddings_VD_RAG_images/image_*.png
// Course id: "embeddings-vectordb-rag"  →  registered in content/index.ts
//
// Create these in the super-admin UI (/super-admin/courses); lesson `order` is
// global across the course, so it must match the keys below exactly.
//
//   Basic         — How text becomes searchable by meaning: embeddings, similarity, and the databases built to search them fast.
//     1  Embedding Fundamentals
//     2  Semantic Similarity
//     3  Vector Representations
//     4  Similarity Search
//     5  Vector Databases
//     6  Basic Retrieval
//   Intermediate  — From a working demo to a real pipeline: indexing at scale, processing real documents, and assembling a full RAG system.
//     7  Vector Database Architecture
//     8  Document Processing
//     9  Document Chunking
//    10  Embedding Pipelines
//    11  RAG Fundamentals
//    12  Building RAG Pipelines
//    13  RAG with Vector Databases
//   Advanced      — Pushing retrieval quality further: smarter chunking, query rewriting, hybrid search, re-ranking, and agentic retrieval.
//    14  Advanced RAG Architecture
//    15  Advanced Chunking
//    16  Query Rewriting
//    17  Hybrid Search
//    18  Re-ranking
//    19  Multi-Query Retrieval
//    20  Contextual Retrieval
//    21  Agentic RAG

const embeddingsRagContent: Record<number, string> = {
1: `# TOPIC 1: Embedding Fundamentals

Earlier in this curriculum, embeddings were introduced as the mechanism that lets a transformer represent a token's meaning as numbers. This course applies that same idea at a larger scale — embedding whole sentences, paragraphs, and documents — to build systems that search by meaning instead of exact keywords.

:::definition
**Embedding Model**
An embedding model is a neural network trained specifically to convert a piece of text — a word, sentence, or document — into a fixed-length vector of numbers that captures its meaning, positioned so that texts with similar meaning produce vectors that are close together.
:::

![Figure 1.1 — An embedding model converts text into a fixed-length numerical vector.](/embeddings_VD_RAG_images/image_1.png)

**Figure 1.1** — An embedding model converts text into a fixed-length numerical vector.

## 1.1 Embedding Models vs. Language Models

An LLM generates text; an embedding model represents text. They're related — both are usually transformer-based, and many are trained on similar data — but they're optimized for different jobs. A generative LLM is trained to predict the next token; an embedding model is trained so that semantically similar inputs land near each other in vector space, typically using a contrastive training objective that explicitly pulls related pairs together and pushes unrelated pairs apart.

| Property | Generative LLM | Embedding Model |
|---|---|---|
| Output | New text, one token at a time | One fixed-length vector per input |
| Training goal | Predict the next token accurately | Similar meanings → similar vectors |
| Typical use here | Generating the final answer | Representing text for search |

:::insight
**Why This Matters**
This distinction matters practically: you'll typically use a smaller, cheaper, specialized embedding model for the search half of a system, and reserve the larger generative model for the final answer — using the right tool for each job rather than one model for everything.
:::

## 1.2 What Makes a Good Embedding

A good embedding model produces vectors where distance reliably reflects meaning — not just surface word overlap. "The bank approved my loan" and "the financial institution accepted my application" share almost no words but should land close together; "the bank approved my loan" and "I sat by the river bank" share a word but should land far apart. This is the central quality bar for any embedding model, and it's exactly what dedicated benchmarks for embedding models measure.

:::note
Embedding models are usually described by two numbers worth knowing: dimensionality (how long each vector is, e.g. 1536) and max input length (how much text can be embedded in a single call, often 512–8192 tokens). Both affect cost, storage, and what you can feasibly embed in one pass.
:::

## 1.3 How Embedding Models Are Trained

Most modern text embedding models are trained with a contrastive objective: pairs of texts known to be similar (a question and its answer, two paraphrases, a document and its summary) are pulled together in vector space, while unrelated pairs are pushed apart. Over millions of such pairs, the model learns a general-purpose notion of semantic closeness rather than memorizing specific texts.

:::definition
**Contrastive Learning**
A training approach that teaches a model to represent similar inputs with nearby vectors and dissimilar inputs with distant vectors, using paired examples rather than explicit labels.
:::

## 1.4 Choosing an Embedding Model

| Factor | Why It Matters |
|---|---|
| Dimensionality | Higher dimensions can capture more nuance but cost more storage and compute |
| Domain fit | General-purpose models can underperform specialized ones on legal, medical, or code text |
| Max input length | Determines whether a whole chunk fits in one embedding call without truncation |
| Cost per call | Matters directly at the scale of embedding an entire document corpus |

:::insight
**Why This Matters**
Swapping embedding models later usually means re-embedding your entire corpus — vectors from different models aren't comparable to each other. Choosing deliberately upfront avoids an expensive redo.
:::

## 1.5 Symmetric vs. Asymmetric Embedding Use Cases

Some embedding models are optimized for symmetric similarity (comparing two texts of similar length and nature, like two sentences), while others are optimized asymmetrically for retrieval (comparing a short query against long documents). Using a symmetric-only model for query-to-document retrieval can noticeably underperform a model designed for that asymmetry.

:::mistake
Assuming any embedding model works equally well for any comparison task is a common early mistake. Check whether a model was trained or documented for retrieval (query/document) use before relying on it for a search system.
:::

## 1.6 What Embeddings Don't Capture Well

Embeddings represent semantic meaning, but reliably struggle with exact keyword matching (product codes, names, numbers), negation ("not recommended" can embed close to "recommended"), and precise numerical reasoning. Systems that need these capabilities typically pair embeddings with keyword-based search — a theme this course returns to under hybrid search in the Advanced level.

## 1.7 Quick Reference: Embedding Model Selection

| Use Case | Look For |
|---|---|
| General semantic search | Strong general-purpose retrieval benchmark scores |
| Domain-specific text (legal, medical, code) | A model fine-tuned or pretrained on that domain |
| Very short queries against long documents | A model explicitly designed for asymmetric retrieval |
| Tight cost/latency budget | Lower-dimensional or smaller model, benchmarked against your own data |

## 1.8 Extended Case Study: Picking an Embedding Model for a Support Knowledge Base

A company building internal search over support articles initially chose the most popular general-purpose embedding model without testing alternatives.
1. Built a small evaluation set of 30 real support queries with known correct articles.
2. Benchmarked the general-purpose model against a retrieval-optimized alternative on retrieval accuracy at top-5 results.
3. Found the retrieval-optimized model meaningfully outperformed on short, informal queries typical of real users.
4. Switched models before launch rather than after, avoiding a costly full re-embedding of the corpus post-launch.
Topic 1 Review

:::note
Embedding models are typically trained with a contrastive objective, learning closeness from paired examples.
Model choice should account for dimensionality, domain fit, input length limits, and cost — and is expensive to change later.
Retrieval (query-to-document) is asymmetric; not every embedding model handles this well.
Embeddings struggle with exact keyword matching, negation, and precise numeric reasoning — pair with keyword search where these matter.
:::`,

2: `# TOPIC 2: Semantic Similarity

Once text is represented as vectors, comparing meaning becomes a geometry problem: how do you measure whether two vectors are 'close'? This topic covers the standard way that comparison is made.

![Figure 2.1 — Cosine similarity measures the angle between two vectors, not their distance.](/embeddings_VD_RAG_images/image_2.png)

**Figure 2.1** — Cosine similarity measures the angle between two vectors, not their distance.

:::definition
**Cosine Similarity**
Cosine similarity measures the cosine of the angle between two vectors, producing a score from -1 (pointing in opposite directions) to 1 (pointing in exactly the same direction), regardless of each vector's magnitude. It's the standard way to compare embeddings for semantic closeness.
:::

## 2.1 Why Angle, Not Distance

It might seem more natural to measure straight-line distance between two vectors, but embedding magnitude often reflects something like text length or intensity rather than meaning itself. Cosine similarity deliberately ignores magnitude and focuses purely on direction — two vectors pointing the same way are considered maximally similar, regardless of how 'long' either one is.

:::scenario
**Reading Cosine Similarity Scores**
A score of 0.92 between two chunks suggests they discuss closely related content. A score near 0.0 suggests unrelated content. A score below 0 is rare in practice with most text embedding models, since embeddings for real text tend to cluster in a limited region of the vector space rather than spreading toward opposite directions.
:::

:::mistake
Raw cosine similarity scores don't have a single universal 'good enough' threshold — what counts as a strong match varies by embedding model and domain. Calibrate a working threshold empirically against your own data rather than assuming a number like 0.8 transfers from a different project or tutorial.
:::

## 2.2 Cosine Similarity in Practice

Cosine similarity measures the angle between two vectors, ignoring their magnitude — which is why it's the default choice for text embeddings, where magnitude often reflects text length more than meaning. A score of 1.0 means identical direction (maximally similar meaning), 0 means unrelated, and -1 means opposite.

:::definition
**Cosine Similarity**
A measure of similarity between two vectors based on the cosine of the angle between them, ranging from -1 to 1, unaffected by vector length.
:::

## 2.3 Other Distance Metrics

| Metric | What It Measures | When It's Used |
|---|---|---|
| Cosine similarity | Angle between vectors | Default for most text embedding comparisons |
| Euclidean (L2) distance | Straight-line distance between points | When magnitude is meaningful, e.g. some image embeddings |
| Dot product | Cosine similarity scaled by magnitude | When the embedding model was trained/optimized for it specifically |

:::note
Always check what distance metric an embedding model was trained to optimize for — using the wrong metric with a given model's vectors can silently produce worse rankings even though no error is thrown.
:::

## 2.4 Similarity Scores Are Relative, Not Absolute

A cosine similarity of 0.75 doesn't have a fixed, universal meaning — what counts as "similar enough" varies by embedding model, domain, and even by query. Comparing scores across different queries, or setting a single global similarity threshold, is a common source of unreliable filtering.

:::mistake
Hardcoding a fixed similarity threshold ("only show results above 0.8") often either hides genuinely relevant results or admits irrelevant ones, because the meaningful range of scores shifts across queries and content types. Prefer ranking by relative score, or calibrate thresholds empirically on your own data.
:::

## 2.5 Semantic vs. Lexical Similarity

Semantic similarity (via embeddings) captures meaning even when wording differs entirely — "car" and "automobile" score highly similar. Lexical similarity (via keyword overlap) captures shared exact wording regardless of meaning. Neither is strictly better; they fail on different kinds of queries, which is the underlying motivation for hybrid search covered later in this course.

## 2.6 Extended Case Study: Debugging Unexpectedly Low Similarity Scores

A team building a document search feature noticed near-duplicate paragraphs scoring only moderately similar, well below what they expected.
1. Confirmed both texts were embedded with the same model and the same distance metric the model was designed for.
2. Discovered one text had been embedded with leading boilerplate (a document header) still attached, diluting the semantic signal.
3. Stripped boilerplate before embedding and re-tested — similarity scores rose to the expected range.
4. Added boilerplate-stripping as a standard preprocessing step across the whole ingestion pipeline.
Topic 2 Review

:::note
Cosine similarity is the standard default for text embeddings because it ignores magnitude and focuses on direction.
Different embedding models may be optimized for different distance metrics — check before assuming cosine is always correct.
Similarity scores are relative to model, domain, and query — avoid hardcoded global thresholds.
Semantic and lexical similarity fail on different query types, which motivates combining both in hybrid search.
:::`,

3: `# TOPIC 3: Vector Representations

This topic goes one level deeper into what an embedding vector actually is and what its dimensions represent — building real intuition for objects you'll otherwise only interact with as opaque arrays of numbers.

![Figure 3.1 — Related concepts cluster together in vector space, even across very different topics.](/embeddings_VD_RAG_images/image_3.png)

**Figure 3.1** — Related concepts cluster together in vector space, even across very different topics.

## 3.1 Dimensionality in Practice

| Model Class | Typical Dimensionality | Trade-Off |
|---|---|---|
| Small / fast embedding models | 384–512 | Cheaper storage and faster search, somewhat less nuanced |
| Mid-size general-purpose models | 768–1536 | Common default for most production RAG systems |
| Large, highest-fidelity models | 3072+ | Best semantic precision, highest storage and compute cost |

Higher dimensionality generally captures more nuance, but with real costs: more storage per vector, slower similarity computation, and — past a certain point — diminishing returns in retrieval quality for a given task. Choosing dimensionality is a genuine engineering trade-off, not simply 'bigger is always better.'

## 3.2 No Single Dimension Means One Human-Readable Thing

Unlike the illustrative 2D examples used to build intuition, no individual dimension in a real embedding corresponds cleanly to a single human concept like 'formality' or 'topic.' Meaning is encoded across the whole vector jointly — which is exactly why embeddings are compared using similarity metrics across all dimensions at once, rather than by inspecting any single number.

## 3.3 The Curse of Dimensionality, Briefly

As vector dimensionality grows very large, distances between points tend to become less discriminative — everything starts looking roughly equidistant from everything else. In practice, well-trained embedding models are designed to avoid this failure mode within their working dimensionality, but it's part of why dimensionality isn't simply "more is always better."

## 3.4 Dimensionality Reduction

Techniques like PCA or dedicated model output truncation (some modern embedding models support this natively, often called Matryoshka embeddings) can shrink vector size after the fact, trading some retrieval accuracy for lower storage and faster search — useful when a corpus is large enough that storage and query latency dominate cost.

| Approach | Trade-off |
|---|---|
| Use a naturally lower-dimensional model | Simpler, but limits your model choice upfront |
| Truncate a Matryoshka-style embedding | Flexible, but only works with models trained to support it |
| Post-hoc PCA reduction | Works with any model, but adds a preprocessing step and typically loses more accuracy |

## 3.5 Storage and Memory Implications

A 1536-dimensional float32 vector takes roughly 6KB. At a million documents, that's several gigabytes just for vectors, before indexing overhead — a concrete reason dimensionality choices have real infrastructure cost at scale.

:::insight
**Why This Matters**
Estimating storage cost early, using real corpus size and candidate dimensionality, avoids an unpleasant surprise when a prototype's vector store needs to scale to production volume.
:::

## 3.6 Quantization

Quantization reduces the precision used to store each vector component (for example, from 32-bit floats to 8-bit integers), cutting storage substantially with a typically modest, measurable accuracy cost — a common lever for large-scale production vector stores.

:::note
Most managed vector database products offer built-in quantization options. Test retrieval accuracy before and after enabling quantization on a representative query set before relying on it in production.
:::

## 3.7 Extended Case Study: Scaling a Prototype's Vector Store

A prototype built on 10,000 documents worked well with full-precision, high-dimensional embeddings. Scaling to 5 million documents made storage and query latency a real constraint.
1. Measured actual storage footprint and query latency at the new scale before making any changes.
2. Tested int8 quantization against the same evaluation query set used during prototyping, confirming accuracy loss was acceptable.
3. Enabled quantization in production, cutting storage cost substantially with negligible measured impact on retrieval quality.
4. Documented the trade-off decision so future team members would understand why quantization was enabled and what was verified before doing so.
Topic 3 Review

:::note
Very high dimensionality isn't automatically better — well-trained models balance this within their design.
Dimensionality reduction and quantization both trade some accuracy for storage and speed at scale.
Estimate real storage cost early using your actual corpus size and candidate dimensionality.
Always validate quantization or reduction against your own evaluation set before trusting it in production.
:::`,

4: `# TOPIC 4: Similarity Search

With a way to represent text as vectors and a way to compare them, the next question is mechanical: given a query vector and a large collection of stored vectors, how do you actually find the closest ones?

![Figure 4.1 — The k nearest vectors to a query are returned as the most relevant results.](/embeddings_VD_RAG_images/image_4.png)

**Figure 4.1** — The k nearest vectors to a query are returned as the most relevant results.

:::definition
**k-Nearest Neighbors (k-NN) Search**
k-nearest neighbors search finds the k vectors in a collection that are most similar to a given query vector, typically ranked by cosine similarity or a related distance metric, and returned as the top-k most relevant results.
:::

## 4.1 Exact vs. Approximate Search

Computing exact similarity against every single stored vector — brute-force search — guarantees finding the true nearest neighbors, but its cost grows linearly with collection size. For a few thousand vectors this is fast enough; for millions or billions, it becomes too slow for real-time queries. Approximate Nearest Neighbor (ANN) search trades a small amount of accuracy for a large speed gain, using specialized index structures — the subject of the Intermediate level's Vector Database Architecture topic.

| Approach | Accuracy | Speed at Scale |
|---|---|---|
| Brute-force (exact) search | 100% correct nearest neighbors | Slow — scans the entire collection |
| Approximate Nearest Neighbor (ANN) | Very high, not guaranteed exact | Fast — sublinear with collection size |

:::tip
For prototypes or small datasets (a few thousand vectors), brute-force search is often simpler to set up and perfectly fast enough. Reach for ANN indexing once collection size or latency requirements actually demand it — not by default.
:::

## 4.2 Why Exact Search Doesn't Scale

Exact (brute-force) nearest-neighbor search compares a query vector against every stored vector — perfectly accurate, but linear in corpus size. At a few thousand vectors this is instant; at tens of millions, it becomes too slow for interactive use, which is why approximate methods dominate production systems.

| Corpus Size | Brute-Force Feasibility |
|---|---|
| Under ~10,000 vectors | Fast enough for most interactive use cases |
| 100,000 – 1,000,000 vectors | Noticeably slower; approximate search usually preferred |
| 10,000,000+ vectors | Brute-force typically impractical for interactive latency |

## 4.3 How Approximate Search Trades Accuracy for Speed

Approximate nearest-neighbor (ANN) methods organize vectors into structures (graphs, trees, or clusters) that let a search skip most of the corpus while still finding results very close to the true nearest neighbors — usually over 95% recall against exact search, at a fraction of the compute cost.

:::insight
**Why This Matters**
The word "approximate" sounds like a weakness, but in practice the accuracy loss is small and tunable, while the speed gain is often several orders of magnitude — making ANN the default choice for any production-scale vector search.
:::

## 4.4 Recall vs. Latency Trade-Offs

Most ANN algorithms expose tunable parameters that trade recall (how often the true best matches are actually returned) against query latency. Higher recall settings search more of the index per query, at added latency cost.

:::scenario
**A Typical Trade-Off Knob**
HNSW's ef_search parameter: a low value (e.g. 10) is fast but may miss some true nearest neighbors; a high value (e.g. 200) is slower but recalls nearly all of them.
Production systems typically tune this against a labeled evaluation set, choosing the lowest value that still meets a recall target.
:::

## 4.5 Filtering Alongside Similarity Search

Real search often needs both semantic similarity and hard filters (date range, category, permissions). How filtering is applied — before, during, or after the similarity search — has real accuracy and performance implications, covered in depth in the Intermediate level's vector database architecture topic.

## 4.6 Extended Case Study: Choosing Search Parameters for a Product Catalog

An e-commerce search feature needed sub-200ms query latency across 2 million product embeddings.
1. Benchmarked brute-force search and confirmed it exceeded the latency budget at this scale.
2. Deployed an ANN index and tested a range of recall/latency settings against a labeled set of known best-match queries.
3. Selected the lowest-latency setting that still met a 90% recall target on the evaluation set.
4. Set up ongoing monitoring to catch drift in latency or recall as the catalog grew, rather than treating the initial tuning as permanent.
Topic 4 Review

:::note
Brute-force search is exact but doesn't scale past roughly hundreds of thousands of vectors for interactive use.
Approximate nearest-neighbor search trades a small, tunable amount of accuracy for large speed gains.
Recall/latency trade-offs should be tuned against a real evaluation set, not guessed.
How filters combine with similarity search has real accuracy implications, covered further in the Intermediate level.
:::`,

5: `# TOPIC 5: Vector Databases

Storing embeddings in a plain array works for a demo, but real applications need a system purpose-built to store, index, filter, and search vectors efficiently at scale. That system is a vector database.

![Figure 5.1 — A vector database sits between raw documents and the queries that search them.](/embeddings_VD_RAG_images/image_5.png)

**Figure 5.1** — A vector database sits between raw documents and the queries that search them.

:::definition
**Vector Database**
A vector database is a database purpose-built to store high-dimensional vectors alongside metadata, and to efficiently search for the most similar vectors to a given query — typically using an approximate nearest neighbor index under the hood, plus the familiar database features of filtering, updating, and durability.
:::

## 5.1 What a Vector Database Adds Beyond an Index

- Metadata storage and filtering — searching only within documents from a specific date range, source, or access-permission level, alongside the vector search.
- Persistence and durability — vectors survive restarts and are backed up, unlike an in-memory array.
- Updates and deletes — documents can be added, changed, or removed without rebuilding the entire index from scratch.
- Scalability — sharding and distributed search across large collections that don't fit on a single machine.

:::insight
**Why This Matters**
Metadata filtering in particular is easy to underestimate until you need it — a pure similarity search with no filtering can't answer 'find similar documents, but only ones the current user is authorized to see' or 'only from the last 30 days.' Real applications need both capabilities working together.
:::

## 5.2 Popular Vector Database Options

| Category | Examples | Typical Fit |
|---|---|---|
| Dedicated vector databases | Pinecone, Weaviate, Qdrant, Milvus | Purpose-built, often easiest to scale for vector-first workloads |
| Vector extensions to existing databases | pgvector (Postgres), Redis, Elasticsearch | Good when vector search is one feature of a broader existing system |
| Lightweight / embedded options | Chroma, FAISS | Prototyping, smaller-scale or local-first applications |

## 5.3 What a Vector Database Adds Beyond a Raw Index

An in-memory ANN library gives you fast search, but a production system also needs persistence, metadata storage and filtering, updates and deletes, backups, and often multi-tenancy — the operational concerns a dedicated vector database is built to handle.

| Capability | Why It Matters in Production |
|---|---|
| Persistence | Survives restarts without re-embedding the entire corpus |
| Metadata storage & filtering | Enables combining similarity search with structured filters |
| Incremental updates/deletes | Supports a live, changing corpus rather than a fixed snapshot |
| Backups and replication | Protects against data loss and supports scaling reads |

## 5.4 Managed vs. Self-Hosted Options

Managed vector database services remove operational burden (scaling, backups, upgrades) at the cost of ongoing usage fees and less infrastructure control; self-hosted options (including vector extensions to existing databases like Postgres) give more control at the cost of operational ownership.

:::mistake
Choosing a self-hosted vector database without a clear plan for who owns scaling, backups, and upgrades is a common cause of reliability problems once a prototype moves to production traffic.
:::

## 5.5 Vector Extensions to Existing Databases

Rather than adopting a dedicated vector database, adding a vector extension to a database you already operate (e.g. pgvector for Postgres) can reduce operational surface area, especially when vector search is one feature among several relational needs in the same application.

:::note
This trade-off usually favors a dedicated vector database once scale or query volume grows large enough that a general-purpose database's vector performance becomes a bottleneck — evaluate against your actual scale rather than defaulting to either option.
:::

## 5.6 Evaluating Vector Database Options

| Evaluation Dimension | Questions to Ask |
|---|---|
| Scale | Does it handle your expected vector count and query volume? |
| Filtering | Does metadata filtering integrate efficiently with similarity search? |
| Operational fit | Do you already operate infrastructure this could extend, or need something managed? |
| Cost model | Does pricing scale predictably with your growth? |

## 5.7 Extended Case Study: Migrating From Prototype to Production Storage

A team prototyped retrieval using an in-memory library, which worked well for development but had no persistence or update support.
1. Listed operational requirements: persistence, metadata filtering by customer ID, and support for daily incremental updates.
2. Evaluated two managed vector databases and one self-hosted pgvector option against those requirements and the team's existing Postgres usage.
3. Selected pgvector, given the team already operated Postgres and vector query volume was moderate rather than extreme.
4. Migrated the prototype's vectors and set up the incremental update pipeline, validating query latency stayed within budget after migration.
Topic 5 Review

:::note
A vector database adds persistence, metadata filtering, updates, and operational tooling beyond a raw ANN index.
Managed vs. self-hosted is a real trade-off between operational burden and control/cost.
Vector extensions to existing databases can reduce operational surface area at moderate scale.
Evaluate options against your actual scale, filtering needs, and existing infrastructure — not by default choice.
:::`,

6: `# TOPIC 6: Basic Retrieval

This closing Basic-level topic puts the pieces together into the simplest end-to-end retrieval flow: turning a user's question into search results, using exactly the components covered so far.

![Figure 6.1 — A user question is embedded, searched against the vector database, and returned as relevant chunks.](/embeddings_VD_RAG_images/image_6.png)

**Figure 6.1** — A user question is embedded, searched against the vector database, and returned as relevant chunks.

## 6.1 The Basic Retrieval Flow, Step by Step

| Step | What Happens |
|---|---|
| 1. Receive a query | The user asks a question in natural language |
| 2. Embed the query | The same embedding model used for storage converts the query into a vector |
| 3. Search the vector database | The k nearest stored vectors to the query vector are found |
| 4. Return the matching chunks | The original text behind each matching vector is returned, not just the vector itself |

:::mistake
The query must be embedded with the exact same embedding model used to embed the stored documents. Vectors from two different embedding models are not comparable to each other — even if both are high quality individually, mixing them produces meaningless similarity scores.
:::

## 6.2 Retrieval Alone Isn't Yet RAG

Everything covered in this Basic level — embed, store, search, return matching text — is retrieval. It becomes Retrieval-Augmented Generation only once those retrieved chunks are handed to an LLM as context for generating an answer, which is where the Intermediate level's RAG Fundamentals topic picks up. Retrieval is the 'R'; generation grounded in what was retrieved is the rest of the acronym.

:::note
You now have the full basic mechanism: text becomes vectors, vectors are compared by similarity, similar vectors are found efficiently via a vector database, and a query returns the most relevant stored content. The Intermediate level builds the surrounding pipeline — document processing, chunking strategy, and the full RAG architecture — needed to make this work reliably on real, messy documents.
:::

## 6.3 Top-K Selection

Retrieval systems return the top K most similar results, and choosing K involves a real trade-off: too small risks missing a relevant result, too large adds noise (and, in a RAG context, unnecessary context-window cost) for a downstream generation step to sift through.

| K Value | Trade-off |
|---|---|
| Small (e.g. 3) | Fast, focused, but may miss relevant results just outside the cutoff |
| Medium (e.g. 5–10) | Common default balancing coverage and noise |
| Large (e.g. 20+) | Higher recall, but more noise and cost for downstream processing |

## 6.4 Evaluating Retrieval Quality

Before layering generation on top of retrieval, it's worth confirming retrieval itself is working — using metrics like recall@K (did the right document appear in the top K results?) and precision@K (how many of the top K results were actually relevant?) against a small labeled evaluation set.

:::insight
**Why This Matters**
A RAG system's answer quality is bounded by its retrieval quality — no amount of prompt engineering on the generation step fixes a system that isn't retrieving the right documents in the first place.
:::

## 6.5 Common Retrieval Failure Patterns

:::mistake
Frequent early-stage retrieval issues: queries phrased very differently from how source documents are worded (a vocabulary mismatch embeddings only partially solve), overly large chunks diluting a specific relevant passage among irrelevant surrounding text, and no filtering leading duplicate or near-duplicate chunks to crowd out diverse results.
:::

## 6.6 A Minimal Retrieval Evaluation Set

Building even a small set of realistic queries with known correct source documents — 15 to 20 is often enough to start — gives a concrete, repeatable way to compare retrieval configurations, rather than relying on spot-checking a few examples by eye.

:::scenario
**A Simple Evaluation Entry**
Query: "What's our refund policy for digital products?"
Expected source: refund_policy_v3.md, section 'Digital Goods'
Recorded outcome: was this document in the top 5 retrieved results? Yes/No, logged per configuration tested.
:::

## 6.7 Extended Case Study: Improving Retrieval Before Adding Generation

A team building an internal Q&A tool jumped straight to adding an LLM generation step on top of retrieval, and struggled to tell whether poor answers were a retrieval problem or a generation problem.
1. Paused generation work and built a 20-query retrieval evaluation set with known correct source documents.
2. Measured baseline recall@5 and found it was low — the right document often wasn't in the top 5 results.
3. Diagnosed the cause as overly large chunks diluting relevant passages, and reduced chunk size accordingly.
4. Re-measured recall@5, confirmed a clear improvement, and only then resumed work on the generation step — with a retrieval foundation now known to be solid.
Topic 6 Review

:::note
Top-K choice trades recall against noise and downstream cost — there's no universally correct value.
Evaluate retrieval quality directly (recall@K, precision@K) before layering generation on top.
Vocabulary mismatch, oversized chunks, and near-duplicate results are common early retrieval failure patterns.
A small, labeled evaluation set makes retrieval improvements measurable rather than a matter of guesswork.
:::`,

7: `# TOPIC 1: Vector Database Architecture

The Basic level treated a vector database as a black box that returns the k nearest vectors. This topic opens that box: how does a database search millions of vectors in milliseconds without checking each one individually?

![Figure 1.1 — A layered graph index lets search start broad and narrow in quickly, rather than scanning every vector.](/embeddings_VD_RAG_images/image_7.png)

**Figure 1.1** — A layered graph index lets search start broad and narrow in quickly, rather than scanning every vector.

## 1.1 HNSW: The Dominant Index Structure

:::definition
**HNSW (Hierarchical Navigable Small World)**
HNSW is a graph-based approximate nearest neighbor algorithm that organizes vectors into multiple layers — a sparse top layer with long-range connections and progressively denser lower layers — letting search start broad and quickly narrow toward the true nearest neighbors without visiting most of the collection.
:::

Search begins at the sparse top layer, jumps toward the region nearest the query using long-range connections, then descends one layer at a time, refining the search within an increasingly dense neighborhood. This is conceptually similar to how a highway system lets you cover long distances quickly before dropping onto local roads for the final approach — the top layer covers ground fast, the bottom layer finds the precise destination.

:::insight
**Why This Matters**
HNSW is the default or a top option in nearly every major vector database. Understanding its layered structure explains two practical realities: why ANN search is only approximate (a search can miss a true nearest neighbor if it takes a slightly wrong path through the graph), and why index build time and memory use scale with collection size — building the graph itself isn't free.
:::

## 1.2 Key Index Configuration Trade-Offs

| Parameter | Increasing It Generally Means |
|---|---|
| ef_construction / build quality | Better-quality index, slower to build |
| ef_search / search depth | Higher recall (accuracy), slower per-query search |
| M / connections per node | Better recall and search speed, more memory used per vector |

:::tip
Most vector databases ship with reasonable default index parameters — don't tune these until you have a measured recall or latency problem. Premature tuning without a benchmark to guide it usually wastes effort chasing a problem that doesn't exist yet.
:::

## 1.3 IVF: An Alternative to Graph-Based Indexes

Inverted File (IVF) indexes cluster vectors into buckets during index build, and a query only searches the buckets nearest the query vector rather than the whole graph. IVF often builds faster than HNSW and can use less memory, at some cost to recall for a given speed budget — a different point on the same underlying speed/accuracy trade-off.

| Index Type | Build Speed | Query Speed | Memory Use |
|---|---|---|---|
| HNSW | Slower to build | Very fast | Higher |
| IVF | Faster to build | Fast, tunable via cluster count | Lower |
| IVF + PQ (quantized) | Faster to build | Fast | Much lower, some accuracy cost |

## 1.4 Index Build Time and Update Costs

Some index structures are expensive to rebuild fully but cheap to update incrementally; others are the reverse. Understanding this trade-off matters directly for how often your corpus changes — a slowly-changing knowledge base tolerates expensive rebuilds far better than a rapidly updating one.

:::mistake
Choosing an index optimized purely for query speed, without checking its update cost, can create an operational bottleneck once a corpus that seemed static in a prototype turns out to update daily or hourly in production.
:::

## 1.5 Sharding and Horizontal Scaling

Beyond a single machine's capacity, vector databases distribute an index across multiple nodes (sharding), routing queries to relevant shards and merging results. This adds coordination complexity but is what allows vector search to scale to hundreds of millions or billions of vectors.

:::note
Most managed vector database services handle sharding transparently. Self-hosted deployments at very large scale need to plan for this explicitly rather than assuming a single-node setup will scale indefinitely.
:::

## 1.6 Extended Case Study: Choosing an Index for a Fast-Updating Corpus

A news aggregation product needed to index thousands of new articles per hour, alongside low-latency search over the full historical archive.
1. Benchmarked HNSW's rebuild cost against the required update frequency and found it too slow for hourly updates at the corpus's scale.
2. Evaluated an IVF-based index supporting cheaper incremental updates, at a modest, tested cost to recall.
3. Confirmed the recall trade-off was acceptable against a labeled evaluation set covering both recent and archival articles.
4. Deployed with periodic full re-optimization during low-traffic hours to recover any recall drift from incremental updates.

## 1.7 Quick Reference: Index Selection

| Situation | Lean Toward |
|---|---|
| Mostly static corpus, top query speed priority | HNSW |
| Frequent updates, faster builds needed | IVF |
| Very large scale, storage-constrained | IVF + quantization |

Topic 1 Review

:::note
HNSW and IVF represent different points on the same speed/accuracy/memory trade-off space.
Index update cost matters as much as query speed for corpora that change frequently.
Sharding is what allows vector search to scale past a single machine's capacity.
Match index choice to your actual update frequency and scale, not just raw query speed benchmarks.
:::`,

8: `# TOPIC 2: Document Processing

Real-world documents — PDFs, Word files, scanned images, HTML pages — are messy. Before any chunking or embedding can happen, that raw content has to be extracted into clean, structured text. This step is unglamorous and frequently underestimated.

## 2.1 Why This Step Determines Everything Downstream

No embedding model or retrieval strategy can compensate for badly extracted source text — garbled tables, missing headers, text pulled out of reading order, or OCR errors on a scanned page all directly corrupt what gets embedded and, later, what an LLM sees as 'ground truth.' Document processing quality is a ceiling on the entire system's quality, not just a preprocessing detail.

| Source Format | Common Extraction Challenge |
|---|---|
| PDF | Multi-column layouts, tables, and headers/footers easily extracted out of order |
| Scanned documents / images | Requires OCR; quality depends heavily on scan resolution and clarity |
| HTML / web pages | Navigation menus, ads, and boilerplate mixed in with the actual content |
| Word / Office documents | Generally cleaner, but tables, footnotes, and embedded objects still need care |

## 2.2 Preserving Structure, Not Just Text

Good document processing captures more than a flat wall of text — retaining headers, section boundaries, table structure, and page numbers as metadata makes later chunking far more effective and lets retrieved results cite exactly where they came from. Stripping all structure down to plain text is the fastest path to a working prototype, but it discards information that meaningfully improves both chunking quality and answer traceability.

:::mistake
Tables are a particularly common failure point: naively extracted, a table often becomes a jumbled run of numbers and labels with no columns or rows preserved, which is nearly meaningless once embedded. Dedicated table-extraction handling is often worth the extra engineering effort for documents that are table-heavy.
:::

## 2.3 Handling Tables and Structured Content

Naive text extraction often flattens tables into unreadable runs of numbers with lost column alignment. Preserving table structure — even as a simple markdown table representation — matters significantly for downstream retrieval and generation quality whenever source documents contain tabular data.

:::scenario
**Flattened vs. Preserved Table**
Flattened: "Q1 120 Q2 150 Q3 90 Region East West North" — column relationships are lost entirely.
Preserved: a markdown table with Region as rows and Q1/Q2/Q3 as columns — the model can correctly answer "What was West's Q2 figure?"
:::

## 2.4 OCR for Scanned Documents

Scanned PDFs and images require OCR (optical character recognition) before any text-based processing can happen. OCR quality varies significantly with scan quality, and errors introduced here — misread characters, garbled layout — propagate through the entire pipeline undetected unless specifically checked.

| OCR Quality Factor | Impact |
|---|---|
| Scan resolution | Low resolution significantly increases character error rate |
| Document layout complexity | Multi-column layouts are more error-prone than simple text |
| Handwriting or unusual fonts | Substantially higher error rates than standard printed text |

:::mistake
Skipping a spot-check of OCR output quality before embedding at scale is a common, hard-to-detect failure — a systematically garbled subset of documents can sit in a corpus for a long time, quietly degrading retrieval for anything sourced from those pages.
:::

## 2.5 Extracting and Preserving Metadata

Beyond the text itself, capturing metadata during processing — source filename, page number, section, author, date — is what enables filtering, citation, and freshness-aware retrieval later in the pipeline. This is easiest to capture during initial processing and considerably harder to reconstruct afterward.

:::insight
**Why This Matters**
Metadata captured at ingestion time is what lets a RAG system cite its sources accurately and filter results by recency or access permissions — capabilities that are difficult to retrofit onto an already-processed corpus.
:::

## 2.6 Extended Case Study: Fixing a Broken Ingestion Pipeline

A legal document search tool produced oddly poor results, traced back to the ingestion stage rather than retrieval or generation.
1. Spot-checked raw extracted text against source PDFs and found tables of case citations had been flattened into unusable text.
2. Switched to a document parser with explicit table-structure preservation.
3. Re-processed the affected document subset and confirmed citation-related queries improved measurably.
4. Added an automated spot-check step to the ingestion pipeline, sampling a percentage of newly processed documents for structural sanity before they were embedded.
Topic 2 Review

:::note
Preserving table and layout structure during extraction matters significantly for downstream quality.
OCR errors on scanned documents propagate silently through the whole pipeline unless spot-checked.
Capture metadata (source, page, date, permissions) during ingestion — it's hard to reconstruct later.
Document processing quality is the ceiling on everything downstream — no later step can fully compensate for it.
:::`,

9: `# TOPIC 3: Document Chunking

A full document is almost always too large to embed as a single vector meaningfully, and too large to usefully insert whole into a prompt. Chunking splits it into smaller pieces — and how you split it has an outsized effect on retrieval quality.

![Figure 3.1 — Fixed-size chunking splits mechanically; semantic chunking respects document structure.](/embeddings_VD_RAG_images/image_8.png)

**Figure 3.1** — Fixed-size chunking splits mechanically; semantic chunking respects document structure.

## 3.1 Why Chunk Size Matters

| Chunk Size | Trade-Off |
|---|---|
| Very small (e.g. 100 tokens) | Precise retrieval, but often loses surrounding context needed to make sense of the excerpt |
| Very large (e.g. 2000+ tokens) | Keeps more context together, but dilutes the embedding's focus and wastes prompt space on irrelevant text |
| Moderate (roughly 200–500 tokens) | Common practical starting point, balancing focus and context |

There's no universally correct chunk size — it depends on the nature of the content (dense technical text vs. narrative prose) and the kind of questions the system needs to answer. A support FAQ might do well with small, tightly-scoped chunks; a legal contract might need larger chunks to keep clauses and their context together.

## 3.2 Chunk Overlap

:::definition
**Chunk Overlap**
Chunk overlap means adjacent chunks share a small amount of repeated text at their boundary, so that an idea spanning the boundary between two chunks isn't split in a way that damages both chunks' embeddings.
:::

:::scenario
**Overlap in Practice**
With a 300-token chunk size and 50-token overlap, chunk 2 starts 50 tokens before chunk 1 ends — meaning the last sentence of chunk 1 also appears as the first sentence of chunk 2. This small redundancy costs extra storage but meaningfully reduces the chance that a key sentence gets orphaned, split awkwardly across a chunk boundary.
:::

## 3.3 Fixed-Size vs. Semantic Chunking

Fixed-size chunking splits text at a set token or character count, ignoring content boundaries; semantic chunking splits at natural boundaries (sentences, paragraphs, sections), sometimes using embedding similarity to detect topic shifts. Semantic chunking generally produces more coherent chunks at the cost of more processing complexity.

| Approach | Pros | Cons |
|---|---|---|
| Fixed-size | Simple, fast, predictable chunk count | Can split mid-sentence or mid-idea |
| Sentence/paragraph-based | Respects natural language boundaries | Chunk sizes vary, harder to predict |
| Semantic (embedding-based) | Groups genuinely related content together | More compute-intensive to build |

## 3.4 Chunking Structured Documents

For documents with clear structure (headers, sections, markdown), chunking along that existing structure — rather than ignoring it in favor of raw character counts — usually produces more semantically coherent chunks with less engineering effort than building topic-detection from scratch.

:::insight
**Why This Matters**
Structure-aware chunking is often the highest-leverage, lowest-complexity improvement available — before reaching for more sophisticated semantic chunking, check whether the source documents already carry structure you're not using.
:::

## 3.5 Chunk Size Trade-Offs Revisited

Smaller chunks retrieve more precisely but carry less surrounding context per chunk; larger chunks carry more context but dilute the specific relevant passage among less relevant surrounding text, and cost more tokens once retrieved. There's no universal answer — the right size depends on content density and how the retrieved chunks will be used downstream.

:::mistake
Picking one fixed chunk size for an entire heterogeneous corpus (dense technical specs alongside casual FAQ content) often serves neither well. Consider different chunking strategies for meaningfully different content types within the same corpus.
:::

## 3.6 Testing Chunking Strategies

Chunking strategy changes are cheap to test against a retrieval evaluation set (introduced in the Basic level) — re-chunk, re-embed, re-measure recall@K — making it one of the most measurable levers in a RAG pipeline rather than something to decide by intuition alone.

## 3.7 Extended Case Study: Re-Chunking to Fix Diluted Retrieval

A technical documentation search tool used large, fixed 1000-token chunks, and users frequently reported that relevant answers were "in there somewhere" but not surfaced clearly.
1. Measured recall@5 against a labeled evaluation set with the existing 1000-token chunks as a baseline.
2. Switched to structure-aware chunking along the documentation's existing headers, with a smaller target size.
3. Re-measured recall@5 and observed a clear improvement, along with more focused chunk content in manual review.
4. Rolled out the new chunking strategy corpus-wide after confirming the improvement held across multiple document categories, not just the ones initially tested.
Topic 3 Review

:::note
Semantic and structure-aware chunking generally outperform naive fixed-size chunking in coherence.
Check for existing document structure (headers, sections) before building more complex chunking logic.
Chunk size trades precision against context — the right size depends on content and downstream use.
Chunking changes are cheap to test against a retrieval evaluation set — measure rather than guess.
:::`,

10: `# TOPIC 4: Embedding Pipelines

This topic connects document processing, chunking, and embedding into the single automated pipeline that runs whenever new content needs to enter the system.

![Figure 4.1 — The full ingestion pipeline: parse, chunk, embed, and store, run separately from the query path.](/embeddings_VD_RAG_images/image_9.png)

**Figure 4.1** — The full ingestion pipeline: parse, chunk, embed, and store, run separately from the query path.

## 4.1 Ingestion Is a Separate System from Query Time

It's worth clearly separating two things that are easy to conflate: the ingestion pipeline (parse, chunk, embed, store — run once per document, or on a schedule as documents change) and the query pipeline (embed the query, search, retrieve — run on every single user request). They have very different performance requirements: ingestion can tolerate being slow and batched; query-time embedding and search need to be fast enough for an interactive response.

## 4.2 Handling Updates and Re-Indexing

| Scenario | What Needs to Happen |
|---|---|
| A source document is edited | Old chunks from that document must be deleted and replaced, not just added to |
| A new document is added | Runs through the pipeline once; existing vectors are untouched |
| The embedding model is upgraded | Every existing document typically must be re-embedded, since vectors from different models aren't comparable |

:::insight
**Why This Matters**
That last row is a genuinely costly, easy-to-underestimate operational reality: switching embedding models isn't a config change, it's a full re-indexing of everything already stored. Factor this into model selection early rather than treating embedding models as freely swappable.
:::

## 4.3 Batch vs. Streaming Ingestion

Batch ingestion processes a corpus (or updates) in scheduled bulk runs — simpler to reason about, but introduces staleness between batches. Streaming ingestion embeds and indexes documents as they arrive — fresher, but requires more infrastructure to run reliably and handle partial failures.

| Approach | Freshness | Complexity |
|---|---|---|
| Batch (e.g. nightly) | Up to one batch interval stale | Lower — simpler to build and debug |
| Streaming | Near real-time | Higher — needs robust error handling per document |
| Hybrid (batch + on-demand) | Fresh for priority content, batch for the rest | Moderate — two paths to maintain |

## 4.4 Idempotency and Deduplication

An ingestion pipeline that re-runs (due to a retry, a re-triggered batch, or an overlapping update) should not silently create duplicate vectors for the same content. Using a stable, deterministic ID per chunk — derived from source document and chunk position, not a random ID — makes re-ingestion safely overwrite rather than duplicate.

:::mistake
Using randomly generated IDs for each chunk means every re-run of the ingestion pipeline adds duplicates rather than updating existing entries — a common, quietly compounding source of corpus bloat and degraded retrieval precision over time.
:::

## 4.5 Handling Ingestion Failures

Individual documents can fail at any pipeline stage — a corrupt file, an API timeout during embedding, a malformed chunk. A robust pipeline logs and retries individual failures without halting the entire batch, and tracks which documents are successfully indexed versus pending or failed.

:::note
A simple status field per document (pending, processed, failed) turns pipeline health from a mystery into something directly queryable — worth building even in an early-stage system, since retrofitting it later means auditing an already-opaque history.
:::

## 4.6 Cost Management at Scale

Embedding API costs scale with total token volume processed, which for large corpora with periodic full re-embedding (after a model change, for example) can be substantial. Tracking cost per ingestion run, and considering incremental re-embedding of only changed content, keeps this predictable rather than a recurring surprise.

## 4.7 Extended Case Study: Recovering From a Partial Ingestion Failure

An overnight batch ingestion job failed partway through due to an embedding API outage, leaving the corpus in an unknown, partially updated state.
1. Checked per-document status tracking and confirmed which documents had completed versus were still pending.
2. Re-ran the pipeline scoped only to pending documents, using deterministic chunk IDs to safely avoid duplicating already-completed work.
3. Verified corpus completeness afterward by comparing total indexed chunk count against the expected count from the source document set.
4. Added automated alerting on ingestion failures going forward, rather than discovering issues only when users reported missing content.
Topic 4 Review

:::note
Batch ingestion is simpler; streaming is fresher — many systems land on a hybrid.
Deterministic chunk IDs prevent duplication on pipeline re-runs — avoid random IDs per chunk.
Track per-document ingestion status so failures are queryable rather than a mystery.
Monitor embedding cost at scale, and consider incremental re-embedding over full corpus re-runs where possible.
:::`,

11: `# TOPIC 5: RAG Fundamentals

With retrieval and the embedding pipeline both covered, this topic introduces the complete pattern: Retrieval-Augmented Generation, where retrieved content actively grounds what an LLM generates.

![Figure 5.1 — RAG combines an offline ingestion pipeline with an online query pipeline feeding an LLM.](/embeddings_VD_RAG_images/image_10.png)

**Figure 5.1** — RAG combines an offline ingestion pipeline with an online query pipeline feeding an LLM.

:::definition
**Retrieval-Augmented Generation (RAG)**
RAG is a pattern where an LLM's response is grounded by first retrieving relevant content from an external knowledge source — typically a vector database — and including that content in the prompt, rather than relying solely on what the model learned during training.
:::

## 5.1 Why RAG Exists

An LLM's knowledge is frozen at its training cutoff and limited to whatever was in its training data — it has no access to your company's internal documents, yesterday's news, or anything proprietary. RAG solves this without retraining or fine-tuning the model at all: relevant, current, or private information is fetched at request time and handed to the model as context, directly addressing the knowledge-cutoff and hallucination limitations.

| What RAG Solves | How |
|---|---|
| Knowledge cutoff | Retrieved content can be as current as the underlying data source |
| No access to private/proprietary data | The knowledge base can be your own documents, never part of the model's training |
| Reduces (but doesn't eliminate) hallucination | The model is grounded in retrieved text rather than only its parametric memory |
| Traceability | Retrieved chunks can be cited, showing exactly where an answer's information came from |

## 5.2 What RAG Doesn't Solve

:::mistake
RAG grounds answers in retrieved content, but it doesn't guarantee the model will use that content correctly — the model can still misread, misquote, or ignore retrieved context, and it can still hallucinate details not present in either its training or the retrieved text. RAG substantially reduces certain failure modes; it doesn't eliminate the need for evaluation.
:::

## 5.3 The Full RAG Loop, End to End

Putting the pieces together: a user query is embedded, compared against the vector store to retrieve relevant chunks, those chunks are assembled into a prompt alongside the original query, and the LLM generates a grounded answer — with retrieval and generation as genuinely separate, independently improvable stages.

:::definition
**Retrieval-Augmented Generation (RAG)**
An architecture that grounds LLM generation in retrieved external content, rather than relying solely on the model's parametric training knowledge, by injecting relevant retrieved text into the prompt at query time.
:::

## 5.4 RAG vs. Fine-Tuning vs. Long Context

These three approaches to giving a model access to specific knowledge solve overlapping but distinct problems, and are frequently combined rather than treated as mutually exclusive choices.

| Approach | Best For | Limitation |
|---|---|---|
| RAG | Large, frequently changing knowledge bases | Retrieval quality bounds answer quality |
| Fine-tuning | Teaching style, format, or narrow specialized behavior | Doesn't reliably add new factual knowledge; costly to update |
| Long context (pasting everything) | Smaller, static document sets | Cost and latency scale with context size; still has attention limits |

## 5.5 Grounding and Citation

Instructing the generation step to answer only from retrieved content, and to cite which chunk supported each claim, substantially reduces hallucination risk compared to open-ended generation — and gives users a way to verify the answer against the actual source.

:::insight
**Why This Matters**
A RAG system that doesn't ask the model to distinguish retrieved facts from its own general knowledge often blends the two seamlessly in its output, undermining the main reason for using RAG in the first place: grounding in specific, verifiable content.
:::

## 5.6 Handling the No-Relevant-Result Case

Retrieval sometimes returns nothing genuinely relevant to a query — an out-of-scope question, or a genuine gap in the corpus. A well-designed RAG prompt instructs the model to say so explicitly rather than answering from general knowledge as if it were grounded, or force-fitting an answer from marginally relevant chunks.

:::mistake
A system that always attempts a confident-sounding answer regardless of retrieval quality trains users to trust answers that may not actually be grounded in anything real. Explicitly handling the no-good-match case is a small prompt change with outsized trust implications.
:::

## 5.7 Extended Case Study: A Minimal First RAG System

A small internal tool answering questions from a 200-page employee handbook illustrates the full loop concretely.
1. Chunked the handbook along its existing section structure and embedded each chunk.
2. At query time, embedded the user's question and retrieved the top 5 most similar chunks.
3. Assembled a prompt instructing the model to answer only from the retrieved chunks, citing the relevant section, and to say so explicitly if the handbook didn't address the question.
4. Tested against known questions with known correct handbook sections, confirming both retrieval accuracy and that ungrounded answers were correctly avoided.
Topic 5 Review

:::note
RAG separates retrieval and generation into independently improvable stages, grounding generation in retrieved content.
RAG, fine-tuning, and long context solve overlapping but distinct problems, and are often combined.
Instructing the model to cite sources and distinguish retrieved facts from general knowledge reduces hallucination.
Explicitly handle the no-relevant-result case rather than forcing a confident answer from weak retrieval.
:::`,

12: `# TOPIC 6: Building RAG Pipelines

This topic moves from RAG as a concept to RAG as something you actually assemble — the concrete steps and decisions involved in building a working pipeline end to end.

## 6.1 The Full Pipeline, Assembled

| Stage | Key Decision Points |
|---|---|
| Ingestion | Chunking strategy, embedding model choice, metadata to retain |
| Retrieval | How many chunks to retrieve (k), similarity threshold, metadata filters |
| Prompt assembly | How retrieved chunks are formatted and inserted into the prompt |
| Generation | Which LLM, what instructions to give it about using (or not using) retrieved content |

## 6.2 Prompt Assembly: Putting Retrieved Chunks to Work

:::scenario
**A Basic RAG Prompt Template**
"Answer the question using only the context below. If the answer isn't in the context, say you don't know.\\n\\nContext:\\n{retrieved_chunks}\\n\\nQuestion: {user_question}" — this explicit instruction to rely only on the provided context, and to admit uncertainty otherwise, is one of the simplest and most effective levers for reducing hallucination in a RAG system.
:::

:::insight
**Why This Matters**
That single instruction — say you don't know if the answer isn't in the context — is doing real work. Without it, a model will often fall back on its own general knowledge when retrieval comes up short, silently blending retrieved facts with un-grounded ones in a way that's very hard to detect from the outside.
:::

## 6.3 Common Early Mistakes

| Mistake | Fix |
|---|---|
| Retrieving too few chunks (k=1) | Increase k modestly; one chunk rarely contains the full answer |
| Retrieving too many chunks | Wastes context budget and can bury the genuinely relevant chunk among noise |
| No instruction to stay grounded in context | Add an explicit instruction, as in the example above |
| No fallback for zero relevant results | Handle the empty-retrieval case explicitly rather than passing an empty context silently |

## 6.4 Prompt Template Design for RAG

A RAG prompt template typically separates system instructions, retrieved context (clearly delimited), and the user's query — the same structural principles from prompt engineering apply directly here, with retrieved chunks taking the place of manually-supplied context.

:::scenario
**A Minimal RAG Prompt Template**
System: "Answer only using the context below. If the context doesn't contain the answer, say so."
Context: <context>{retrieved_chunks}</context>
Query: {user_question}
:::

## 6.5 Latency Budgeting Across the Pipeline

A RAG request's total latency sums embedding the query, vector search, and generation — each stage worth measuring individually, since optimization effort is best spent on whichever stage actually dominates total latency for your specific system.

| Stage | Typical Latency Range | Optimization Lever |
|---|---|---|
| Query embedding | Tens of milliseconds | Smaller/faster embedding model |
| Vector search | Milliseconds to tens of milliseconds | Index tuning, quantization |
| Generation | Hundreds of milliseconds to seconds | Smaller model, shorter output, streaming |

## 6.6 Streaming Responses

Streaming the generation step's output token-by-token to the user, rather than waiting for the full response, significantly improves perceived latency even when total generation time is unchanged — a low-effort, high-impact improvement for any interactive RAG application.

:::insight
**Why This Matters**
Perceived latency matters as much as measured latency for user experience — streaming is often the single highest-leverage latency fix available, ahead of more involved retrieval or model optimizations.
:::

## 6.7 Caching in a RAG Pipeline

Caching at multiple levels — repeated identical queries, frequently retrieved chunk sets, or even full generated answers for common questions — can meaningfully cut both cost and latency for high-traffic RAG systems with repetitive query patterns.

:::note
Cache invalidation needs a clear policy tied to corpus updates — a cached answer referencing since-updated source content is a correctness risk, not just a staleness inconvenience.
:::

## 6.8 Extended Case Study: Debugging a Slow RAG Endpoint

A customer-facing RAG feature had unacceptably high latency, and the team needed to find which stage was responsible before optimizing anything.
1. Instrumented the pipeline to log per-stage latency: embedding, retrieval, and generation, separately.
2. Found generation dominated total latency, with embedding and retrieval both well within budget.
3. Enabled response streaming, which didn't reduce total generation time but substantially improved perceived responsiveness.
4. Separately evaluated a smaller, faster generation model for this specific use case, confirming acceptable quality before switching.
Topic 6 Review

:::note
RAG prompt templates apply the same structural principles as general prompt engineering, with retrieved chunks as context.
Measure latency per pipeline stage before optimizing — the bottleneck isn't always where you'd assume.
Streaming responses improves perceived latency independent of total generation time.
Cache thoughtfully, with an invalidation policy tied to corpus updates to avoid serving stale, incorrect answers.
:::`,

13: `# TOPIC 7: RAG with Vector Databases

This closing Intermediate topic focuses specifically on the practical integration between a RAG pipeline and the vector database underneath it — the configuration choices that matter once a system moves toward production.

## 7.1 Metadata Filtering in RAG

Combining vector similarity search with metadata filters is one of the most useful capabilities a vector database provides for RAG. A query can search only within documents matching specific criteria — a date range, a department, a user's access permissions — narrowing the search space before or during the similarity search itself, rather than filtering after the fact.

:::scenario
**A Filtered Retrieval Query**
search(query_vector, filter={"department": "finance", "access_level": {"$lte": current_user.level}}, top_k=5) — this retrieves the 5 most similar chunks, but only from documents the requesting user is actually permitted to see, combining semantic search with an access-control check in a single operation.
:::

## 7.2 Monitoring Retrieval Quality in Production

| Signal to Track | What It Indicates |
|---|---|
| Average similarity score of top result | A sustained drop can signal the knowledge base is missing coverage for new query types |
| Zero-result queries | Reveals gaps in the knowledge base or overly strict filters |
| Retrieval latency | Growing collections or under-tuned indexes show up here first |
| User feedback on answer quality | The ultimate signal — retrieval or generation may look fine individually but still fail the user |

:::note
This closes the Intermediate level. You now have a full working pipeline: process real documents, chunk them thoughtfully, embed and store them with useful metadata, and retrieve grounded context for an LLM to answer from. The Advanced level covers the techniques that push retrieval quality further — better chunking, query rewriting, hybrid and multi-query search, re-ranking, and agentic retrieval.
:::

## 7.3 Multi-Tenancy Patterns

Applications serving multiple customers or workspaces need to ensure retrieval never crosses tenant boundaries. Common patterns include a metadata field filtered on every query, separate namespaces/collections per tenant, or fully separate indexes — each trading isolation strength against operational overhead.

| Pattern | Isolation Strength | Operational Overhead |
|---|---|---|
| Shared index, metadata filter per query | Depends entirely on filter correctness | Lowest |
| Separate namespace/collection per tenant | Strong, structural | Moderate |
| Fully separate index per tenant | Strongest | Highest, especially at many tenants |

:::mistake
Relying solely on a metadata filter for tenant isolation, with no defense-in-depth, means a single bug in filter logic can leak one customer's data into another's search results — treat this as a security boundary, not just a convenience filter.
:::

## 7.4 Access Control at Query Time

Beyond tenant isolation, individual documents may have finer-grained permissions (department-level, role-level). Applying these as retrieval-time filters — rather than filtering only after generation — prevents restricted content from ever reaching the LLM's context in the first place.

:::insight
**Why This Matters**
Filtering after generation is both a security gap (restricted content already reached the model) and a poor user experience (a plausible-looking answer might reference content the user isn't supposed to see). Enforce access control before retrieval feeds into the prompt.
:::

## 7.5 Combining Multiple Vector Collections

Larger systems sometimes need to retrieve across multiple distinct collections — different content types, different embedding models, or different tenants — merging and re-ranking results from each rather than assuming a single flat index. This adds complexity but avoids forcing genuinely different content types into one undifferentiated index.

## 7.6 Extended Case Study: Adding Multi-Tenant Support to an Existing RAG System

A single-tenant RAG prototype needed to become a multi-tenant product without a full rebuild.
1. Audited the existing index and confirmed no tenant metadata existed on any stored chunk.
2. Added a tenant_id metadata field to every existing and future chunk, backfilling historical data.
3. Enforced the tenant filter as a mandatory, non-optional parameter in the retrieval code path, rather than an application-level convention that could be forgotten.
4. Wrote automated tests specifically verifying that queries from one tenant never returned another tenant's chunks, run as part of every deployment.

## 7.7 Quick Reference: Multi-Tenant RAG Checklist

| Check | Status |
|---|---|
| Tenant/permission metadata captured on every chunk | Required |
| Filtering enforced at the retrieval layer, not just the application layer | Required |
| Automated tests verify isolation, not just manual spot-checks | Strongly recommended |

Intermediate Level: Consolidated Checklist

:::note
Index choice (HNSW, IVF, or quantized variants) should match your update frequency and scale, not just raw query speed.
Document processing quality is the ceiling on the entire pipeline — preserve structure and spot-check OCR output.
Chunking strategy is cheap to test and measurably affects retrieval — test against a labeled evaluation set.
Ingestion pipelines need idempotent IDs, failure tracking, and cost monitoring to run reliably at scale.
A complete RAG loop grounds generation in retrieved content, handles the no-match case explicitly, and cites sources.
Multi-tenant and permission-aware systems must enforce isolation at the retrieval layer, with automated tests to verify it.
:::

Topic 7 Review

:::note
Multi-tenancy patterns trade isolation strength against operational overhead — pick based on your actual security requirements.
Enforce access control before retrieval, not after generation.
This closes the Intermediate level; the next level builds more sophisticated retrieval techniques on top of this foundation.
:::`,

14: `# TOPIC 1: Advanced RAG Architecture

The Intermediate level's RAG pipeline — embed, retrieve, generate — is a solid baseline, sometimes called naive RAG. This topic frames the rest of the Advanced level: each following topic addresses one specific weakness naive RAG has under real-world conditions.

| Naive RAG Weakness | Advanced Technique That Addresses It |
|---|---|
| Poorly-phrased or ambiguous user queries | Query Rewriting |
| Semantic search alone misses exact terms (codes, names) | Hybrid Search |
| Top-k similarity results aren't always the most relevant | Re-ranking |
| A single query phrasing may miss relevant content | Multi-Query Retrieval |
| Chunks lose surrounding context when embedded in isolation | Contextual Retrieval |
| A single fixed retrieval pass isn't always enough | Agentic RAG |

:::insight
**Why This Matters**
Framing these as answers to specific weaknesses, rather than as a checklist to always apply, is the right mental model. Every technique in this level adds latency, cost, or engineering complexity — the skill is diagnosing which specific weakness your system actually has and applying the matching fix, not stacking every technique by default.
:::

## 1.1 Where the Baseline Pipeline Breaks Down

The straightforward embed-retrieve-generate loop performs well on simple, single-hop questions with clear vocabulary overlap between query and source. It struggles on vague queries, questions requiring information synthesized across multiple documents, and queries phrased very differently from how source content is worded — the specific gaps this Advanced level's techniques each target.

| Baseline Weakness | Advanced Technique That Addresses It |
|---|---|
| Poor chunk-level context isolation | Advanced chunking, contextual retrieval |
| Vocabulary mismatch between query and documents | Query rewriting, hybrid search |
| Single query misses relevant angles | Multi-query retrieval |
| Fast retrieval isn't precise enough for final ranking | Re-ranking |
| Question requires multiple sequential retrieval steps | Agentic RAG |

## 1.2 Layering Techniques, Not Replacing the Baseline

Every technique in this level is an addition to the baseline pipeline from the Intermediate level, not a replacement for it — a production system typically combines several: hybrid search plus re-ranking plus query rewriting is a common, effective combination, each addressing a different weakness.

:::insight
**Why This Matters**
Treating these as a menu to layer selectively, based on your system's actual observed failure modes, is more effective than adopting every technique by default — each adds latency and complexity that should be justified by a measured improvement.
:::

## 1.3 Measuring Before Optimizing

Before adding any advanced technique, using the retrieval evaluation practices from earlier in this course to identify which specific failure mode your system actually has avoids solving a problem you don't have at the cost of complexity you didn't need.

:::mistake
Adding re-ranking, query rewriting, and multi-query retrieval all at once, without measuring which one actually moves the needle for your corpus and query patterns, makes it impossible to know which addition was worth its added latency and cost.
:::

## 1.4 A Roadmap Through This Level

1. Advanced Chunking — improve what gets embedded in the first place.
2. Query Rewriting and Hybrid Search — improve how queries are matched against content.
3. Re-Ranking and Multi-Query Retrieval — improve precision and coverage of results.
4. Contextual Retrieval and Agentic RAG — address deeper structural limitations of a single-pass pipeline.
Topic 1 Review

:::note
The baseline RAG pipeline has specific, identifiable weaknesses — each Advanced-level topic targets one.
Advanced techniques layer onto the baseline pipeline rather than replacing it.
Measure your system's actual failure modes before adding complexity to address them.
This level generally moves from improving what's embedded, to how it's matched, to how it's ranked, to more structurally different architectures.
:::`,

15: `# TOPIC 2: Advanced Chunking

The Intermediate level covered fixed-size and semantic chunking as two basic strategies. This topic covers more sophisticated approaches that better preserve meaning across chunk boundaries.

## 2.1 Recursive Chunking

:::definition
**Recursive Chunking**
Recursive chunking splits text using a prioritized list of separators — paragraphs first, then sentences, then words — falling back to a coarser or finer separator only as needed to hit a target chunk size, which keeps natural document structure intact far more often than a purely fixed-length split.
:::

## 2.2 Parent-Child (Small-to-Big) Chunking

A powerful pattern for balancing precise retrieval against full context: embed small chunks for accurate similarity matching, but when a small chunk is retrieved, return its larger parent chunk (or the surrounding section) to the LLM instead of the tiny fragment alone. This gets the precision benefit of small chunks at search time and the context benefit of larger chunks at generation time — without forcing a single chunk size to serve both purposes.

| Chunking Strategy | Core Idea | Best For |
|---|---|---|
| Fixed-size | Split every N tokens | Simple, uniform content |
| Semantic / structure-aware | Split along natural document boundaries | Well-structured documents (docs with headers) |
| Recursive | Prioritized separator fallback | General-purpose default for mixed content |
| Parent-child (small-to-big) | Search small, return large | Balancing precise matching with full context |

:::tip
Parent-child chunking is worth the added complexity once you notice retrieved chunks are individually accurate but the LLM's answers feel context-starved — a common symptom of chunks being too small to stand alone even though they matched the query well.
:::

## 2.3 Sliding Window Chunking

A sliding window creates overlapping chunks by advancing a fixed-size window with a smaller step than the window itself — every piece of source content appears in more than one chunk, reducing the chance a relevant passage is awkwardly split right at a chunk boundary.

:::scenario
**Sliding Window in Practice**
Window size: 200 tokens, step: 100 tokens — each chunk overlaps 50% with its neighbor.
A passage that would have been split exactly at a fixed-size chunk boundary is now guaranteed to appear whole in at least one of the overlapping chunks.
:::

## 2.4 Semantic Boundary Detection

More advanced semantic chunking computes embeddings for consecutive sentences and looks for meaningful drops in similarity — a proxy for topic shifts — to decide chunk boundaries, rather than a fixed size or purely structural markers.

| Method | Signal Used | Complexity |
|---|---|---|
| Fixed-size | Character/token count | Lowest |
| Structure-based | Existing headers/sections | Low |
| Sliding window | Fixed size with overlap | Low-moderate |
| Embedding-based semantic | Similarity drop between consecutive sentences | Highest |

## 2.5 Parent-Child Chunking in Depth

Building on Section 2.2's introduction: small child chunks are embedded and searched for precision, but when a child chunk matches, its parent (a larger surrounding section) is what actually gets passed to generation — combining precise retrieval with sufficient context for the model to work with.

:::insight
**Why This Matters**
This pattern directly resolves the small-vs-large chunk size tension from the Intermediate level — you get the retrieval precision of small chunks and the context richness of large ones, at the cost of storing and managing two related chunk levels.
:::

## 2.6 Choosing a Chunking Strategy by Content Type

| Content Type | Recommended Strategy |
|---|---|
| Well-structured technical docs | Structure-based, following existing headers |
| Dense narrative text (legal, long-form) | Semantic or sliding window |
| Mixed corpus with varying context needs | Parent-child |

## 2.7 Extended Case Study: Combining Parent-Child With Structure Awareness

A technical documentation system needed both precise retrieval for specific API parameters and enough surrounding context to explain them correctly.
1. Used structure-aware splitting first, along existing documentation sections, to define parent chunks.
2. Sub-split each parent into smaller child chunks for embedding and search.
3. Configured retrieval to search child embeddings but return the corresponding parent content to the generation step.
4. Measured recall@5 and answer completeness against the previous single-level chunking approach, confirming improvement on both dimensions.
Topic 2 Review

:::note
Sliding window chunking reduces the chance a relevant passage is split awkwardly at a boundary.
Semantic boundary detection uses similarity drops between sentences as a proxy for topic shifts.
Parent-child chunking directly resolves the precision-vs-context chunk size tension.
Match chunking strategy to content type rather than applying one strategy uniformly across a mixed corpus.
:::`,

16: `# TOPIC 3: Query Rewriting

Users don't always phrase questions in a way that matches how relevant information is phrased in the source documents. Query rewriting uses an LLM to transform the user's raw query into a better-suited search query before retrieval happens.

:::definition
**Query Rewriting**
Query rewriting is the practice of using an LLM to reformulate a user's original query — expanding abbreviations, resolving ambiguity, adding likely relevant terms, or restating it more formally — into a version better suited to similarity search, before that rewritten query is actually embedded and searched.
:::

## 3.1 Common Rewriting Patterns

| Pattern | Example |
|---|---|
| Expanding vague queries | "pricing" → "What are the pricing tiers and costs for each subscription plan?" |
| Resolving conversational context | "what about the enterprise one?" → "What are the features of the enterprise pricing tier?" |
| Hypothetical Document Embeddings (HyDE) | Generate a plausible answer first, then embed that answer to search — since an answer often resembles source text more than a question does |

:::scenario
**Resolving Conversational Context**
In a multi-turn chat, a user's follow-up "what about the enterprise one?" is meaningless as a standalone search query. Query rewriting uses the conversation history to expand it into a self-contained query — "What are the features of the enterprise pricing tier?" — before it's embedded, since the vector database has no awareness of the conversation, only of the single query text it's given.
:::

:::insight
**Why This Matters**
Query rewriting matters most exactly where naive RAG struggles most: short, ambiguous, or conversationally-dependent queries — which describes a large fraction of real user input in any chat-based application.
:::

## 3.2 Query Expansion

Rather than replacing the original query, expansion adds related terms or phrasings alongside it, broadening what can match without discarding the user's original intent — useful when the risk of a rewrite drifting from the original meaning outweighs the benefit of a cleaner single rewrite.

:::scenario
**Query Expansion in Practice**
Original: "laptop won't turn on"
Expanded search terms: "laptop won't turn on", "laptop not powering on", "laptop won't boot", "laptop dead battery" — all searched, results merged.
:::

## 3.3 Hypothetical Document Embeddings (HyDE)

HyDE has the model generate a hypothetical, plausible-sounding answer to the query first, then embeds that hypothetical answer — rather than the query itself — for retrieval. This can outperform direct query embedding because a hypothetical answer's phrasing and vocabulary tends to be closer to how real relevant documents are actually worded than a short user question is.

:::definition
**HyDE (Hypothetical Document Embeddings)**
A retrieval technique that embeds a model-generated hypothetical answer to the query, rather than the query itself, to better match the vocabulary and style of real source documents.
:::

:::insight
**Why This Matters**
HyDE is especially effective when there's a large vocabulary or style gap between how users ask questions and how source documents are written — for example, casual questions against formal technical documentation.
:::

## 3.4 Decomposition for Complex Queries

A single query bundling several distinct sub-questions ("compare X and Y and tell me which is cheaper and faster") often retrieves poorly as one search. Decomposing it into separate sub-queries, retrieving for each, and combining results addresses this — related to, but distinct from, the multi-query retrieval covered later in this level.

## 3.5 When Rewriting Can Hurt

Query rewriting isn't free — it adds an LLM call's worth of latency, and a poorly-behaved rewrite can drift from the user's actual intent, sometimes performing worse than the unmodified original query.

:::mistake
Applying query rewriting universally, without measuring it against direct retrieval on your own evaluation set, risks adding latency for a technique that may not even help — and could occasionally hurt — on your specific query patterns.
:::

## 3.6 Extended Case Study: Applying HyDE to a Technical Support Corpus

A support search tool struggled with informal user phrasing against formally-written knowledge base articles.
1. Measured baseline recall@5 using direct query embedding against a labeled evaluation set of real user questions.
2. Implemented HyDE, generating a hypothetical formal answer per query before embedding for retrieval.
3. Re-measured recall@5 and found a clear improvement specifically on the most informally-phrased queries.
4. Deployed HyDE selectively — applied only when the initial direct-query retrieval confidence was low, balancing the added latency against the measured benefit.
Topic 3 Review

:::note
Query expansion broadens what can match without discarding the original query's intent.
HyDE embeds a generated hypothetical answer, often closer in style to real documents than a short query.
Decomposing bundled multi-part queries into sub-queries improves retrieval on complex questions.
Measure rewriting techniques against your own evaluation set — they add latency and aren't guaranteed to help every query pattern.
:::`,

17: `# TOPIC 4: Hybrid Search

Dense vector search excels at matching meaning but can miss exact terms — product codes, names, acronyms — that a keyword search would catch instantly. Hybrid search combines both approaches to cover each other's blind spots.

![Figure 4.1 — Hybrid search runs dense and sparse retrieval in parallel, then merges the results.](/embeddings_VD_RAG_images/image_11.png)

**Figure 4.1** — Hybrid search runs dense and sparse retrieval in parallel, then merges the results.

:::definition
**Hybrid Search**
Hybrid search combines dense (embedding-based) retrieval with sparse (keyword-based, e.g. BM25) retrieval, running both against the same query and merging their results — capturing both semantic similarity and exact term matches in a single retrieval step.
:::

## 4.1 Why Neither Approach Alone Is Enough

| Query Type | Dense Search Alone | Sparse Search Alone |
|---|---|---|
| "What's your refund policy?" | Strong — captures meaning even with varied phrasing | Weaker — depends on exact word overlap |
| "Error code E-4471" | Weak — an exact code has no inherent 'meaning' to embed | Strong — exact string match works perfectly |
| Mixed natural language + technical terms | Partial | Partial |

This complementary weakness pattern is exactly why hybrid search has become close to a default in mature RAG systems — real user queries frequently mix natural language with exact identifiers, names, or jargon that benefit from each retrieval method differently.

## 4.2 Merging Two Ranked Lists

Combining two separately-ranked result lists into one final ranking is itself a small technical problem, most commonly solved with Reciprocal Rank Fusion (RRF) — a method that scores each document based on its rank position in each list, rather than trying to directly compare dense similarity scores against sparse keyword scores, which aren't on the same scale to begin with.

## 4.3 BM25: The Standard Sparse Retrieval Method

BM25 is a keyword-based ranking algorithm that scores documents by term frequency, adjusted for document length and term rarity across the corpus — the sparse counterpart to dense vector search, and what most hybrid search implementations pair with embeddings.

:::definition
**BM25**
A classic, well-established sparse retrieval ranking function based on keyword term frequency and inverse document frequency, still highly competitive for exact-term matching.
:::

## 4.4 Reciprocal Rank Fusion

Reciprocal Rank Fusion (RRF) is the most common way to merge dense and sparse ranked lists: each document's score is based on its rank position in each list (not the raw scores, which aren't directly comparable across methods), summed across lists — avoiding the problem of combining two incompatible scoring scales.

:::scenario
**RRF Scoring Intuition**
A document ranked #1 in dense search and #3 in sparse search scores higher via RRF than one ranked #2 and #2 respectively would under a naive average, because RRF weights strongly toward top ranks specifically.
This rank-based approach sidesteps needing dense and sparse scores to be on comparable numeric scales.
:::

## 4.5 Tuning the Dense/Sparse Balance

Some hybrid implementations expose a weighting parameter between dense and sparse contributions, worth tuning against a labeled evaluation set — the right balance depends heavily on how much your queries rely on exact terms (product codes, names) versus conceptual meaning.

| Query Pattern | Typically Favors |
|---|---|
| Contains specific codes, names, or IDs | Higher sparse weight |
| Conceptual, paraphrased, or exploratory | Higher dense weight |
| Mixed / unknown in advance | Balanced weighting, tuned empirically |

## 4.6 When Hybrid Search Isn't Worth the Complexity

For corpora and query patterns with very little exact-term matching need (pure conceptual Q&A, for example), the added infrastructure of maintaining both a sparse and dense index may not earn its keep. Measuring dense-only performance first establishes whether hybrid search is solving a real, measured gap.

:::mistake
Adding hybrid search by default, without confirming dense-only retrieval actually has a measurable exact-match weakness on your queries, adds real infrastructure and maintenance cost for a problem that may not exist in your specific use case.
:::

## 4.7 Extended Case Study: Adding Hybrid Search for Product Codes

An e-commerce search tool using dense-only retrieval performed well on descriptive queries but consistently failed on exact product SKU lookups.
1. Confirmed the failure pattern was specific to exact-code queries by segmenting the evaluation set into descriptive versus code-based queries.
2. Added a BM25 sparse index alongside the existing dense index, combined via reciprocal rank fusion.
3. Measured recall@5 separately on both query segments, confirming code-query recall improved substantially while descriptive-query recall stayed roughly the same.
4. Shipped hybrid search, having confirmed the added complexity solved a real, measured gap rather than a hypothetical one.
Topic 4 Review

:::note
BM25 is the standard sparse retrieval method, strong specifically at exact-term matching.
Reciprocal rank fusion merges dense and sparse ranked lists using rank position, avoiding incompatible score scales.
The right dense/sparse balance depends on how exact-term-dependent your queries are — tune it empirically.
Confirm a real, measured exact-match gap exists before adopting the added complexity of hybrid search.
:::`,

18: `# TOPIC 5: Re-ranking

Retrieval — whether dense, sparse, or hybrid — is optimized for speed across a large collection, which means it isn't always perfectly precise. Re-ranking adds a second, slower but more accurate pass over a smaller candidate set.

![Figure 5.1 — A fast initial search over-retrieves; a slower, more accurate re-ranker narrows to the best few.](/embeddings_VD_RAG_images/image_12.png)

**Figure 5.1** — A fast initial search over-retrieves; a slower, more accurate re-ranker narrows to the best few.

:::definition
**Re-ranking**
Re-ranking takes a larger set of initially retrieved candidates (e.g. the top 50) and re-scores each one using a more computationally expensive but more accurate relevance model — typically a cross-encoder — keeping only the top few (e.g. 5) most genuinely relevant results to actually pass to the LLM.
:::

## 5.1 Why a Second Pass Helps

Vector search compares a query embedding against document embeddings that were computed independently, with no awareness of each other — this is what makes it fast enough to search millions of vectors. A cross-encoder re-ranker instead processes the query and each candidate document together, letting it directly model the interaction between them — much more accurate, but far too slow to run against an entire collection, which is exactly why it's applied only to the small candidate set an initial fast search already narrowed down.

| Stage | Speed | Accuracy | Runs Against |
|---|---|---|---|
| Initial retrieval (dense/sparse/hybrid) | Fast | Good | Entire collection |
| Re-ranking (cross-encoder) | Slow per-item | Excellent | Small candidate set only (e.g. top 50) |

:::tip
Re-ranking is one of the highest-value additions to a RAG system that's retrieving plausible-but-not-quite-right chunks — it's a comparatively small engineering addition for a often-substantial jump in the relevance of what actually reaches the LLM.
:::

## 5.2 Cross-Encoders vs. Bi-Encoders

The embedding models used for initial retrieval are bi-encoders — they embed query and document independently, enabling fast pre-computed comparison at scale. Re-rankers are typically cross-encoders — they process the query and a candidate document together in a single pass, capturing richer interaction between them at the cost of being far too slow to run against an entire corpus.

| Encoder Type | Speed | Accuracy | Used For |
|---|---|---|---|
| Bi-encoder | Fast — pre-computable | Good | Initial large-scale retrieval |
| Cross-encoder | Slow — computed per pair at query time | Higher, especially for subtle relevance | Re-ranking a small candidate set |

## 5.3 The Two-Stage Retrieval Pattern

Combining both encoder types is the standard pattern: retrieve a larger candidate set quickly with a bi-encoder (e.g. top 50), then re-rank that smaller set with a slower, more accurate cross-encoder, and return only the final top K (e.g. top 5) to the generation step.

:::insight
**Why This Matters**
This pattern gets the speed of bi-encoder search across the whole corpus and the accuracy of cross-encoder scoring where it matters most — on the much smaller candidate set that's actually worth spending more compute on.
:::

## 5.4 Choosing How Many Candidates to Re-Rank

Re-ranking more initial candidates increases the chance of catching a relevant result the first-stage retrieval ranked lower, at added re-ranking latency — a tunable trade-off worth setting against measured recall on an evaluation set, the same as other retrieval parameters in this course.

:::mistake
Re-ranking too few initial candidates defeats the purpose — if a genuinely relevant document didn't make the first-stage candidate set at all, no amount of re-ranking can recover it. The first-stage retrieval's recall at the candidate set size is what actually bounds final quality.
:::

## 5.5 Re-Ranking Latency in Context

Cross-encoder re-ranking adds a measurable latency cost — typically tens to low hundreds of milliseconds for a modest candidate set — which needs to fit within the overall pipeline latency budget established in the Intermediate level's building-RAG-pipelines topic.

## 5.6 Extended Case Study: Adding Re-Ranking to Improve Precision

A legal research tool's initial retrieval had reasonable recall@20 but poor precision at the top 5 results actually shown to users.
1. Measured baseline precision@5 using bi-encoder retrieval alone.
2. Retrieved the top 20 candidates via bi-encoder, then re-ranked with a cross-encoder to select the final top 5.
3. Re-measured precision@5 post-re-ranking and confirmed a substantial improvement, since the cross-encoder correctly demoted several superficially similar but less relevant candidates.
4. Measured the added latency and confirmed it stayed within the product's acceptable response time budget before shipping.
Topic 5 Review

:::note
Bi-encoders (fast, independent embedding) handle initial retrieval; cross-encoders (slower, joint scoring) handle re-ranking.
The two-stage pattern — broad fast retrieval, then precise re-ranking of a smaller set — is the standard approach.
First-stage recall at the candidate set size bounds what re-ranking can ultimately recover.
Re-ranking adds real latency — budget and measure it as part of the overall pipeline latency target.
:::`,

19: `# TOPIC 6: Multi-Query Retrieval

A single query, however well phrased, represents just one angle on what the user is looking for. Multi-query retrieval generates several variations of the query and searches with all of them, then combines the results.

![Figure 6.1 — Several query variants search in parallel; their combined results cover more ground than any single phrasing.](/embeddings_VD_RAG_images/image_13.png)

**Figure 6.1** — Several query variants search in parallel; their combined results cover more ground than any single phrasing.

:::definition
**Multi-Query Retrieval**
Multi-query retrieval uses an LLM to generate several different phrasings or perspectives on the original query, runs a separate similarity search for each variant, and merges the deduplicated results — increasing the chance of matching relevant content phrased differently than the original query.
:::

## 6.1 How This Differs from Query Rewriting

Query rewriting (Topic 3) produces one improved query to replace the original. Multi-query retrieval produces several queries in addition to (or instead of) the original, searching with all of them in parallel rather than picking a single best phrasing. The two techniques are complementary and often used together — rewrite for clarity, then generate multiple angles on the rewritten query.

:::mistake
Multi-query retrieval multiplies retrieval cost roughly by the number of variants generated — five variants means five searches, not one. It's a meaningful latency and cost trade-off, best reserved for cases where retrieval recall (missing genuinely relevant content) is a demonstrated problem, not applied indiscriminately to every query.
:::

## 6.2 Generating Diverse Query Variants

The value of multi-query retrieval depends on the variants actually covering different angles — near-duplicate rewordings of the same query add latency without adding retrieval coverage. Prompting explicitly for varied phrasing, perspective, or specificity level helps ensure genuine diversity rather than superficial rewording.

:::scenario
**Diverse vs. Redundant Query Variants**
Redundant: "best laptop for programming", "good laptop for coding", "top laptop for programmers" — all functionally identical.
Diverse: "best laptop for programming", "laptop specs needed for running a local development environment", "laptop battery life for all-day coding sessions" — each surfaces different relevant content.
:::

## 6.3 Merging Results Across Query Variants

Results from multiple query variants need deduplication (the same chunk often appears across several variants' results) and a combined ranking — reciprocal rank fusion, introduced for hybrid search, applies equally well here to merge multiple ranked lists into one.

| Step | Purpose |
|---|---|
| Run each query variant independently | Cover different angles on the original question |
| Deduplicate results across variants | Avoid the same chunk appearing multiple times in final results |
| Merge rankings (e.g. via RRF) | Produce one final ranked list from multiple lists |

## 6.4 Cost and Latency Implications

Multi-query retrieval multiplies retrieval calls by the number of variants (plus the cost of generating the variants themselves), making it one of the more expensive techniques in this level — best reserved for queries genuinely likely to benefit, rather than applied universally.

:::insight
**Why This Matters**
Running multi-query retrieval on every request when only a subset of queries — typically vague or broad ones — actually benefit is a common source of unnecessary cost. Consider routing: use multi-query only when a signal (e.g. low first-pass retrieval confidence) suggests it's warranted.
:::

## 6.5 Multi-Query vs. Query Rewriting vs. Hybrid Search

| Technique | Solves |
|---|---|
| Query rewriting | One query phrased suboptimally |
| Multi-query retrieval | One query with multiple valid interpretations or angles |
| Hybrid search | Vocabulary mismatch between semantic and exact-term needs |

## 6.6 Extended Case Study: Selectively Applying Multi-Query Retrieval

A research assistant tool's users often asked broad, exploratory questions that a single retrieval pass covered only partially.
1. Identified broad/exploratory queries as the specific segment underperforming, using the retrieval evaluation practices from earlier in the course.
2. Implemented multi-query retrieval, generating 3 diverse variants per query, merged via reciprocal rank fusion.
3. Applied it selectively — only when an initial single-query retrieval pass showed low confidence — rather than for every request.
4. Measured coverage improvement on the broad-query segment specifically, confirming the added cost was concentrated where it actually helped.
Topic 6 Review

:::note
Multi-query retrieval's value depends on genuine diversity between variants, not superficial rewording.
Merge results across variants with deduplication and rank-based fusion, not simple concatenation.
This technique multiplies retrieval cost — apply selectively rather than to every query by default.
Multi-query retrieval, query rewriting, and hybrid search each solve a different, specific retrieval weakness.
:::`,

20: `# TOPIC 7: Contextual Retrieval

Chunking, even done carefully, still embeds each chunk somewhat in isolation from the rest of its source document. Contextual retrieval addresses the information lost when a chunk is separated from its surrounding document.

:::definition
**Contextual Retrieval**
Contextual retrieval prepends a short, LLM-generated summary of a chunk's surrounding context — what document it's from, what section, how it relates to the whole — to the chunk itself before embedding, so the resulting vector captures not just the chunk's own content but its place within the larger document.
:::

## 7.1 The Problem It Solves

:::scenario
**A Context-Starved Chunk**
A chunk reading "The company's revenue grew by 12% in this segment" is nearly meaningless in isolation — which company, which segment, which year? Contextual retrieval would prepend something like "From ACME Corp's 2024 annual report, in the section on European operations:" before embedding, so the vector — and later, the LLM reading the retrieved chunk — has the grounding needed to actually use the information correctly.
:::

:::insight
**Why This Matters**
This directly attacks a failure mode that's easy to miss in testing: individually retrieved chunks can each look reasonable, yet still cause a hallucination or a wrong attribution once assembled into a prompt, simply because the chunk lost its identifying context along the way.
:::

## 7.2 The Cost of Added Context

Generating a contextual summary for every chunk means an extra LLM call per chunk during ingestion — a real cost, though a one-time one paid at indexing time rather than at every query. This makes contextual retrieval a good fit for knowledge bases where retrieval accuracy is high-stakes and the underlying document collection doesn't change constantly, less so for rapidly-changing or very large collections where re-ingestion cost adds up quickly.

## 7.3 Generating Contextual Prefixes

The core technique: before embedding, each chunk is prepended with a short, LLM-generated summary of how it fits into the broader document — giving the embedding model surrounding context it would otherwise lose when a chunk is embedded in isolation.

:::scenario
**A Chunk Before and After Contextualization**
Raw chunk: "Revenue grew 12% year over year, driven primarily by the enterprise segment."
Contextualized: "This chunk is from the Q3 2024 earnings report, in the section discussing overall company financial performance. Revenue grew 12% year over year, driven primarily by the enterprise segment."
The added prefix helps the embedding capture that this is specifically Q3 2024 company-wide revenue data, not, say, a specific product line.
:::

## 7.4 Balancing Contextualization Cost Against Corpus Size

Since contextualization requires one LLM call per chunk during ingestion, cost scales directly with corpus size — a real consideration for very large corpora, and part of why this technique is generally applied selectively rather than universally, addressed further in Section 7.2's cost discussion.

| Corpus Size | Contextualization Cost Consideration |
|---|---|
| Small (thousands of chunks) | Cost is modest; broadly applicable |
| Medium (hundreds of thousands) | Meaningful one-time cost; consider for high-value content first |
| Very large (millions+) | Cost can be substantial; consider selective application or caching if source content overlaps |

## 7.5 Contextual Retrieval Combined With Hybrid Search

The technique that originally popularized contextual retrieval combined it with hybrid (dense + sparse) search, since contextualized chunks help both retrieval methods — richer semantic content for dense embedding, and more disambiguating keywords for sparse matching.

:::insight
**Why This Matters**
Contextual retrieval isn't a replacement for hybrid search or re-ranking — it's complementary, improving the quality of what gets embedded and indexed in the first place, upstream of how it's later searched and ranked.
:::

## 7.6 When Contextual Retrieval Matters Most

This technique provides the largest measured benefit on corpora where chunks are genuinely ambiguous out of context — financial reports with many similar-looking sections, legal documents referencing earlier definitions, or technical specs where a chunk's meaning depends heavily on which product or version section it came from.

:::mistake
Applying contextual retrieval to a corpus of already self-contained, unambiguous chunks (like a FAQ with short, independent question-answer pairs) adds ingestion cost with little measurable retrieval benefit — check whether your content actually has this ambiguity problem first.
:::

## 7.7 Extended Case Study: Contextualizing a Multi-Product Technical Corpus

A technical support knowledge base covered several product lines with structurally similar sections ("Installation", "Troubleshooting") across each product's documentation, and retrieval sometimes surfaced the right section from the wrong product.
1. Confirmed the specific failure pattern: retrieved chunks were topically correct but from the wrong product line.
2. Generated contextual prefixes per chunk, explicitly naming the source product and document section.
3. Re-embedded the corpus and re-measured retrieval accuracy specifically on the previously-confused product-crossover cases.
4. Confirmed the wrong-product retrieval errors dropped substantially, justifying the one-time re-ingestion cost.
Topic 7 Review

:::note
Contextual retrieval prepends a generated summary to each chunk before embedding, restoring context lost by chunking in isolation.
Contextualization cost scales with corpus size — apply selectively for very large corpora.
It's complementary to hybrid search and re-ranking, not a replacement for either.
It matters most where chunks are genuinely ambiguous without surrounding context — check this before applying it by default.
:::`,

21: `# TOPIC 8: Agentic RAG

Every technique so far still fundamentally performs one retrieval pass (or a few parallel ones) per query. Agentic RAG turns retrieval itself into an iterative, reasoned process — deciding what to search for, evaluating whether the results are sufficient, and searching again if not.

![Figure 8.1 — Agentic RAG loops through planning, retrieving, and assessing until it has enough to answer.](/embeddings_VD_RAG_images/image_14.png)

**Figure 8.1** — Agentic RAG loops through planning, retrieving, and assessing until it has enough to answer.

:::definition
**Agentic RAG**
Agentic RAG applies agentic reasoning patterns — planning, acting, and observing in a loop — directly to the retrieval process itself, letting a system decide what to search for, retrieve, evaluate whether the results are sufficient, and issue further searches with revised queries if they aren't, rather than committing to a single fixed retrieval pass.
:::

## 8.1 When a Single Retrieval Pass Isn't Enough

Some questions genuinely require multiple, sequentially-dependent retrieval steps — 'compare this year's and last year's revenue in the region with the highest growth' requires first finding which region had the highest growth, then retrieving that specific region's figures for both years. No single fixed query can retrieve the right content for a question like this in one pass, because part of what to search for depends on an earlier retrieval's result.

| RAG Style | Retrieval Passes | Best Fit |
|---|---|---|
| Naive RAG | One fixed pass | Direct factual questions answerable from a single retrieval |
| Multi-query RAG | Several parallel passes, one round | Broadening coverage of a single question |
| Agentic RAG | Sequential passes, planned and adaptive | Multi-step or comparative questions requiring earlier results to inform later searches |

:::insight
**Why This Matters**
Agentic RAG is meaningfully more expensive in latency and cost than the fixed-pipeline techniques covered earlier in this level — each additional loop iteration is another retrieval and reasoning step. It earns that cost specifically on genuinely multi-step questions, and is generally poor value applied to the large fraction of queries a simpler pipeline already answers well.
:::

:::note
This closes the course. From representing meaning as vectors through building and hardening a full RAG pipeline — chunking, embedding, hybrid search, re-ranking, and adaptive agentic retrieval — you now have the complete toolkit for grounding an LLM in real, current, and private knowledge. This foundation connects directly into the dedicated Agentic AI domain of this curriculum, where retrieval becomes just one of several tools an autonomous agent can call on.
:::

## 8.2 The Plan-Retrieve-Assess Loop

Agentic RAG wraps retrieval in an agent loop: plan what to search for, retrieve, assess whether the result is sufficient to answer the original question, and either proceed to generation or plan another retrieval step — the same reasoning-action-observation pattern from this curriculum's prompt engineering course, applied specifically to retrieval.

:::definition
**Agentic RAG**
A RAG architecture where retrieval is treated as a tool an agent can invoke multiple times, planning and assessing between calls, rather than a single fixed retrieval pass before generation.
:::

## 8.3 When Single-Pass Retrieval Genuinely Isn't Enough

Not every question benefits from agentic RAG's added complexity and latency — it earns its cost specifically on questions requiring synthesis across multiple, not-obviously-related retrieval steps.

| Question Type | Single-Pass Retrieval | Agentic RAG |
|---|---|---|
| "What's our refund policy?" | Sufficient | Unnecessary overhead |
| "Compare our Q1 and Q3 revenue and explain the difference" | May miss one of the two needed documents | Can retrieve each piece, then synthesize |
| "What changed in our API between v2 and v3?" | May retrieve only one version's docs | Can retrieve both versions and compare |

## 8.4 Guardrails Specific to Agentic RAG

The general agentic guardrails from this curriculum's prompt engineering course — step limits, repeated-action detection, graceful fallback — apply directly here, with one RAG-specific addition: bounding total retrieved content across all steps, since an unbounded agentic loop can otherwise accumulate more context than the generation step can effectively use.

:::mistake
An agentic RAG loop with no limit on cumulative retrieved content can silently degrade generation quality by overloading context with marginally relevant material from many retrieval steps, even if each individual step's guardrails (like a step-count limit) are respected.
:::

## 8.5 Cost and Latency Reality Check

Agentic RAG can require several times the retrieval and generation calls of single-pass RAG for a single user question — a real cost and latency multiplier that should be reserved for the specific query types measured to actually need it, following the same selective-application principle from earlier Advanced-level topics.

:::insight
**Why This Matters**
As with multi-query retrieval, routing — applying agentic RAG only when a signal suggests a question needs multi-step retrieval — captures most of the benefit without paying the cost on every request.
:::

## 8.6 Extended Case Study: Agentic RAG for Cross-Document Analysis

A financial analysis tool needed to answer comparative questions spanning multiple quarterly reports, which single-pass retrieval handled poorly.
1. Measured single-pass RAG performance specifically on comparative, multi-document questions and confirmed a clear, measured gap.
2. Implemented an agentic loop: plan which reports/sections are needed, retrieve each, assess completeness, retrieve additional pieces if needed, then generate a synthesized answer.
3. Added a step limit and a cumulative retrieved-content cap to prevent runaway loops on ambiguous questions.
4. Routed only comparative-style questions (detected via a lightweight classifier) to the agentic path, keeping simple questions on the cheaper single-pass pipeline.

## 8.7 Quick Reference: This Course's Full Toolkit

| Stage | Techniques Covered |
|---|---|
| Foundation | Embeddings, similarity, vector representations, ANN search (Basic level) |
| Production pipeline | Vector database architecture, chunking, ingestion, full RAG loop (Intermediate level) |
| Precision & coverage | Advanced chunking, query rewriting, hybrid search, re-ranking, multi-query (Advanced level) |
| Architecture | Contextual retrieval, agentic RAG (Advanced level) |

Course Closing Review

:::note
Agentic RAG treats retrieval as a repeatable tool within a plan-retrieve-assess loop, for questions needing multi-step synthesis.
It's reserved for genuinely multi-hop questions — apply selectively, not as a universal replacement for single-pass RAG.
Guardrails need to bound cumulative retrieved content, not just step count.
This course's techniques compose: production RAG systems typically draw on foundation, pipeline, and precision techniques together, adding agentic RAG only where genuinely needed.
:::

Topic 8 Review

:::note
Agentic RAG is the most structurally different technique in this course — a loop rather than a single pass.
Cost and latency multiply with each retrieval step — route selectively based on question type.
This closes the course's Advanced level and the full 21-topic curriculum on Embeddings, Vector Databases & RAG.
:::`,

}

export default embeddingsRagContent
