---
layout: page
title: Explore Quality Scenario Space
permalink: /explore-scenarios/
order: 23
---

{% assign model = site.data.semantic_quality_model %}

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
      <h2>Which part of scenario space is already constrained?</h2>
      <p>A Characteristic is an entry point into a recurring family of scenarios. These coordinates define its current semantic boundary.</p>
    </div>
  </div>
  <div class="semantic-quality-panel__grid" id="scenario-space-defined"></div>

  <div class="semantic-step">
    <div class="semantic-step__number">2</div>
    <div>
      <p class="semantic-step__eyebrow">Refine the space</p>
      <h2>Where do you want to go from here?</h2>
      <p>Choose another semantic constraint or follow a typed relation. This narrows, intersects, or shifts the scenario family rather than ending at the term definition.</p>
    </div>
  </div>
  <div class="semantic-results" id="scenario-space-relations"></div>

  <div class="semantic-step">
    <div class="semantic-step__number">3</div>
    <div>
      <p class="semantic-step__eyebrow">Concrete scenarios</p>
      <h2>Which existing requirements instantiate this space?</h2>
      <p>Requirements provide bottom-up evidence for the scenario family and concrete acceptance criteria.</p>
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
<script defer src="{{ '/assets/js/scenario-space-explorer.js' | prepend: site.baseurl }}"></script>
