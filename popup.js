(function () {
  "use strict";

  const DEFAULT_SUBREDDITS = [
    "programming", "webdev", "sideproject", "learnprogramming",
    "buildinpublic", "SaaS", "coding", "javascript", "python",
    "react", "node", "frontend", "web_design", "IndieHackers",
    "startups", "csharp", "dotnet", "golang", "rust", "cpp",
    "java", "typescript", "nextjs", "svelte", "vue", "angular",
    "devops", "machinelearning", "artificial", "ChatGPT",
    "LocalLLaMA", "singularity", "computerscience", "coolgithubprojects", "tui", "TechImpact"
  ];

  const DEFAULT_REPLACEMENTS = [
    { from: "I built", to: "AI built" },
    { from: "I made", to: "AI made" },
    { from: "I programmed", to: "AI programmed" },
    { from: "I created", to: "AI created" },
    { from: "I developed", to: "AI developed" },
    { from: "I designed", to: "AI designed" },
    { from: "I coded", to: "AI coded" },
    { from: "I wrote", to: "AI wrote" },
    { from: "I launched", to: "AI launched" },
    { from: "I shipped", to: "AI shipped" },
    { from: "I finished", to: "AI finished" },
    { from: "I completed", to: "AI completed" },
    { from: "I released", to: "AI released" },
    { from: "I published", to: "AI published" },
    { from: "I deployed", to: "AI deployed" },
    { from: "I put together", to: "AI put together" },
    { from: "my project", to: "AI's project" },
    { from: "my app", to: "AI's app" },
    { from: "my tool", to: "AI's tool" },
    { from: "my site", to: "AI's site" },
    { from: "my website", to: "AI's website" }
  ];

  function getStorage() {
    if (typeof browser !== "undefined" && browser.storage) return browser.storage;
    if (typeof chrome !== "undefined" && chrome.storage) return chrome.storage;
    return null;
  }

  function storageGet(keys) {
    const storage = getStorage();
    if (!storage) return Promise.resolve({});

    try {
      const result = storage.sync.get(keys);
      if (result && typeof result.then === "function") return result;
    } catch (err) {
      // Chrome's callback API throws if called without a callback.
    }

    return new Promise((resolve) => {
      storage.sync.get(keys, (result) => resolve(result || {}));
    });
  }

  function storageSet(value) {
    const storage = getStorage();
    if (!storage) return Promise.resolve();

    try {
      const result = storage.sync.set(value);
      if (result && typeof result.then === "function") return result;
    } catch (err) {
      // Chrome's callback API throws if called without a callback.
    }

    return new Promise((resolve) => {
      storage.sync.set(value, resolve);
    });
  }

  let state = {
    subreddits: [...DEFAULT_SUBREDDITS],
    replacements: [...DEFAULT_REPLACEMENTS],
    enabled: true
  };

  function save() {
    storageSet(state);
  }

  function renderSubreddits() {
    const list = document.getElementById("subreddit-list");
    list.innerHTML = "";
    state.subreddits.forEach((sub, i) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.appendChild(document.createTextNode(`r/${sub} `));

      const remove = document.createElement("span");
      remove.className = "remove";
      remove.dataset.index = i;
      remove.textContent = "x";
      tag.appendChild(remove);

      list.appendChild(tag);
    });

    list.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.subreddits.splice(parseInt(btn.dataset.index), 1);
        save();
        renderSubreddits();
      });
    });
  }

  function renderReplacements() {
    const list = document.getElementById("replacement-list");
    list.innerHTML = "";
    state.replacements.forEach((r, i) => {
      const item = document.createElement("div");
      item.className = "replacement-item";

      const from = document.createElement("span");
      from.className = "from";
      from.textContent = r.from;

      const arrow = document.createElement("span");
      arrow.className = "arrow";
      arrow.textContent = "->";

      const to = document.createElement("span");
      to.className = "to";
      to.textContent = r.to;

      const remove = document.createElement("span");
      remove.className = "remove";
      remove.dataset.index = i;
      remove.textContent = "x";

      item.append(from, arrow, to, remove);
      list.appendChild(item);
    });

    list.querySelectorAll(".remove").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.replacements.splice(parseInt(btn.dataset.index), 1);
        save();
        renderReplacements();
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const storage = getStorage();
    if (!storage) return;

    storageGet(["subreddits", "replacements", "enabled"]).then((result) => {
      state.subreddits = result.subreddits || DEFAULT_SUBREDDITS;
      state.replacements = result.replacements || DEFAULT_REPLACEMENTS;
      state.enabled = result.enabled !== false;
      document.getElementById("enabled").checked = state.enabled;
      renderSubreddits();
      renderReplacements();
    });

    document.getElementById("enabled").addEventListener("change", (e) => {
      state.enabled = e.target.checked;
      save();
    });

    document.getElementById("add-sub").addEventListener("click", addSubreddit);
    document.getElementById("new-sub").addEventListener("keydown", (e) => {
      if (e.key === "Enter") addSubreddit();
    });

    document.getElementById("add-replacement").addEventListener("click", addReplacement);
    document.getElementById("new-to").addEventListener("keydown", (e) => {
      if (e.key === "Enter") addReplacement();
    });

    document.getElementById("reset").addEventListener("click", () => {
      state.subreddits = [...DEFAULT_SUBREDDITS];
      state.replacements = [...DEFAULT_REPLACEMENTS];
      state.enabled = true;
      document.getElementById("enabled").checked = true;
      save();
      renderSubreddits();
      renderReplacements();
    });
  });

  function addSubreddit() {
    const input = document.getElementById("new-sub");
    const val = input.value.trim().replace(/^r\//, "");
    if (!val) return;
    if (state.subreddits.some((s) => s.toLowerCase() === val.toLowerCase())) return;
    state.subreddits.push(val);
    save();
    renderSubreddits();
    input.value = "";
  }

  function addReplacement() {
    const fromInput = document.getElementById("new-from");
    const toInput = document.getElementById("new-to");
    const from = fromInput.value.trim();
    const to = toInput.value.trim();
    if (!from || !to) return;
    if (state.replacements.some((r) => r.from.toLowerCase() === from.toLowerCase())) return;
    state.replacements.push({ from, to });
    save();
    renderReplacements();
    fromInput.value = "";
    toInput.value = "";
  }
})();
