---
layout: page
title: Explore Quality Problems
permalink: /explore-quality/
order: 22
---

{% assign model = site.data.semantic_quality_model %}

<div class="semantic-explorer" id="semantic-explorer">
  <header class="semantic-explorer__intro">
    <p class="semantic-explorer__eyebrow">Prototype · semantic Q42 graph</p>
    <h1>Start with the quality problem, not the vocabulary.</h1>
    <p>
      Q42 already models quality as an overlapping graph. This prototype adds
      explicit semantics to selected nodes so the same graph can be entered
      top-down, searched by facets, or traversed bottom-up from concrete concepts.
    </p>
  </header>

  <nav class="semantic-explorer__modes" aria-label="Explorer mode">
    <button type="button" class="semantic-mode is-active" data-semantic-mode="guided">Guided questions</button>
    <button type="button" class="semantic-mode" data-semantic-mode="facets">Search &amp; facets</button>
    <button type="button" class="semantic-mode" data-semantic-mode="concepts">Concept index</button>
  </nav>

  <section class="semantic-view is-active" data-semantic-view="guided">
    <div class="semantic-step">
      <div class="semantic-step__number">1</div>
      <div>
        <h2>Why does this quality concern matter?</h2>
        <p>Choose one or more broad stakeholder intents. Dimensions remain overlapping entry perspectives, not exclusive parents.</p>
      </div>
    </div>
    <div class="semantic-choice-grid" id="semantic-dimensions"></div>

    <div class="semantic-step">
      <div class="semantic-step__number">2</div>
      <div>
        <h2>What situation makes the concern relevant?</h2>
        <p>Select the kind of stimulus that best describes the problem.</p>
      </div>
    </div>
    <div class="semantic-choice-grid" id="semantic-stimuli"></div>

    <div class="semantic-step">
      <div class="semantic-step__number">3</div>
      <div>
        <h2>What should the system enable?</h2>
        <p>The desired response narrows the quality problem without forcing a taxonomy.</p>
      </div>
    </div>
    <div class="semantic-choice-grid" id="semantic-responses"></div>

    <div class="semantic-step">
      <div class="semantic-step__number">4</div>
      <div>
        <h2>What distinguishes better from worse?</h2>
        <p>Measures add an evaluation axis. A concrete threshold belongs to a requirement, not to the abstract characteristic.</p>
      </div>
    </div>
    <div class="semantic-choice-grid" id="semantic-measures"></div>

    <div class="semantic-results-head">
      <div>
        <h2>Matching quality concepts</h2>
        <p id="semantic-guided-summary">Choose any combination above. The explorer ranks matching characteristics and specializations.</p>
      </div>
      <button type="button" class="semantic-reset" id="semantic-reset">Reset</button>
    </div>
    <div class="semantic-results" id="semantic-guided-results"></div>
  </section>

  <section class="semantic-view" data-semantic-view="facets">
    <div class="semantic-searchbar">
      <label for="semantic-search">Search the semantic vocabulary</label>
      <input id="semantic-search" type="search" placeholder="e.g. change, uncertainty, time, transfer, integration…" autocomplete="off" />
    </div>
    <div class="semantic-facet-layout">
      <aside class="semantic-facets" id="semantic-facets"></aside>
      <div>
        <div class="semantic-results-head">
          <div>
            <h2>Results</h2>
            <p id="semantic-facet-summary"></p>
          </div>
          <button type="button" class="semantic-reset" id="semantic-facet-reset">Reset filters</button>
        </div>
        <div class="semantic-results" id="semantic-facet-results"></div>
      </div>
    </div>
  </section>

  <section class="semantic-view" data-semantic-view="concepts">
    <div class="semantic-results-head">
      <div>
        <h2>Prototype concept index</h2>
        <p>Primary characteristics and useful specializations share one graph but have different navigation roles.</p>
      </div>
    </div>
    <div class="semantic-results" id="semantic-concept-results"></div>
  </section>
</div>

<script id="semantic-quality-model" type="application/json">
{{ model | jsonify }}
</script>
<script defer src="{{ '/assets/js/semantic-quality-explorer.js' | prepend: site.baseurl }}"></script>
