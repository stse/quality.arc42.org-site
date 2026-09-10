---
layout: page
title: Explore Quality Problems
permalink: /explore-quality/
order: 22
---

{% assign model = site.data.semantic_quality_model %}
{% assign stakeholder_needs = site.data.semantic_stakeholder_needs %}

<div class="semantic-explorer" id="semantic-explorer">
  <header class="semantic-explorer__intro">
    <p class="semantic-explorer__eyebrow">Prototype · semantic Q42 graph</p>
    <h1>Start with the concern, not the quality vocabulary.</h1>
    <p>
      Describe what matters to a stakeholder first. Q42 dimensions remain useful
      overlapping perspectives, but they are derived navigation context rather than
      the first question a stakeholder has to understand.
    </p>
  </header>

  <nav class="semantic-explorer__modes" aria-label="Explorer mode">
    <button type="button" class="semantic-mode is-active" data-semantic-mode="guided">Guided questions</button>
    <button type="button" class="semantic-mode" data-semantic-mode="facets">Search &amp; facets</button>
    <button type="button" class="semantic-mode" data-semantic-mode="concepts">Concept index</button>
  </nav>

  <section class="semantic-view is-active" data-semantic-view="guided">
    <div class="semantic-journey" aria-label="Quality exploration path">
      <button type="button" class="semantic-journey__node is-active" data-journey-axis="needs"><span class="semantic-journey__number">1</span><span><strong>Stakeholder concern</strong><small>What are we worried about?</small></span></button>
      <span class="semantic-journey__connector" aria-hidden="true">→</span>
      <button type="button" class="semantic-journey__node" data-journey-axis="stimuli"><span class="semantic-journey__number">2</span><span><strong>Situation</strong><small>What makes it relevant?</small></span></button>
      <span class="semantic-journey__connector" aria-hidden="true">→</span>
      <button type="button" class="semantic-journey__node" data-journey-axis="responses"><span class="semantic-journey__number">3</span><span><strong>Desired response</strong><small>What should happen?</small></span></button>
      <span class="semantic-journey__connector" aria-hidden="true">→</span>
      <button type="button" class="semantic-journey__node" data-journey-axis="measures"><span class="semantic-journey__number">4</span><span><strong>Evaluation</strong><small>What means better?</small></span></button>
      <span class="semantic-journey__connector" aria-hidden="true">→</span>
      <button type="button" class="semantic-journey__node semantic-journey__node--result" data-journey-results><span class="semantic-journey__number">5</span><span><strong>Matches</strong><small>Which concepts fit?</small></span></button>
    </div>

    <div class="semantic-path" aria-live="polite">
      <div class="semantic-path__heading"><div><span class="semantic-path__eyebrow">Your path</span><strong id="semantic-path-title">Start with a stakeholder concern.</strong></div><button type="button" class="semantic-reset" id="semantic-reset">Reset path</button></div>
      <div class="semantic-path__trail" id="semantic-path-trail"><span class="semantic-path__empty">No semantic constraints selected yet.</span></div>
      <div class="semantic-path__derived" id="semantic-derived-dimensions" hidden></div>
    </div>

    <section class="semantic-stage is-active" id="semantic-stage-needs" data-semantic-stage="needs">
      <div class="semantic-step"><div class="semantic-step__number">1</div><div><p class="semantic-step__eyebrow">Stakeholder concern</p><h2>What are you trying to avoid or preserve?</h2><p>Start in stakeholder language. You do not need to know whether the concern is called Flexible, Maintainable, Reliable, or something else.</p></div></div>
      <div class="semantic-choice-grid" id="semantic-needs"></div>
    </section>

    <section class="semantic-stage" id="semantic-stage-stimuli" data-semantic-stage="stimuli">
      <div class="semantic-step"><div class="semantic-step__number">2</div><div><p class="semantic-step__eyebrow">Situation</p><h2>What situation makes the concern concrete?</h2><p>Choose the change, uncertainty, disturbance, lifecycle event, or interaction that triggers the quality concern.</p></div></div>
      <div class="semantic-choice-grid" id="semantic-stimuli"></div>
    </section>

    <section class="semantic-stage" id="semantic-stage-responses" data-semantic-stage="responses">
      <div class="semantic-step"><div class="semantic-step__number">3</div><div><p class="semantic-step__eyebrow">Desired response</p><h2>What should the system enable?</h2><p>Describe the capability expected from the architecture in that situation.</p></div></div>
      <div class="semantic-choice-grid" id="semantic-responses"></div>
    </section>

    <section class="semantic-stage" id="semantic-stage-measures" data-semantic-stage="measures">
      <div class="semantic-step"><div class="semantic-step__number">4</div><div><p class="semantic-step__eyebrow">Evaluation</p><h2>What distinguishes better from worse?</h2><p>Measures express the ordering. Concrete thresholds still belong to requirements.</p></div></div>
      <div class="semantic-choice-grid" id="semantic-measures"></div>
    </section>

    <section class="semantic-stage semantic-stage--results" id="semantic-stage-results" data-semantic-results>
      <div class="semantic-results-head"><div><p class="semantic-step__eyebrow">Matches</p><h2>Which quality concepts describe this concern?</h2><p id="semantic-guided-summary"></p></div></div>
      <div class="semantic-results" id="semantic-guided-results"></div>
    </section>
  </section>

  <section class="semantic-view" data-semantic-view="facets">
    <div class="semantic-searchbar"><label for="semantic-search">Search the semantic vocabulary</label><input id="semantic-search" type="search" placeholder="e.g. change, uncertainty, time, transfer, integration…" autocomplete="off" /></div>
    <div class="semantic-facet-layout"><aside class="semantic-facets" id="semantic-facets"></aside><div><div class="semantic-results-head"><div><h2>Results</h2><p id="semantic-facet-summary"></p></div><button type="button" class="semantic-reset" id="semantic-facet-reset">Reset filters</button></div><div class="semantic-results" id="semantic-facet-results"></div></div></div>
  </section>

  <section class="semantic-view" data-semantic-view="concepts"><div class="semantic-results-head"><div><h2>Prototype concept index</h2><p>Primary characteristics and useful specializations share one graph but have different navigation roles.</p></div></div><div class="semantic-results" id="semantic-concept-results"></div></section>
</div>

<script id="semantic-quality-model" type="application/json">{{ model | jsonify }}</script>
<script id="semantic-stakeholder-needs" type="application/json">{{ stakeholder_needs | jsonify }}</script>
<script defer src="{{ '/assets/js/semantic-quality-explorer.js' | prepend: site.baseurl }}"></script>
