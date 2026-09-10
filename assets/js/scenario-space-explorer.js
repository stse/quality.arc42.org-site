(() => {
  const root = document.getElementById("semantic-scenario-explorer");
  const modelNode = document.getElementById("semantic-quality-model");
  const axesNode = document.getElementById("semantic-scenario-axes");
  if (!root || !modelNode || !axesNode) return;

  const model = JSON.parse(modelNode.textContent || "{}");
  const scenarioAxes = JSON.parse(axesNode.textContent || "{}");
  const params = new URLSearchParams(window.location.search);
  const qualityId = params.get("quality") || "evolvability";
  const quality = model.qualities?.[qualityId];
  if (!quality) {
    root.innerHTML = `<p>Unknown semantic quality concept: <code>${qualityId}</code></p>`;
    return;
  }

  const byId = (id) => document.getElementById(id);
  const list = (v) => Array.isArray(v) ? v : [];

  byId("scenario-space-title").textContent = `${quality.title}: explore its scenario space`;
  byId("scenario-space-question").textContent = quality.question || "";
  byId("scenario-space-anchor-title").textContent = quality.kind === "characteristic" ? "Characteristic" : "Quality concept";

  const anchor = byId("scenario-space-anchor");
  const anchorParts = [quality.title, ...list(quality.dimensions).map((d) => `#${d}`)];
  anchor.innerHTML = anchorParts.map((p) => `<span class="semantic-path__chip semantic-path__chip--static">${p}</span>`).join('<span class="semantic-path__arrow">→</span>');

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
      ? `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`
      : `<p class="scenario-axis-card__open">Not constrained by ${quality.title}.</p>`;
    const note = axisConfig?.note ? `<p class="scenario-axis-card__note">${axisConfig.note}</p>` : "";

    return `<article class="scenario-axis-card scenario-axis-card--${mode}">
      <div class="scenario-axis-card__heading">
        <strong>${titles[axisName] || axisName}</strong>
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

  function relationCard(relation) {
    const target = model.qualities?.[relation.target];
    if (!target) return "";
    const href = `/explore-scenarios/?quality=${encodeURIComponent(relation.target)}`;
    const semantics = [
      ...labels(target.stimuli, model.stimuli),
      ...labels(target.responses, model.responses),
      ...list(target.measures).map((id) => model.measures?.[id]?.label || id),
    ];
    return `<article class="semantic-card semantic-card--${target.kind || "concept"}">
      <div class="semantic-card__topline"><span class="semantic-card__kind">${relation.type}</span></div>
      <h3><a href="${href}">${target.title}</a></h3>
      <p class="semantic-card__question">${target.question || ""}</p>
      <p class="semantic-card__relations">${semantics.slice(0, 4).join(" · ")}</p>
      <p class="semantic-card__actions"><a href="${href}">Enter this scenario space →</a></p>
    </article>`;
  }

  const relations = byId("scenario-space-relations");
  relations.innerHTML = list(quality.relations).map(relationCard).join("") || `<article class="semantic-card"><p>No typed refinements are modeled yet.</p></article>`;

  const requirements = byId("scenario-space-requirements");
  requirements.innerHTML = list(quality.requirements).map((id) => {
    const req = model.requirements?.[id];
    if (!req) return "";
    return `<article class="semantic-card"><div class="semantic-card__topline"><span class="semantic-card__kind">Requirement</span></div><h3><a href="${req.page}">${req.title}</a></h3><p class="semantic-card__actions"><a href="${req.page}">Open concrete scenario →</a></p></article>`;
  }).join("") || `<article class="semantic-card"><p>No concrete prototype requirements are linked yet.</p></article>`;

  const approaches = byId("scenario-space-approaches");
  approaches.innerHTML = list(quality.approaches).map((id) => {
    const approach = model.approaches?.[id];
    if (!approach) return "";
    return `<article class="semantic-card"><div class="semantic-card__topline"><span class="semantic-card__kind">Approach</span></div><h3><a href="${approach.page}">${approach.title}</a></h3><p class="semantic-card__actions"><a href="${approach.page}">Inspect architectural mechanism →</a></p></article>`;
  }).join("") || `<article class="semantic-card"><p>No prototype approaches are linked yet.</p></article>`;
})();
