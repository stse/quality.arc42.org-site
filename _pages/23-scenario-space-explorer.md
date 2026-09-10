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
    <p class="semantic-explorer__eyebrow">Prototype · characteristic as entry into scenario space</p>
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
  </section>

  <div class="semantic-step">
    <div class="semantic-step__number">1</div>
    <div>
      <p class="semantic-step__eyebrow">Defined by this characteristic</p>
      <h2>Which coordinates of scenario space are constrained?</h2>
      <p>A Characteristic defines a recurring family of scenarios by constraining some coordinates while intentionally leaving others open for later specialization or concrete requirements.</p>
    </div>
  </div>
  <div class="scenario-axis-grid" id="scenario-space-axes"></div>

  <div class="scenario-space-legend" aria-label="Scenario space legend">
    <span><i class="scenario-axis-state scenario-axis-state--constrained"></i> Constrained by the quality concept</span>
    <span><i class="scenario-axis-state scenario-axis-state--open"></i> Open across this characteristic</span>
  </div>

  <div class="semantic-step">
    <div class="semantic-step__number">2</div>
    <div>
      <p class="semantic-step__eyebrow">Refine the space</p>
      <h2>What changes when you follow an edge?</h2>
      <p>Each typed relation explains its semantic delta: which scenario coordinate is narrowed, shifted, opened, or given another evaluation lens.</p>
    </div>
  </div>
  <div class="semantic-results" id="scenario-space-relations"></div>

  <div class="semantic-step">
    <div class="semantic-step__number">3</div>
    <div>
      <p class="semantic-step__eyebrow">Concrete scenarios</p>
      <h2>How do requirements close the remaining space?</h2>
      <p>A Requirement instantiates the family by supplying concrete source, subject, context and stimulus details, then turns abstract evaluation preferences into acceptance thresholds.</p>
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
