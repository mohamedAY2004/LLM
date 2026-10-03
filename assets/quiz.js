/* ============================================================
   quiz.js — two retrieval-practice widgets shared by all lessons.

   1) Multiple-choice set
      <div class="quiz-set" data-title="Check yourself">
        <script type="application/json">
          [{"q": "Question (HTML ok)",
            "options": ["A", "B", "C", "D"],   // same word count each!
            "answer": 0,                        // index into options
            "why": "Explanation shown after answering (HTML ok)"}]
        </script>
      </div>
      Options are shuffled on every load, so position is never a clue.
      Only the first click counts toward the score.

   2) Free-recall card
      <div class="recall" data-title="Recall">
        <p class="prompt">Explain … from memory.</p>
        <template class="answer"> model answer HTML </template>
      </div>
      You write first, then reveal, then grade yourself. Grades are kept
      in localStorage (when available) so a later session can respace them.
   ============================================================ */
(function () {
  "use strict";

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function store(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: fine */ }
  }

  const page = location.pathname.split("/").pop() || "page";

  /* ---------- Multiple-choice sets ---------- */
  document.querySelectorAll(".quiz-set").forEach(function (set, setIdx) {
    const src = set.querySelector('script[type="application/json"]');
    if (!src) return;
    let items;
    try { items = JSON.parse(src.textContent); } catch (e) {
      set.textContent = "Quiz data could not be read: " + e.message;
      return;
    }

    const title = document.createElement("div");
    title.className = "set-title";
    title.textContent = set.dataset.title || "Check yourself";
    set.appendChild(title);

    let answered = 0, firstTry = 0;
    const score = document.createElement("div");
    score.className = "quiz-score";
    const updateScore = function () {
      score.textContent = answered < items.length
        ? answered + " of " + items.length + " answered"
        : "Done: " + firstTry + " / " + items.length + " right on the first try." +
          (firstTry < items.length ? " Re-read the explanations for the ones you missed, then try again tomorrow." : " Solid. Come back in a few days to check it stuck.");
    };

    items.forEach(function (item, qi) {
      const wrap = document.createElement("div");
      wrap.className = "quiz-q";
      const q = document.createElement("div");
      q.className = "q";
      q.innerHTML = (qi + 1) + ". " + item.q;
      wrap.appendChild(q);

      const opts = document.createElement("div");
      opts.className = "opts";
      const why = document.createElement("div");
      why.className = "why";
      let done = false;

      shuffle(item.options.map(function (text, i) { return { text: text, i: i }; }))
        .forEach(function (o) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "opt";
          b.innerHTML = o.text;
          b.addEventListener("click", function () {
            const right = o.i === item.answer;
            if (!done) {
              done = true;
              answered++;
              if (right) firstTry++;
              store("quiz:" + page + ":" + setIdx + ":" + qi, { right: right, at: Date.now() });
              updateScore();
            }
            b.classList.add(right ? "correct" : "wrong");
            if (right) opts.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
            why.innerHTML = '<span class="verdict ' + (right ? "ok" : "no") + '">' +
              (right ? "Right. " : "Not quite. Try another option. ") + "</span>" +
              (right ? item.why : "");
            why.classList.add("show");
          });
          opts.appendChild(b);
        });

      wrap.appendChild(opts);
      wrap.appendChild(why);
      set.appendChild(wrap);
    });

    updateScore();
    set.appendChild(score);
  });

  /* ---------- Free-recall cards ---------- */
  document.querySelectorAll(".recall").forEach(function (card, ci) {
    const tpl = card.querySelector("template.answer");
    const title = document.createElement("div");
    title.className = "set-title";
    title.textContent = card.dataset.title || "Recall from memory";
    card.insertBefore(title, card.firstChild);

    const ta = document.createElement("textarea");
    ta.placeholder = "Write your answer here before revealing. Messy is fine; the effort of retrieving is what makes it stick.";
    card.appendChild(ta);

    const row = document.createElement("div");
    row.className = "row";
    const reveal = document.createElement("button");
    reveal.type = "button";
    reveal.className = "btn primary";
    reveal.textContent = "Reveal model answer";
    row.appendChild(reveal);
    card.appendChild(row);

    const ans = document.createElement("div");
    ans.className = "model-answer";
    if (tpl) ans.appendChild(tpl.content.cloneNode(true));
    card.appendChild(ans);

    const grade = document.createElement("div");
    grade.className = "row";
    grade.style.display = "none";
    grade.innerHTML = '<span class="small muted">How close were you?</span>';
    ["Nailed it", "Partly", "Missed it"].forEach(function (label) {
      const g = document.createElement("button");
      g.type = "button";
      g.className = "btn";
      g.textContent = label;
      g.addEventListener("click", function () {
        grade.querySelectorAll(".btn").forEach(function (x) { x.classList.remove("selected"); });
        g.classList.add("selected");
        store("recall:" + page + ":" + ci, { grade: label, at: Date.now() });
      });
      grade.appendChild(g);
    });
    card.appendChild(grade);

    reveal.addEventListener("click", function () {
      if (!ta.value.trim() && !confirm("You haven't written anything yet. Retrieval only works if you try first. Reveal anyway?")) return;
      ans.classList.add("show");
      grade.style.display = "flex";
      reveal.disabled = true;
    });
  });
})();
