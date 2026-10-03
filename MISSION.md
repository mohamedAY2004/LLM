# Mission: The road from TF-IDF to BERT

> **Status: DRAFT, inferred from your first request. Please confirm or correct the "Why" below.**

## Why
You are working through an LLM course (decks 01–03 in this folder). Deck 02 ends with TF-IDF and deck 03 jumps straight to Transformers, which leaves out Seq2Seq, the bottleneck and Bahdanau attention. As a result, the later LLM material (Q/K/V, encoder-only vs decoder-only, pre-training) has no foundation. The goal is to understand each step in the chain well enough to explain *why it had to happen*, so the rest of the course makes sense.
*(Open question: what is this for? An exam, job interviews, or building something? The answer changes what the lessons drill.)*

## Success looks like
- For each step (TF-IDF → Word2Vec → Seq2Seq → attention → Transformer → BERT), you can name the failure that forced it and the mechanism that fixed it.
- You can explain why skip-gram with negative sampling puts "doctor" next to "physician" even though the two words rarely appear together.
- You can compute one attention step by hand (scores → softmax → weighted sum) and say what plays query, key and value in Bahdanau attention and in self-attention.
- You can explain why BERT cannot be trained with next-word prediction, and what `[MASK]`, the 80/10/10 rule, `[CLS]` and `[SEP]` are for.
- You can read deck 03, slides 5–17, without hitting a gap.

## Constraints
- You want the hard parts, not the basics. Preprocessing, BoW/TF-IDF, NB/LR classifiers and cosine similarity are already covered in decks 01–02.
- The source material is compressed slides with no worked examples.

## Out of scope (for now)
- Deck 03 modules 02–06: pre-training infrastructure, scaling laws, RLHF/DPO, inference optimisation, RAG and agents.
- Implementing these models in code (revisit if the mission turns out to be "build something").
