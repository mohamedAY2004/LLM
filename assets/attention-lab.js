/* ============================================================
   attention-lab.js — interactive attention calculator.
   Used for Bahdanau attention (lesson 0004) and self-attention (0005).

   <div class="attn-lab" data-title="Attention lab">
     <script type="application/json">
     {
       "dims":    ["animate", "place"],        // names for vector components
       "scale":   true,                        // divide scores by sqrt(d)
       "keys":    [{"label": "animal", "k": [3.5, 0], "v": [1, 0]}],  // v defaults to k
       "queries": [{"label": "\"it\" (…tired)", "q": [2, 0.2]}],
       "heatmap": true,                        // also show all queries × keys as a grid
       "queryName": "q",                       // symbol shown for the query (e.g. s, q)
       "outName": "c"                          // symbol shown for the output vector
     }
     </script>
   </div>

   Shows: score_j = q·k_j (/√d) → weights = softmax(scores) → output = Σ weight_j · v_j.
   The query's numbers are editable, so the learner can watch the weights move.
   ============================================================ */
(function () {
  "use strict";

  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  const fmt = (x) => (Math.abs(x) < 0.005 ? 0 : x).toFixed(2);
  const softmax = (xs) => {
    const m = Math.max.apply(null, xs);
    const e = xs.map((x) => Math.exp(x - m));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map((x) => x / s);
  };
  const vec = (v) => "[" + v.map(fmt).join(", ") + "]";
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function attend(cfg, q) {
    const d = q.length;
    const raw = cfg.keys.map((k) => dot(q, k.k));
    const scores = cfg.scale ? raw.map((s) => s / Math.sqrt(d)) : raw;
    const w = softmax(scores);
    const vals = cfg.keys.map((k) => k.v || k.k);
    const out = vals[0].map((_, i) => vals.reduce((s, v, j) => s + w[j] * v[i], 0));
    return { scores: scores, w: w, out: out };
  }

  function heatCell(w) {
    const dark = w > 0.55;
    return '<td class="cell" style="background: rgba(var(--heat), ' + (0.06 + 0.94 * w).toFixed(3) + ');' +
      (dark ? " color: var(--paper);" : "") + '">' + w.toFixed(2) + "</td>";
  }

  document.querySelectorAll(".attn-lab").forEach(function (lab) {
    const src = lab.querySelector('script[type="application/json"]');
    if (!src) return;
    const cfg = JSON.parse(src.textContent);
    const qn = cfg.queryName || "q";
    const on = cfg.outName || "out";
    const d = cfg.queries[0].q.length;

    lab.insertAdjacentHTML("beforeend",
      '<div class="lab-title">' + esc(lab.dataset.title || "Attention lab") + "</div>" +
      '<div class="presets"></div>' +
      '<div class="qrow"></div>' +
      '<div class="table-scroll"><table><thead><tr>' +
      "<th>Token</th><th>Key k</th><th>Score " + qn + "·k" + (cfg.scale ? " / √" + d : "") + "</th>" +
      "<th>Weight</th><th class=\"bar-cell\"></th>" + (cfg.showValues ? "<th>Value v</th>" : "") +
      "</tr></thead><tbody></tbody></table></div>" +
      '<div class="out"></div>' +
      '<div class="steps">Steps: score each key against the query → softmax turns scores into weights that sum to 1 → the output is the weighted sum of the values. Edit the query numbers to see the weights move.</div>');

    const presets = lab.querySelector(".presets");
    const qrow = lab.querySelector(".qrow");
    const tbody = lab.querySelector("tbody");
    const outEl = lab.querySelector(".out");

    // Editable query inputs
    qrow.insertAdjacentHTML("beforeend", "<span><b>" + esc(qn) + "</b> =</span>");
    const inputs = [];
    for (let i = 0; i < d; i++) {
      const lbl = document.createElement("label");
      lbl.className = "small muted";
      lbl.style.display = "inline-flex";
      lbl.style.flexDirection = "column";
      const inp = document.createElement("input");
      inp.type = "number";
      inp.step = "0.1";
      inp.addEventListener("input", render);
      inputs.push(inp);
      lbl.appendChild(inp);
      if (cfg.dims) lbl.appendChild(document.createTextNode(cfg.dims[i]));
      qrow.appendChild(lbl);
    }

    let activeBtn = null;
    cfg.queries.forEach(function (qq, qi) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "btn";
      b.innerHTML = esc(qq.label);
      b.setAttribute("dir", "auto");
      b.addEventListener("click", function () { load(qi, b); });
      presets.appendChild(b);
      if (qi === 0) activeBtn = b;
    });

    function load(qi, btn) {
      cfg.queries[qi].q.forEach((x, i) => (inputs[i].value = x));
      if (activeBtn) activeBtn.classList.remove("selected");
      activeBtn = btn;
      btn.classList.add("selected");
      render();
    }

    function render() {
      const q = inputs.map((i) => parseFloat(i.value) || 0);
      const r = attend(cfg, q);
      tbody.innerHTML = cfg.keys.map(function (k, j) {
        return "<tr><td dir=\"auto\"><b>" + esc(k.label) + "</b></td><td class=\"mono\">" + vec(k.k) + "</td>" +
          "<td class=\"mono\">" + fmt(r.scores[j]) + "</td><td class=\"mono\">" + r.w[j].toFixed(2) + "</td>" +
          '<td class="bar-cell"><div class="bar" style="width:' + (r.w[j] * 100).toFixed(1) + '%"></div></td>' +
          (cfg.showValues ? "<td class=\"mono\">" + vec(k.v || k.k) + "</td>" : "") + "</tr>";
      }).join("");
      const top = r.w.indexOf(Math.max.apply(null, r.w));
      outEl.innerHTML = "<b>" + esc(on) + "</b> = Σ weight × value = <span class=\"mono\">" + vec(r.out) + "</span>" +
        ' <span class="muted">(dominated by <b dir="auto">' + esc(cfg.keys[top].label) + "</b>, weight " + r.w[top].toFixed(2) + ")</span>";
    }

    if (cfg.heatmap) {
      const hm = document.createElement("div");
      hm.innerHTML = '<div class="small muted" style="margin-top:1rem">All preset queries at once: each row is one query, and each row sums to 1.</div>';
      const rows = cfg.queries.map(function (qq) {
        const r = attend(cfg, qq.q);
        return '<tr><th class="rowh" dir="auto">' + esc(qq.label) + "</th>" + r.w.map(heatCell).join("") + "</tr>";
      }).join("");
      hm.innerHTML += '<div class="table-scroll"><table class="heatmap"><tr><th></th>' +
        cfg.keys.map((k) => '<th dir="auto">' + esc(k.label) + "</th>").join("") + "</tr>" + rows + "</table></div>";
      lab.appendChild(hm);
    }

    load(0, presets.firstChild);
  });
})();
