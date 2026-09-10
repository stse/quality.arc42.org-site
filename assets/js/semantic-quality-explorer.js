(() => {
  const root = document.getElementById("semantic-explorer");
  const modelNode = document.getElementById("semantic-quality-model");
  if (!root || !modelNode) return;

  const model = JSON.parse(modelNode.textContent || "{}");
  const qualities = Object.entries(model.qualities || {}).map(([id, q]) => ({ id, ...q }));
  const state = { dimensions: new Set(), stimuli: new Set(), responses: new Set(), measures: new Set() };
  const axisOrder = ["dimensions", "stimuli", "responses", "measures"];
  let activeStage = "dimensions";

  const byId = (id) => document.getElementById(id);
  const text = (value) => String(value || "").toLowerCase();
  const list = (value) => Array.isArray(value) ? value : [];

  function modeSwitch() {
    root.querySelectorAll("[data-semantic-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        root.querySelectorAll("[data-semantic-mode]").forEach((b) => b.classList.toggle("is-active", b === button));
        root.querySelectorAll("[data-semantic-view]").forEach((view) => {
          view.classList.toggle("is-active", view.dataset.semanticView === button.dataset.semanticMode);
        });
      });
    });
  }

  function setStage(axis) {
    if (!axisOrder.includes(axis)) return;
    activeStage = axis;
    root.querySelectorAll("[data-semantic-stage]").forEach((stage) => {
      stage.classList.toggle("is-active", stage.dataset.semanticStage === axis);
    });
    root.querySelectorAll("[data-journey-axis]").forEach((node) => {
      node.classList.toggle("is-active", node.dataset.journeyAxis === axis);
    });
    root.querySelector("[data-semantic-results]")?.classList.remove("is-active");
  }

  function showResultsStage() {
    root.querySelectorAll("[data-semantic-stage]").forEach((stage) => stage.classList.remove("is-active"));
    root.querySelectorAll("[data-journey-axis]").forEach((node) => node.classList.remove("is-active"));
    root.querySelector("[data-semantic-results]")?.classList.add("is-active");
    root.querySelector("[data-journey-results]")?.classList.add("is-active");
  }

  function setupJourney() {
    root.querySelectorAll("[data-journey-axis]").forEach((node) => {
      node.addEventListener("click", () => setStage(node.dataset.journeyAxis));
    });
    root.querySelector("[data-journey-results]")?.addEventListener("click", showResultsStage);
  }

  function collectionForAxis(axis) {
    return model[axis] || {};
  }

  function selectedLabel(axis, id) {
    return collectionForAxis(axis)[id]?.label || id;
  }

  function updateJourney() {
    const firstIncomplete = axisOrder.find((axis) => state[axis].size === 0);
    const completedCount = axisOrder.filter((axis) => state[axis].size > 0).length;

    root.querySelectorAll("[data-journey-axis]").forEach((node) => {
      const axis = node.dataset.journeyAxis;
      node.classList.toggle("is-complete", state[axis].size > 0);
      node.classList.toggle("is-active", activeStage === axis && !root.querySelector("[data-semantic-results]")?.classList.contains("is-active"));
    });

    const resultNode = root.querySelector("[data-journey-results]");
    resultNode?.classList.toggle("is-complete", completedCount > 0);

    const trail = byId("semantic-path-trail");
    const title = byId("semantic-path-title");
    if (trail) {
      trail.innerHTML = "";
      const selectedEntries = [];
      axisOrder.forEach((axis) => {
        state[axis].forEach((id) => selectedEntries.push({ axis, id, label: selectedLabel(axis, id) }));
      });
      if (selectedEntries.length === 0) {
        const empty = document.createElement("span");
        empty.className = "semantic-path__empty";
        empty.textContent = "No semantic constraints selected yet.";
        trail.appendChild(empty);
      } else {
        selectedEntries.forEach((entry, index) => {
          if (index > 0) {
            const arrow = document.createElement("span");
            arrow.className = "semantic-path__arrow";
            arrow.textContent = "→";
            trail.appendChild(arrow);
          }
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "semantic-path__chip";
          chip.textContent = entry.label;
          chip.title = "Jump to this step";
          chip.addEventListener("click", () => setStage(entry.axis));
          trail.appendChild(chip);
        });
      }
    }

    if (title) {
      if (completedCount === 0) title.textContent = "Start with any quality intent.";
      else if (firstIncomplete) title.textContent = `Next: ${axisTitle(firstIncomplete)}`;
      else title.textContent = "The semantic path is fully constrained. Review the matching concepts.";
    }
  }

  function axisTitle(axis) {
    return ({ dimensions: "Quality intent", stimuli: "Situation", responses: "Desired response", measures: "Evaluation" })[axis] || axis;
  }

  function choice(containerId, collection, axis) {
    const container = byId(containerId);
    if (!container) return;
    Object.entries(collection || {}).forEach(([id, item]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "semantic-choice";
      button.dataset.id = id;
      button.innerHTML = `<strong>${item.label || id}</strong><span>${item.question || ""}</span>`;
      button.addEventListener("click", () => {
        if (state[axis].has(id)) state[axis].delete(id); else state[axis].add(id);
        button.classList.toggle("is-selected", state[axis].has(id));
        renderGuided();
        updateJourney();
      });
      container.appendChild(button);
    });
  }

  function qualityScore(q) {
    let score = 0;
    let selected = 0;
    for (const [axis, chosen] of Object.entries(state)) {
      if (chosen.size === 0) continue;
      selected += chosen.size;
      const values = new Set(list(q[axis]));
      for (const id of chosen) if (values.has(id)) score += 1;
    }
    return { score, selected };
  }

  function renderCard(q, scoreLabel = "") {
    const card = document.createElement("article");
    card.className = `semantic-card semantic-card--${q.kind || "concept"}`;
    const dims = list(q.dimensions).map((d) => `<span>#${d}</span>`).join("");
    const rels = list(q.relations).slice(0, 4).map((r) => `${r.type} → ${r.target}`).join(" · ");
    const title = q.page ? `<a href="${q.page}">${q.title}</a>` : q.title;
    card.innerHTML = `
      <div class="semantic-card__topline">
        <span class="semantic-card__kind">${q.kind === "characteristic" ? "Characteristic" : "Quality concept"}</span>
        ${scoreLabel ? `<span class="semantic-card__score">${scoreLabel}</span>` : ""}
      </div>
      <h3>${title}</h3>
      <p class="semantic-card__question">${q.question || ""}</p>
      <div class="semantic-card__dimensions">${dims}</div>
      ${rels ? `<p class="semantic-card__relations">${rels}</p>` : ""}
    `;
    return card;
  }

  function renderGuided() {
    const container = byId("semantic-guided-results");
    const summary = byId("semantic-guided-summary");
    if (!container || !summary) return;
    container.innerHTML = "";

    const ranked = qualities
      .map((q) => ({ q, ...qualityScore(q) }))
      .filter((x) => x.selected === 0 || x.score > 0)
      .sort((a, b) => b.score - a.score || (b.q.kind === "characteristic") - (a.q.kind === "characteristic") || a.q.title.localeCompare(b.q.title));

    const active = Object.values(state).reduce((n, set) => n + set.size, 0);
    summary.textContent = active
      ? `${ranked.length} concepts match at least one selected semantic constraint. Stronger matches are shown first.`
      : "Choose any combination along the path. The explorer ranks matching characteristics and specializations.";

    ranked.forEach(({ q, score, selected }) => container.appendChild(renderCard(q, active ? `${score}/${selected} matches` : "")));
  }

  function resetGuided() {
    Object.values(state).forEach((set) => set.clear());
    root.querySelectorAll(".semantic-choice.is-selected").forEach((el) => el.classList.remove("is-selected"));
    setStage("dimensions");
    renderGuided();
    updateJourney();
  }

  function facetGroup(title, axis, collection) {
    const section = document.createElement("section");
    section.className = "semantic-facet";
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.appendChild(heading);
    Object.entries(collection || {}).forEach(([id, item]) => {
      const label = document.createElement("label");
      label.className = "semantic-facet__item";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.dataset.axis = axis;
      input.value = id;
      input.addEventListener("change", renderFacets);
      label.append(input, document.createTextNode(` ${item.label || id}`));
      section.appendChild(label);
    });
    return section;
  }

  function setupFacets() {
    const facets = byId("semantic-facets");
    if (!facets) return;
    facets.append(
      facetGroup("Dimension", "dimensions", model.dimensions),
      facetGroup("Stimulus", "stimuli", model.stimuli),
      facetGroup("Response", "responses", model.responses),
      facetGroup("Measure", "measures", model.measures),
    );
    byId("semantic-search")?.addEventListener("input", renderFacets);
  }

  function renderFacets() {
    const query = text(byId("semantic-search")?.value).trim();
    const checked = {};
    root.querySelectorAll(".semantic-facet input:checked").forEach((input) => {
      (checked[input.dataset.axis] ||= new Set()).add(input.value);
    });

    const matchesAxis = (q, axis, selected) => {
      if (!selected || selected.size === 0) return true;
      const values = new Set(list(q[axis]));
      return [...selected].some((id) => values.has(id));
    };

    const results = qualities.filter((q) => {
      const haystack = [q.title, q.question, q.kind, q.status, ...list(q.dimensions), ...list(q.stimuli), ...list(q.responses), ...list(q.measures)].map(text).join(" ");
      if (query && !haystack.includes(query)) return false;
      return Object.entries(checked).every(([axis, selected]) => matchesAxis(q, axis, selected));
    });

    const container = byId("semantic-facet-results");
    const summary = byId("semantic-facet-summary");
    if (!container || !summary) return;
    container.innerHTML = "";
    summary.textContent = `${results.length} of ${qualities.length} semantic concepts visible.`;
    results.sort((a, b) => (b.kind === "characteristic") - (a.kind === "characteristic") || a.title.localeCompare(b.title));
    results.forEach((q) => container.appendChild(renderCard(q)));
  }

  function resetFacets() {
    const search = byId("semantic-search");
    if (search) search.value = "";
    root.querySelectorAll(".semantic-facet input:checked").forEach((input) => { input.checked = false; });
    renderFacets();
  }

  function renderConceptIndex() {
    const container = byId("semantic-concept-results");
    if (!container) return;
    qualities
      .slice()
      .sort((a, b) => (b.kind === "characteristic") - (a.kind === "characteristic") || a.title.localeCompare(b.title))
      .forEach((q) => container.appendChild(renderCard(q)));
  }

  modeSwitch();
  setupJourney();
  choice("semantic-dimensions", model.dimensions, "dimensions");
  choice("semantic-stimuli", model.stimuli, "stimuli");
  choice("semantic-responses", model.responses, "responses");
  choice("semantic-measures", model.measures, "measures");
  setupFacets();
  byId("semantic-reset")?.addEventListener("click", resetGuided);
  byId("semantic-facet-reset")?.addEventListener("click", resetFacets);
  renderGuided();
  renderFacets();
  renderConceptIndex();
  updateJourney();
})();
