(function () {
  "use strict";

  window.BATSLOP_DEFAULTS = {
    subreddits: [
      "programming", "webdev", "sideproject", "learnprogramming",
      "buildinpublic", "SaaS", "coding", "javascript", "python",
      "react", "node", "frontend", "web_design", "IndieHackers",
      "startups", "csharp", "dotnet", "golang", "rust", "cpp",
      "java", "typescript", "nextjs", "svelte", "vue", "angular",
      "devops", "machinelearning", "artificial", "ChatGPT",
      "LocalLLaMA", "singularity", "computerscience",
      "coolgithubprojects", "tui", "TechImpact"
    ],
    replacements: [
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
    ]
  };
})();
