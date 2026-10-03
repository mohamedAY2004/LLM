# TF-IDF → BERT Resources

## Knowledge

### Primary sources (the papers each step comes from)
- [Paper: "Efficient Estimation of Word Representations in Vector Space" — Mikolov, Chen, Corrado, Dean (2013)](https://arxiv.org/abs/1301.3781)
  The original Word2Vec paper (CBOW and skip-gram). Use for: what Word2Vec claimed and its speed argument.
- [Paper: "Distributed Representations of Words and Phrases and their Compositionality" — Mikolov et al. (2013)](https://arxiv.org/abs/1310.4546)
  Adds negative sampling and subsampling of frequent words. Use for: how skip-gram is actually trained.
- [Paper: "Sequence to Sequence Learning with Neural Networks" — Sutskever, Vinyals, Le (2014)](https://arxiv.org/abs/1409.3215)
  The LSTM encoder-decoder, including the source-reversal trick. Use for: Seq2Seq and early evidence that long-range dependencies are hard.
- [Paper: "On the Properties of Neural Machine Translation: Encoder–Decoder Approaches" — Cho et al. (2014)](https://arxiv.org/abs/1409.1259)
  Shows translation quality "degrades rapidly" as sentence length grows. Use for: evidence of the bottleneck.
- [Paper: "Neural Machine Translation by Jointly Learning to Align and Translate" — Bahdanau, Cho, Bengio (2014/ICLR 2015)](https://arxiv.org/abs/1409.0473)
  The first attention mechanism for encoder-decoders. Use for: the attention equations (e_ij, α_ij, c_i) and the alignment heatmaps.
- [Paper: "Attention Is All You Need" — Vaswani et al. (2017)](https://arxiv.org/abs/1706.03762)
  The Transformer. Use for: scaled dot-product attention, the √d_k reason, multi-head attention, and the three uses of attention.
- [Paper: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding" — Devlin et al. (2018/NAACL 2019)](https://aclanthology.org/N19-1423/)
  Use for: MLM (15%, 80/10/10), NSP, input embeddings, model sizes, the "see itself" argument, and the Table 5 ablation.
- [Paper: "RoBERTa: A Robustly Optimized BERT Pretraining Approach" — Liu et al. (2019)](https://arxiv.org/abs/1907.11692)
  A replication study finding that BERT "was significantly undertrained". Use for: follow-ups to BERT's design choices.

### Explainers (read these next to the papers)
- [Blog: "The Illustrated Word2vec" — Jay Alammar](https://jalammar.github.io/illustrated-word2vec/)
  Visual walk-through of skip-gram and negative sampling. Use for: lesson 0002.
- [Blog: "Visualizing A Neural Machine Translation Model (Mechanics of Seq2seq Models With Attention)" — Jay Alammar](https://jalammar.github.io/visualizing-neural-machine-translation-mechanics-of-seq2seq-models-with-attention/)
  Animated Seq2Seq and attention. Use for: lessons 0003 and 0004.
- [Blog: "The Illustrated Transformer" — Jay Alammar](https://jalammar.github.io/illustrated-transformer/)
  Self-attention and multi-head attention step by step. Use for: lesson 0005.
- [Blog: "The Illustrated BERT, ELMo, and co." — Jay Alammar](https://jalammar.github.io/illustrated-bert/)
  Transfer learning in NLP, ELMo, then BERT. Use for: lesson 0006.

### Textbook and course
- [Book: *Speech and Language Processing* (3rd ed. draft, Aug 2026) — Jurafsky & Martin](https://web.stanford.edu/~jurafsky/slp3/)
  Free, rigorous, and kept current. Relevant chapters: [Ch 5 Embeddings](https://web.stanford.edu/~jurafsky/slp3/5.pdf) (§5.5 Word2vec), [Ch 14 RNNs and LSTMs](https://web.stanford.edu/~jurafsky/slp3/14.pdf) (§14.7 Encoder-Decoder, §14.8 Attention), [Ch 7 Transformers and Pretraining](https://web.stanford.edu/~jurafsky/slp3/7.pdf), [Ch 9 Masked Language Models](https://web.stanford.edu/~jurafsky/slp3/9.pdf).
- [Course: Stanford CS224N — NLP with Deep Learning](https://web.stanford.edu/class/cs224n/)
  Free slides plus a [YouTube lecture playlist (2024)](https://www.youtube.com/playlist?list=PLoROMvodv4rOaMFbaqxPDoLWjDaRAdP9D). Use for: hearing the same arc explained in lecture form.

## Communities
- [r/LanguageTechnology](https://www.reddit.com/r/LanguageTechnology/)
  About 64K NLP developers and ML engineers; covers theory, careers and applications. Use for: "is my understanding right?" questions. (Avoid r/NLP, which is about neuro-linguistic programming.)
- [Hugging Face Forums](https://discuss.huggingface.co/)
  Has Beginners, Models and Research categories. Use for: practical BERT and fine-tuning questions once you start using real models.
