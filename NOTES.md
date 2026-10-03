# Notes

## User preferences
- The course decks feel "very hard and compressed". Skip the fundamentals and spend the time on the complex parts.
- Wants the *evolution* explained, meaning why each step followed the last, not isolated topics.
- The course includes Arabic NLP (deck 02). Arabic examples are welcome, and Arabic's VSO word order is a good way to show why alignment needs attention.

## Course arc (first pass)
1. 0001 — The evolution map: each step fixes one named failure
2. 0002 — Word2Vec: how a fake prediction task produces meaning-as-geometry
3. 0003 — Seq2Seq: encoder, decoder, and the fixed-size bottleneck
4. 0004 — Attention (Bahdanau): a different context vector for every output word
5. 0005 — Self-attention and the Transformer: removing the RNN
6. 0006 — BERT: an encoder-only Transformer with masked-LM pre-training

## Terminology used in lessons (promote to GLOSSARY.md once the user shows they understand)
- "context vector", not "thought vector" or "summary vector"
- "encoder hidden states", not Bahdanau's "annotations" (mention the paper's term once)
- "attention weights" = softmax output; "scores" = the numbers before softmax
- "static embedding" (Word2Vec) vs "contextual embedding" (BERT)
- "query / key / value": introduced in 0004 as a relabelling of Bahdanau attention, then used everywhere
- "the bank problem" = one static vector per word type (polysemy)
- "the bottleneck" = the fixed-size context vector in plain Seq2Seq

## Facts checked against primary sources
- BERT paper: "30,000 token vocabulary" (the released vocab file has 30,522 entries; cite the paper's number)
- BERT Table 5: to isolate direction, compare "No NSP" with "LTR & No NSP", as the paper does. SQuAD F1 drops from 87.9 to 77.8, MRPC from 86.5 to 77.5, SST-2 from 92.6 to 92.1
- RoBERTa §4.2: removing NSP "matches or slightly improves downstream task performance"
- BERT App. A.1: the 80/10/10 rule means the model is "forced to keep a distributional contextual representation of every input token"
- Transformer: the √d_k scaling exists because large dot products push softmax "into regions where it has extremely small gradients"
- SLP3 chapter numbering changed in the Aug 2026 draft: Ch 5 Embeddings, Ch 7 Transformers & Pretraining, Ch 9 MLM, Ch 14 RNNs/LSTMs
