(() => {
  const STORAGE_KEY = "q42-model-view";
  const CURRENT = "current";
  const SEMANTIC = "semantic";

  const normalize = (value) => value === SEMANTIC ? SEMANTIC : CURRENT;

  function getStoredMode() {
    try {
      return normalize(window.localStorage.getItem(STORAGE_KEY));
    } catch (_error) {
      return CURRENT;
    }
  }

  function storeMode(mode) {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (_error) {
      // Persistence is progressive enhancement only.
    }
  }

  function isQualitiesIndex(pathname) {
    return pathname === "/qualities/" || pathname.endsWith("/qualities/");
  }

  function isSemanticExplorer(pathname) {
    return pathname === "/explore-quality/" || pathname.endsWith("/explore-quality/");
  }

  function redirectForMode(mode) {
    const { pathname, hash } = window.location;

    if (mode === SEMANTIC && isQualitiesIndex(pathname)) {
      window.location.assign(`${window.baseurl || ""}/explore-quality/${hash || ""}`);
      return true;
    }

    if (mode === CURRENT && isSemanticExplorer(pathname)) {
      window.location.assign(`${window.baseurl || ""}/qualities/${hash || ""}`);
      return true;
    }

    return false;
  }

  function applyMode(mode, { persist = false, redirect = false } = {}) {
    mode = normalize(mode);

    if (persist) storeMode(mode);
    if (redirect && redirectForMode(mode)) return;

    document.documentElement.dataset.q42ModelView = mode;

    document.querySelectorAll("[data-q42-model-option]").forEach((button) => {
      const active = button.dataset.q42ModelOption === mode;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    document.querySelectorAll("[data-semantic-only]").forEach((element) => {
      element.hidden = mode !== SEMANTIC;
    });

    document.querySelectorAll("[data-current-only]").forEach((element) => {
      element.hidden = mode === SEMANTIC;
    });
  }

  function initialMode() {
    if (isSemanticExplorer(window.location.pathname)) return SEMANTIC;
    return getStoredMode();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const mode = initialMode();
    storeMode(mode);
    applyMode(mode);

    document.querySelectorAll("[data-q42-model-option]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextMode = normalize(button.dataset.q42ModelOption);
        applyMode(nextMode, { persist: true, redirect: true });
      });
    });
  });
})();
