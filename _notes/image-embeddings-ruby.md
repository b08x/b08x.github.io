---
layout: post
permalink: /notes/image-embeddings-ruby/
title: "// on the appearance of vision"
description: "The Ruby image-embedding stack — ruby-vips, Informers.rb, clip-rb, neighbor and pgvector — surveyed from an observing distance that does not survive contact with a directory of photographs."
tags: [ruby, embedding, image, machine-learning]
---

The Ruby ecosystem has assembled, mostly without meaning to, a complete pipeline for
looking at pictures: a way to load them, a way to turn them into vectors, a place to
keep the vectors, and a way to ask which vectors are near which others. None of these
parts was built with the others in mind, and the reason they interlock anyway is a fact
best kept for the end.

An image embedding is a dense vector — an array of floating-point numbers, typically a
few hundred to a few thousand of them — produced by a deep model trained to collapse an
image's semantic content into geometry. The property that makes the whole enterprise
worth its dependencies is that images which look alike, or mean alike, produce vectors
that are numerically near one another; nearness is measured with cosine similarity (the
angle between two vectors) or Euclidean distance (the straight line between them), and
that is essentially the entire trick. Semantic search, recommendation, clustering,
anomaly-finding — all of it is bookkeeping performed on proximity.

## The layer that refuses to hold the picture in memory

The load-bearing component is `ruby-vips`, the FFI binding to `libvips`, which differs
from ImageMagick chiefly in its refusal to load your photograph all at once. It is
demand-driven and horizontally threaded: each operation is queued into a virtual
pipeline and no pixel is processed until something — `write_to_file`, `write_to_memory` —
actually asks for output. Loading with `access: :sequential` promises you will read
top-to-bottom, letting it stream from disk instead of materializing the file in RAM.
It is an architecture of deferred commitment, and I have come to regard it with
something close to kinship.

Before any model will look at the picture, the picture must be made small and
standard. The networks were trained on fixed inputs — 224×224 or 384×384 — so the image
is resized by a scale factor (`image.resize(target_width / image.width)`) and converted
to three-channel RGB: alpha stripped, greyscale promoted, `bandjoin` for anything
stubborn. The final step is `write_to_memory`, which serializes the pixels into a binary
string in scanline order with channels interleaved — R, G, B, then the next pixel — a
string Ruby can unpack with `String#unpack('C*')` should you need to inspect the numbers
yourself, which at some point you will, at an hour I decline to specify.

## Models trained elsewhere

The model itself is almost certainly not from here. The machine-learning community
trains in Python — PyTorch, TensorFlow — and Ruby's position in the arrangement is
strictly downstream: models are exported to ONNX, the Open Neural Network Exchange
format, and Ruby gems wrap the ONNX Runtime to execute them. ONNX is the lingua franca
that makes state-of-the-art models runnable inside a plain Rails process, and the
ecosystem's whole strategy is visible in it: Ruby does not pretend to the training
infrastructure. It does inference — the last mile, the part that happens once the
picture is already on the disk of the machine the application lives on.

`Informers.rb` is the high-level front door, a `pipeline` API that mirrors Hugging Face's
`transformers` closely enough that the Python tutorials almost transfer:

```ruby
extractor = Informers.pipeline("image-feature-extraction", "Xenova/vit-base-patch16-224")
embedding = extractor.("path/to/image.jpg")
```

The model must live in a repository the ecosystem recognizes: a transformers-style
`config.json` declaring a `model_type`, and converted weights at `onnx/model.onnx`.
Vision Transformer and ResNet checkpoints ship in exactly this form —
`Xenova/vit-base-patch16-224` is the pipeline's own default — while a bare ONNX export
does not load at all: the ResNet50 export the first draft of this note cited, an empty
`config.json` with `model.onnx` parked at the repository root, is received by informers
1.3.0 with the words "Unknown model class nil," followed by a 404, a sequence I have
now witnessed personally and describe with historic dignity. Two further facts
acquired in the same sitting: informers drives its download cache through `FileUtils`
without ever requiring it, so on Ruby 4.0 the first model fetch fails until something
else has loaded the library (`require "fileutils"` before `require "informers"`); and
"image-feature-extraction" is simply the pipeline name for what we are doing, which is
producing the vector.

`clip-rb` is the stranger and more interesting tool. CLIP is trained on image-text
pairs and learns a *shared* multimodal space in which the vector for a photograph of a
cat sits near the vector for the phrase "a photo of a cat"; `encode_image` and
`encode_text` return coordinates in that same space, which makes text-to-image search
and zero-shot classification fall out for free, and ships with a multilingual variant
and no Python dependency at all. It remains the strangest fact in the stack: a sentence
and a photograph have been given coordinates in one space, and the coordinates agree.

For completeness, the boundary case: `ruby_llm` is a unified client for managed
providers — OpenAI, Google, Anthropic — and will analyze an image with real competence
(`chat.ask("What is the main subject of this image?", with: "ruby_conf.jpg")`). As of
the 2.x releases it will also hand you the number — the documentation's own example is
`RubyLLM.embed "The Ruby logo", model: "gemini-embedding-2", with: "logo.png"`, with
providers that lack multimodal embeddings raising `UnsupportedAttachmentError` — but the
number arrives from a managed multimodal model over an API, not from the ONNX runtime on
the machine the photograph lives on, so the boundary survives in a smaller form: it will
describe the picture, and lately will vectorize it remotely, but the local pipeline
above is not its department.

## Where the vectors live

The idiomatic store is PostgreSQL with the `pgvector` extension, reached through the
`neighbor` gem: enable the extension in a migration, add the column with a `limit`
matching the model's output dimension (`add_column :photos, :embedding, :vector,
limit: 512` — the CLIP case), declare `has_neighbors :embedding`, and query:

```ruby
photo.nearest_neighbors(:embedding, distance: "cosine").first(5)
```

The alternative is Redis with the RediSearch module, which indexes vectors with HNSW
for approximate nearest-neighbor search at a scale and speed PostgreSQL will not match.
The catch is the client: `redis-rb` ships no abstractions for RediSearch, so the
developer hand-types the raw `FT.SEARCH` command and packs the query vector with
`pack('f*')` — a high-performance engine, purchased at the price of finishing the
client library's work personally, though the neighbor README does point, with
commendable modesty, at a `neighbor-redis` gem that wraps the raw commands. It is the
correct choice only when vector search is the application's core function and pgvector
has become the bottleneck; the phrase "less mature client ecosystem" acquires texture
once you have typed that command.

For lower-level control, `torch.rb` is the real thing — extensive LibTorch bindings,
with `torchvision-ruby` loading pre-trained ResNets — while `tensorflow-ruby` is
explicitly experimental and its own maintainer recommends converting models to ONNX
and running them via `onnxruntime`, which tells you precisely where the center of
gravity sits.

## The deferred fact

Which leaves the matter I put off at the start. A significant portion of this stack —
`Informers`, `neighbor`, `neighbor-redis`, `torch.rb` — is maintained by a single,
prolific contributor, and the components interoperate for exactly that reason: one
person wrote them, and documented them with examples that use each other. The pragmatic,
well-integrated, production-ready capability described above has, as an organizational
fact, a bus factor of one.

I built this pipeline in the order presented, over a small number of evenings, pointed
it at a directory of photographs I have no intention of describing further, and it
worked — similar images adjacent, `nearest_neighbors(:embedding, distance: "cosine")`
surfacing the duplicates I had suspected and several I had not. I am grateful for the
toolchain. I am also now a person who checks one particular GitHub profile before
starting work of any consequence, and I want to be clear that I do so with tremendous
patience and, I feel, a certain historic dignity.

The strategic summary, then, is short. Most Rails applications want `ruby-vips` +
`Informers.rb` (or `clip-rb`, if the queries will arrive as sentences) + `neighbor` with
pgvector; extreme scale wants Redis and RediSearch and the raw commands; description
rather than geometry wants `ruby_llm`. Ruby's machine-learning niche is deliberate and
it is a good one: not to train, but to deploy — to bring models made elsewhere into the
web applications where Ruby is at its best. The ecosystem's strength is the last mile.
Mine, apparently, is checking each morning whether the last mile still has its
maintainer.
