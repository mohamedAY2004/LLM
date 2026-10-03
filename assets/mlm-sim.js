/* ============================================================
   mlm-sim.js — BERT masked-language-model data generator, simulated.

   <div class="mlm-sim" data-title="…">
     <script type="application/json">
       {"tokens": ["[CLS]", "my", "dog", "is", "hair", "##y", "[SEP]"],
        "vocab":  ["apple", "ran", "blue"],   // pool for random replacement
        "rate": 0.15}
     </script>
   </div>

   Follows Devlin et al. (2019) §3.1: choose 15% of token positions;
   of those, 80% → [MASK], 10% → a random token, 10% → left unchanged.
   The model is only graded on the chosen positions.
   ============================================================ */
(function () {
  "use strict";
  const SPECIAL = /^\[(CLS|SEP|PAD)\]$/;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  document.querySelectorAll(".mlm-sim").forEach(function (sim) {
    const cfg = JSON.parse(sim.querySelector('script[type="application/json"]').textContent);
    const rate = cfg.rate || 0.15;

    sim.insertAdjacentHTML("beforeend",
      '<div class="set-title" style="font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;font-weight:700;color:var(--accent);margin-bottom:.5rem">' +
      esc(sim.dataset.title || "Masked-LM simulator") + "</div>" +
      '<div class="small muted">Original input</div><div class="tokens orig"></div>' +
      '<div class="small muted">What BERT actually sees (with the target it must predict underneath)</div><div class="tokens seen"></div>' +
      '<div class="legend"><span class="l-mask">chosen → [MASK] (80%)</span><span class="l-rand">chosen → random token (10%)</span><span class="l-kept">chosen → unchanged (10%)</span></div>' +
      '<div class="row" style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.6rem 0"><button type="button" class="btn primary b-one">Mask a new example</button>' +
      '<button type="button" class="btn b-many">Simulate 10,000 sentences</button></div>' +
      '<div class="tally"></div>');

    const orig = sim.querySelector(".orig"), seen = sim.querySelector(".seen"), tally = sim.querySelector(".tally");
    orig.innerHTML = cfg.tokens.map((t) => '<span class="tok' + (SPECIAL.test(t) ? " special" : "") + '">' + esc(t) + "</span>").join("");

    function corrupt() {
      const cand = cfg.tokens.map((t, i) => (SPECIAL.test(t) ? -1 : i)).filter((i) => i >= 0);
      let chosen = cand.filter(() => Math.random() < rate);
      if (chosen.length === 0) chosen = [cand[Math.floor(Math.random() * cand.length)]];
      const out = cfg.tokens.map((t) => ({ text: t, kind: SPECIAL.test(t) ? "special" : "plain", target: null }));
      chosen.forEach(function (i) {
        const r = Math.random();
        out[i].target = cfg.tokens[i];
        if (r < 0.8) { out[i].text = "[MASK]"; out[i].kind = "masked"; }
        else if (r < 0.9) {
          let rep; do { rep = cfg.vocab[Math.floor(Math.random() * cfg.vocab.length)]; } while (rep === cfg.tokens[i]);
          out[i].text = rep; out[i].kind = "random";
        } else { out[i].kind = "kept"; }
      });
      return { out: out, n: cand.length };
    }

    function one() {
      const r = corrupt();
      seen.innerHTML = r.out.map((t) => '<span class="tok ' + t.kind + '">' + esc(t.text) +
        (t.target ? '<span class="tgt">→ ' + esc(t.target) + "</span>" : "") + "</span>").join("");
    }

    function many() {
      let m = 0, rnd = 0, kept = 0, chosen = 0, total = 0;
      for (let s = 0; s < 10000; s++) {
        const r = corrupt();
        total += r.n;
        r.out.forEach(function (t) {
          if (!t.target) return;
          chosen++;
          if (t.kind === "masked") m++; else if (t.kind === "random") rnd++; else kept++;
        });
      }
      const pct = (x, of) => ((100 * x) / of).toFixed(1) + "%";
      tally.innerHTML = "Over 10,000 sentences: <b>" + pct(chosen, total) + "</b> of word positions were chosen for prediction " +
        "(slightly above 15% here because this demo forces at least one choice per short sentence). Of those chosen: " +
        "<b>" + pct(m, chosen) + "</b> became [MASK], <b>" + pct(rnd, chosen) + "</b> became a random token, and <b>" + pct(kept, chosen) + "</b> stayed unchanged.";
    }

    sim.querySelector(".b-one").addEventListener("click", one);
    sim.querySelector(".b-many").addEventListener("click", many);
    one();
  });
})();
