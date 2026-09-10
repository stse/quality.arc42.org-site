(() => {
  const root = document.getElementById("semantic-scenario-explorer");
  const modelNode = document.getElementById("semantic-quality-model");
  const axesNode = document.getElementById("semantic-scenario-axes");
  const requirementNode = document.getElementById("semantic-requirement-spaces");
  if (!root || !modelNode || !axesNode || !requirementNode) return;

  const model = JSON.parse(modelNode.textContent || "{}");
  const scenarioAxes = JSON.parse(axesNode.textContent || "{}");
  const requirementSpaces = JSON.parse(requirementNode.textContent || "{}");
  const params = new URLSearchParams(window.location.search);
  const members = (params.get("space") || params.get("quality") || "evolvability")
    .split(",").map((x) => x.trim()).filter(Boolean);
  const qualities = members.map((id) => ({ id, ...(model.qualities?.[id] || {}) })).filter((q) => q.title);
  if (!qualities.length) {
    root.innerHTML = `<p>Unknown semantic quality space.</p>`;
    return;
  }

  const byId = (id) => document.getElementById(id);
  const list = (v) => Array.isArray(v) ? v : [];
  const unique = (xs) => [...new Set(xs)];
  const esc = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const isComposite = qualities.length > 1;
  const title = qualities.map((q) => q.title).join(" ∩ ");

  function axisCollection(axis) {
    return axis === "source" ? scenarioAxes.sources
      : axis === "subject" ? scenarioAxes.subjects
      : axis === "context" ? scenarioAxes.contexts
      : axis === "stimulus" ? model.stimuli
      : axis === "response" ? model.responses
      : axis === "evaluation" ? model.measures : {};
  }

  function label(axis, id) {
    const item = axisCollection(axis)?.[id] || {};
    if (axis === "evaluation") return `${item.label || id}${item.preference ? ` (${item.preference})` : ""}`;
    return item.label || id;
  }

  function spaceFor(id) {
    return scenarioAxes.quality_spaces?.[id] || {};
  }

  function intersectPredicateAxis(axis) {
    const configs = qualities.map((q) => spaceFor(q.id)?.[axis] || { mode: "open" });
    const constrained = configs.filter((c) => c.mode === "constrained");
    if (!constrained.length) return { mode: "open", values: [] };
    let values = list(constrained[0].values);
    for (const cfg of constrained.slice(1)) {
      const next = new Set(list(cfg.values));
      values = values.filter((v) => next.has(v));
    }
    if (constrained.length > 1 && values.length === 0) {
      return { mode: "conflict", values: [], note: "No direct intersection could be derived on this axis. The overlap needs a more specific semantic bridge or specialization." };
    }
    return { mode: "constrained", values };
  }

  function combineEvaluation() {
    const values = unique(qualities.flatMap((q) => list(spaceFor(q.id)?.evaluation?.values)));
    return { mode: values.length ? (qualities.length > 1 ? "combined" : "constrained") : "open", values };
  }

  function composedAxis(axis) {
    return axis === "evaluation" ? combineEvaluation() : intersectPredicateAxis(axis);
  }

  function queryFor(ids) {
    return `/explore-scenarios/?space=${encodeURIComponent(unique(ids).join(","))}`;
  }

  byId("scenario-space-eyebrow").textContent = isComposite
    ? "Prototype · ad hoc quality concept from graph intersection"
    : "Prototype · characteristic as entry into scenario space";
  byId("scenario-space-title").textContent = `${title}: explore its scenario space`;
  byId("scenario-space-question").textContent = isComposite
    ? `Ad hoc intersection of ${qualities.map((q) => q.title).join(" and ")}. This space can be explored without introducing a canonical Q42 name.`
    : qualities[0].question || "";
  byId("scenario-space-anchor-title").textContent = isComposite ? "Ad hoc quality concept" : (qualities[0].kind === "characteristic" ? "Characteristic" : "Quality concept");
  byId("scenario-space-boundary-description").textContent = isComposite
    ? "This temporary concept is computed by intersecting predicate-like scenario axes and combining compatible evaluation preferences. It can be refined further without becoming canonical vocabulary."
    : "A Characteristic defines a recurring family of scenarios by constraining some coordinates while intentionally leaving others open for later specialization or concrete requirements.";

  const anchor = byId("scenario-space-anchor");
  anchor.innerHTML = qualities.map((q) => `<span class="semantic-path__chip semantic-path__chip--static">${esc(q.title)}</span>`).join('<span class="semantic-path__arrow">∩</span>');
  const status = byId("scenario-composition-status");
  if (isComposite) {
    status.hidden = false;
    status.innerHTML = `<strong>Ad hoc concept:</strong> ${esc(title)}. It exists only in the explorer unless the scenario family later deserves a canonical name.`;
  }

  function renderAxisCard(axisName, axisConfig) {
    const mode = axisConfig?.mode || "open";
    const values = list(axisConfig?.values);
    const titles = { source:"Source", subject:"Subject / system", context:"Context", stimulus:"Stimulus", response:"Desired response", evaluation:"Evaluation" };
    const stateLabel = mode === "constrained" ? "Constrained" : mode === "combined" ? "Combined" : mode === "conflict" ? "Needs refinement" : "Open";
    let body;
    if (mode === "constrained" || mode === "combined") {
      body = `<ul>${values.map((id) => `<li>${esc(label(axisName, id))}</li>`).join("")}</ul>`;
    } else if (mode === "conflict") {
      body = `<p class="scenario-axis-card__open">No direct intersection derived yet.</p>`;
    } else {
      body = `<p class="scenario-axis-card__open">Not constrained by this quality space.</p>`;
    }
    const note = axisConfig?.note ? `<p class="scenario-axis-card__note">${esc(axisConfig.note)}</p>` : "";
    return `<article class="scenario-axis-card scenario-axis-card--${mode}"><div class="scenario-axis-card__heading"><strong>${esc(titles[axisName] || axisName)}</strong><span class="scenario-axis-card__state"><i class="scenario-axis-state scenario-axis-state--${mode}"></i>${stateLabel}</span></div>${body}${note}</article>`;
  }

  const axes = ["source","subject","context","stimulus","response","evaluation"];
  byId("scenario-space-axes").innerHTML = axes.map((axis) => renderAxisCard(axis, composedAxis(axis))).join("");

  function renderDelta(delta) {
    if (!delta) return "";
    const changes = list(delta.changes).map((change) => `<li><strong>${esc(change.axis)}</strong><span class="scenario-delta__operation">${esc(change.operation)}</span><span>${esc(change.from)}</span><span class="scenario-delta__arrow">→</span><span>${esc(change.to)}</span></li>`).join("");
    return `<div class="scenario-delta"><p class="scenario-delta__summary">${esc(delta.summary || "")}</p>${changes ? `<ul>${changes}</ul>` : ""}</div>`;
  }

  function allRelations() {
    const seen = new Set(); const out = [];
    for (const q of qualities) {
      for (const r of list(q.relations)) {
        if (members.includes(r.target)) continue;
        const key = `${q.id}:${r.type}:${r.target}`;
        if (!seen.has(key)) { seen.add(key); out.push({ ...r, from: q.id }); }
      }
    }
    return out;
  }

  function relationCard(relation) {
    const target = model.qualities?.[relation.target];
    if (!target) return "";
    const targetHref = queryFor([relation.target]);
    const composedHref = queryFor([...members, relation.target]);
    const delta = scenarioAxes.relation_deltas?.[relation.from]?.[relation.target];
    const canCompose = ["overlaps","specializes","specialized-by","complements"].includes(relation.type);
    const composeLabel = relation.type === "overlaps" ? "Explore overlap ∩" : "Compose with current space ∩";
    return `<article class="semantic-card semantic-card--${target.kind || "concept"}"><div class="semantic-card__topline"><span class="semantic-card__kind">${esc(relation.type)}</span></div><h3>${esc(target.title)}</h3><p class="semantic-card__question">${esc(target.question || "")}</p>${renderDelta(delta)}<div class="semantic-card__actions semantic-card__actions--split"><a href="${targetHref}">Enter target space →</a>${canCompose ? `<a class="semantic-compose-action" href="${composedHref}">${composeLabel}</a>` : ""}</div></article>`;
  }
  byId("scenario-space-relations").innerHTML = allRelations().map(relationCard).join("") || `<article class="semantic-card"><p>No typed refinements are modeled yet.</p></article>`;

  function requirementFits(req) {
    if (!req) return false;
    for (const axis of ["source","subject","context","stimulus","response"]) {
      const composed = composedAxis(axis);
      if (composed.mode !== "constrained" || !composed.values.length) continue;
      const rv = new Set(list(req[axis]?.values));
      if (rv.size && !composed.values.some((v) => rv.has(v))) return false;
    }

    // A requirement instantiating an intersection must satisfy the evaluation
    // family of every member, not merely one measure from their union.
    const measured = new Set(list(req.acceptance).map((a) => a.measure).filter(Boolean));
    for (const q of qualities) {
      const family = list(spaceFor(q.id)?.evaluation?.values);
      if (family.length && !family.some((measure) => measured.has(measure))) return false;
    }
    return true;
  }

  function renderRequirementClosure(req) {
    const closureRows = list(req.closes).map((c) => `<li><strong>${esc(c.axis)}</strong><span class="scenario-delta__operation">${esc(c.operation)}</span><span>${esc(c.from)}</span><span class="scenario-delta__arrow">→</span><span>${esc(c.to)}</span></li>`).join("");
    const acceptance = list(req.acceptance).map((a) => `<li><strong>${esc(a.label || a.measure)}</strong>: ${esc(a.operator)} ${esc(a.threshold)} ${esc(a.unit || "")}</li>`).join("");
    return `<div class="scenario-requirement-closure"><p class="scenario-delta__summary">Closes or narrows this scenario space:</p><ul class="scenario-delta__list">${closureRows}</ul>${acceptance ? `<div class="scenario-thresholds"><strong>Acceptance thresholds</strong><ul>${acceptance}</ul></div>` : ""}</div>`;
  }

  const reqEntries = Object.entries(requirementSpaces.requirements || {}).filter(([,req]) => requirementFits(req));
  byId("scenario-space-requirement-description").textContent = isComposite
    ? "Requirements below are tested against every member of the composed quality objective. An unnamed intersection can therefore be inspected like any named concept."
    : "A Requirement turns the family into a concrete scenario by supplying system-specific context, subject, source, measures and thresholds.";
  byId("scenario-space-requirements").innerHTML = reqEntries.map(([,req]) => `<article class="semantic-card semantic-card--requirement"><div class="semantic-card__topline"><span class="semantic-card__kind">Requirement</span></div><h3><a href="${esc(req.page)}">${esc(req.title)}</a></h3>${renderRequirementClosure(req)}<p class="semantic-card__actions"><a href="${esc(req.page)}">Open concrete scenario →</a></p></article>`).join("") || `<article class="semantic-card"><p>No modeled requirement currently instantiates this composed space. That empty intersection is itself useful information.</p></article>`;

  const approachIds = unique(qualities.flatMap((q) => list(q.approaches)));
  byId("scenario-space-approaches").innerHTML = approachIds.map((id) => {
    const approach = model.approaches?.[id];
    if (!approach) return "";
    return `<article class="semantic-card"><div class="semantic-card__topline"><span class="semantic-card__kind">Approach</span></div><h3><a href="${esc(approach.page)}">${esc(approach.title)}</a></h3><p class="semantic-card__actions"><a href="${esc(approach.page)}">Inspect architectural mechanism →</a></p></article>`;
  }).join("") || `<article class="semantic-card"><p>No prototype approaches are linked yet.</p></article>`;
})();
