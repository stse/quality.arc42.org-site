---
layout: page
title: Explore Quality Scenario Space
permalink: /explore-scenarios/
order: 23
---

{% assign model = site.data.semantic_quality_model %}
{% assign scenario_axes = site.data.semantic_scenario_axes %}
{% assign requirement_spaces = site.data.semantic_requirement_spaces %}

<div class="semantic-explorer semantic-scenario-explorer" id="semantic-scenario-explorer">
  <header class="semantic-explorer__intro">
    <p class="semantic-explorer__eyebrow" id="scenario-space-eyebrow">Prototype · characteristic as entry into scenario space</p>
    <h1 id="scenario-space-title">Explore a quality scenario space</h1>
    <p id="scenario-space-question"></p>
  </header>

  <section class="semantic-path semantic-space-anchor">
    <div class="semantic-path__heading">
      <div>
        <span class="semantic-path__eyebrow">Semantic anchor</span>
        <strong id="scenario-space-anchor-title"></strong>
      </div>
      <a href="{{ '/explore-quality/' | prepend: site.baseurl }}">← Quality explorer</a>
    </div>
    <div class="semantic-path__trail" id="scenario-space-anchor"></div>
    <div class="scenario-composition-status" id="scenario-composition-status" hidden></div>
  </section>

  <div class="semantic-step">
    <div class="semantic-step__number">1</div>
    <div>
      <p class="semantic-step__eyebrow">Defined by this concept</p>
      <h2>Which coordinates of scenario space are constrained?</h2>
      <p id="scenario-space-boundary-description">A Characteristic defines a recurring family of scenarios by constraining some coordinates while intentionally leaving others open for later specialization or concrete requirements.</p>
    </div>
  </div>
  <div class="scenario-axis-grid" id="scenario-space-axes"></div>

  <div class="scenario-space-legend" aria-label="Scenario space legend">
    <span><i class="scenario-axis-state scenario-axis-state--constrained"></i> Constrained</span>
    <span><i class="scenario-axis-state scenario-axis-state--open"></i> Open</span>
    <span><i class="scenario-axis-state scenario-axis-state--combined"></i> Combined evaluation</span>
    <span><i class="scenario-axis-state scenario-axis-state--conflict"></i> Needs semantic refinement</span>
  </div>

  <div class="semantic-step">
    <div class="semantic-step__number">2</div>
    <div>
      <p class="semantic-step__eyebrow">Navigate or compose</p>
      <h2>Where do you want to go from here?</h2>
      <p>There are two different operations. <strong>Enter target space</strong> navigates to another named concept. <strong>Explore overlap</strong> keeps the current space and intersects it with the target, creating an ad hoc concept even when Q42 has no name for that intersection.</p>
    </div>
  </div>
  <div class="semantic-results" id="scenario-space-relations"></div>

  <div class="semantic-step">
    <div class="semantic-step__number">3</div>
    <div>
      <p class="semantic-step__eyebrow">Concrete scenarios</p>
      <h2>Which existing requirements instantiate this space?</h2>
      <p id="scenario-space-requirement-description">A Requirement turns the family into a concrete scenario by supplying system-specific context, subject, source, measures and thresholds.</p>
    </div>
  </div>
  <div class="semantic-results" id="scenario-space-requirements"></div>

  <div class="semantic-step">
    <div class="semantic-step__number">4</div>
    <div>
      <p class="semantic-step__eyebrow">Architectural response</p>
      <h2>Which approaches can support this quality objective?</h2>
      <p>Approaches remain separate from qualities: they are candidate architectural mechanisms, not definitions of the quality.</p>
    </div>
  </div>
  <div class="semantic-results" id="scenario-space-approaches"></div>
</div>

<script id="semantic-quality-model" type="application/json">{{ model | jsonify }}</script>
<script id="semantic-scenario-axes" type="application/json">{{ scenario_axes | jsonify }}</script>
<script id="semantic-requirement-spaces" type="application/json">{{ requirement_spaces | jsonify }}</script>
<script defer src="{{ '/assets/js/scenario-space-explorer.js' | prepend: site.baseurl }}"></script>
