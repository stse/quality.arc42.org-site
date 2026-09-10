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
  const qualityId = params.get("quality") || "evolvability";
  const quality = model.qualities?.[qualityId];
  if (!quality) {
    root.innerHTML = `<p>Unknown semantic quality concept: <code>${qualityId}</code></p>`;
    return;
  }

  const byId = (id) => document.getElementById(id);
  const list = (v) => Array.isArray(v) ? v : [];
  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

  byId("scenario-space-title").textContent = `${quality.title}: explore its scenario space`;
  byId("scenario-space-question").textContent = quality.question || "";
  byId("scenario-space-anchor-title").textContent = quality.kind === "characteristic" ? "Characteristic" : "Quality concept";

  const anchor = byId("scenario-space-anchor");
  const anchorParts = [quality.title, ...list(quality.dimensions).map((d) => `#${d}`)];
  anchor.innerHTML = anchorParts.map((p) => `<span class="semantic-path__chip semantic-path__chip--static">${esc(p)}</span>`).join('<span class="semantic-path__arrow">→</span>');

  function labels(ids, collection, fallback) {
    return list(ids).map((id) => collection?.[id]?.label || fallback?.(id) || id);
  }

  function renderAxisCard(axisName, axisConfig) {
    const mode = axisConfig?.mode || "open";
    const values = list(axisConfig?.values);
    let items = [];
    if (axisName === "source") items = labels(values, scenarioAxes.sources);
    if (axisName === "subject") items = labels(values, scenarioAxes.subjects);
    if (axisName === "context") items = labels(values, scenarioAxes.contexts);
    if (axisName === "stimulus") items = labels(values, model.stimuli);
    if (axisName === "response") items = labels(values, model.responses);
    if (axisName === "evaluation") {
      items = values.map((id) => {
        const m = model.measures?.[id] || {};
        return `${m.label || id}${m.preference ? ` (${m.preference})` : ""}`;
      });
    }

    const titles = {
      source: "Source",
      subject: "Subject / system",
      context: "Context",
      stimulus: "Stimulus",
      response: "Desired response",
      evaluation: "Evaluation",
    };

    const stateLabel = mode === "constrained" ? "Constrained" : "Open";
    const body = mode === "constrained"
      ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
      : `<p class="scenario-axis-card__open">Not constrained by ${esc(quality.title)}.</p>`;
    const note = axisConfig?.note ? `<p class="scenario-axis-card__note">${esc(axisConfig.note)}</p>` : "";

    return `<article class="scenario-axis-card scenario-axis-card--${mode}">
      <div class="scenario-axis-card__heading">
        <strong>${esc(titles[axisName] || axisName)}</strong>
        <span class="scenario-axis-card__state"><i class="scenario-axis-state scenario-axis-state--${mode}"></i>${stateLabel}</span>
      </div>
      ${body}
      ${note}
    </article>`;
  }

  const axisSpace = scenarioAxes.quality_spaces?.[qualityId] || {};
  const axes = ["source", "subject", "context", "stimulus", "response", "evaluation"];
  const axisContainer = byId("scenario-space-axes");
  axisContainer.innerHTML = axes.map((axis) => renderAxisCard(axis, axisSpace[axis] || { mode: "open" })).join("");

  function renderDelta(delta) {
    if (!delta) return "";
    const changes = list(delta.changes).map((change) => `<li>
      <strong>${esc(change.axis)}</strong>
      <span class="scenario-delta__operation">${esc(change.operation)}</span>
      <span>${esc(change.from)}</span>
      <span class="scenario-delta__arrow">→</span>
      <span>${esc(change.to)}</span>
    </li>`).join("");
    return `<div class="scenario-delta">
      <p class="scenario-delta__summary">${esc(delta.summary || "")}</p>
      ${changes ? `<ul>${changes}</ul>` : ""}
    </div>`;
  }

  function relationCard(relation) {
    const target = model.qualities?.[relation.target];
    if (!target) return "";
    const href = `/explore-scenarios/?quality=${encodeURIComponent(relation.target)}`;
    const delta = scenarioAxes.relation_deltas?.[qualityId]?.[relation.target];
    return `<article class="semantic-card semantic-card--${target.kind || "concept"}">
      <div class="semantic-card__topline"><span class="semantic-card__kind">${esc(relation.type)}</span></div>
      <h3><a href="${href}">${esc(target.title)}</a></h3>
      <p class="semantic-card__question">${esc(target.question || "")}</p>
      ${renderDelta(delta)}
      <p class="semantic-card__actions"><a href="${href}">Enter this scenario space →</a></p>
    </article>`;
  }

  const relations = byId("scenario-space-relations");
  relations.innerHTML = list(quality.relations).map(relationCard).join("") || `<article class="semantic-card"><p>No typed refinements are modeled yet.</p></article>`;

  function renderRequirementClosure(req) {
    const closureRows = list(req.closes).map((c) => `<li>
      <strong>${esc(c.axis)}</strong>
      <span class="scenario-delta__operation">${esc(c.operation)}</span>
      <span>${esc(c.from)}</span>
      <span class="scenario-delta__arrow">→</span>
      <span>${esc(c.to)}</span>
    </li>`).join("");
    const acceptance = list(req.acceptance).map((a) => `<li><strong>${esc(a.label)}</strong>: ${esc(a.operator)} ${esc(a.threshold)} ${esc(a.unit || "")}</li>`).join("");
    return `<div class="scenario-requirement-closure">
      <p class="scenario-delta__summary">Closes or narrows the abstract scenario space:</p>
      <ul class="scenario-delta__list">${closureRows}</ul>
      ${acceptance ? `<div class="scenario-thresholds"><strong>Acceptance thresholds</strong><ul>${acceptance}</ul></div>` : ""}
    </div>`;
  }

  const requirements = byId("scenario-space-requirements");
  requirements.innerHTML = list(quality.requirements).map((id) => {
    const base = model.requirements?.[id];
    if (!base) return "";
    const req = requirementSpaces.requirements?.[id];
    return `<article class="semantic-card semantic-card--requirement">
      <div class="semantic-card__topline"><span class="semantic-card__kind">Requirement</span></div>
      <h3><a href="${esc(base.page)}">${esc(base.title)}</a></h3>
      ${req ? renderRequirementClosure(req) : `<p class="semantic-card__question">Concrete scenario metadata is not modeled yet.</p>`}
      <p class="semantic-card__actions"><a href="${esc(base.page)}">Open concrete scenario →</a></p>
    </article>`;
  }).join("") || `<article class="semantic-card"><p>No concrete prototype requirements are linked yet.</p></article>`;

  const approaches = byId("scenario-space-approaches");
  approaches.innerHTML = list(quality.approaches).map((id) => {
    const approach = model.approaches?.[id];
    if (!approach) return "";
    return `<article class="semantic-card"><div class="semantic-card__topline"><span class="semantic-card__kind">Approach</span></div><h3><a href="${esc(approach.page)}">${esc(approach.title)}</a></h3><p class="semantic-card__actions"><a href="${esc(approach.page)}">Inspect architectural mechanism →</a></p></article>`;
  }).join("") || `<article class="semantic-card"><p>No prototype approaches are linked yet.</p></article>`;
})();
