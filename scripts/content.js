(function () {
  "use strict";

  const DEFAULT_SUBREDDITS = [...window.BATSLOP_DEFAULTS.subreddits];
  const DEFAULT_REPLACEMENTS = window.BATSLOP_DEFAULTS.replacements.map((r) => ({ ...r }));

  const BATSLOP_ATTR = "data-batslop-processed";
  let slopImage = null;
  let config = null;

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

  function loadConfig() {
    return storageGet(["subreddits", "replacements", "enabled", "processAllReddit"]).then((result) => {
      return {
        subreddits: result.subreddits || DEFAULT_SUBREDDITS,
        replacements: result.replacements || DEFAULT_REPLACEMENTS,
        enabled: result.enabled !== false,
        processAllReddit: result.processAllReddit === true
      };
    });
  }

  function getSlopImageUrl() {
    if (typeof browser !== "undefined" && browser.runtime) {
      return browser.runtime.getURL("assets/batslopslap.png");
    }
    return chrome.runtime.getURL("assets/batslopslap.png");
  }

  function getCurrentSubreddit() {
    const match = window.location.pathname.match(/^\/r\/([^/]+)/i);
    return match ? match[1].toLowerCase() : null;
  }

  function isTargetSubreddit(sub) {
    if (config && config.processAllReddit) return true;
    if (!sub || !config) return false;
    return config.subreddits.some((s) => s.toLowerCase() === sub);
  }

  function replaceTitle(text) {
    let modified = text;
    for (const r of config.replacements) {
      const regex = new RegExp("\\b" + escapeRegex(r.from) + "\\b", "gi");
      modified = modified.replace(regex, (match) => {
        if (match === match.toUpperCase()) return r.to.toUpperCase();
        if (match === match.toLowerCase()) return r.to.toLowerCase();
        return r.to;
      });
    }
    return modified !== text ? modified : null;
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function replaceTextInElement(el) {
    let matched = false;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent || parent.closest("script, style, textarea, input")) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const replaced = replaceTitle(node.nodeValue);
      if (replaced) {
        node.nodeValue = replaced;
        matched = true;
      }
    });
    return matched;
  }

  function clearProcessedMarkers() {
    document.querySelectorAll(`[${BATSLOP_ATTR}]`).forEach((el) => {
      el.removeAttribute(BATSLOP_ATTR);
    });
  }

  // --- New Reddit (www.reddit.com) ---

  function processNewReddit() {
    // shreddit-post custom elements
    document.querySelectorAll(`shreddit-post:not([${BATSLOP_ATTR}])`).forEach(processShredditPost);

    // Fallback: article-based posts (some Reddit layouts)
    document.querySelectorAll(`article:not([${BATSLOP_ATTR}])`).forEach(processArticlePost);

    // Post detail page titles
    document.querySelectorAll(`h1:not([${BATSLOP_ATTR}])`).forEach((h1) => {
      processTextNode(h1);
    });
  }

  function processShredditPost(post) {
    post.setAttribute(BATSLOP_ATTR, "1");

    let matched = false;

    // Replace post-title attribute (used by shreddit internally)
    const titleAttr = post.getAttribute("post-title");
    if (titleAttr) {
      const newTitle = replaceTitle(titleAttr);
      if (newTitle) {
        post.setAttribute("post-title", newTitle);
        matched = true;
      }
    }

    // Replace visible title elements (one pass, mark each to avoid re-processing)
    // Exclude full-post-link overlay — setting textContent destroys screen-reader wrapper
    const titleEls = post.querySelectorAll(
      "a[slot='title'], [slot='title']:not([slot='full-post-link']), " +
      "a[id*='post-title']:not([slot='full-post-link']), h3, " +
      "[data-testid='post-title']"
    );
    titleEls.forEach((el) => {
      if (el.getAttribute(BATSLOP_ATTR)) return;
      if (el.closest("[slot='full-post-link']")) return;
      el.setAttribute(BATSLOP_ATTR, "1");
      if (replaceTextInElement(el)) matched = true;
    });

    if (matched) replaceThumbnail(post);
  }

  function processArticlePost(post) {
    post.setAttribute(BATSLOP_ATTR, "1");
    if (post.querySelector("shreddit-post")) return;
    const titleEls = post.querySelectorAll("h3, a[slot='title'], [data-testid='post-title']");
    let matched = false;
    titleEls.forEach((el) => {
      if (replaceTextInElement(el)) matched = true;
    });
    if (matched) replaceThumbnail(post);
  }

  function processTextNode(el) {
    if (el.getAttribute(BATSLOP_ATTR)) return;
    el.setAttribute(BATSLOP_ATTR, "1");
    replaceTextInElement(el);
  }

  // --- Old Reddit (old.reddit.com) ---

  function processOldReddit() {
    document.querySelectorAll(`.thing:not([${BATSLOP_ATTR}])`).forEach((thing) => {
      thing.setAttribute(BATSLOP_ATTR, "1");
      const titleLink = thing.querySelector("a.title");
      if (!titleLink) return;

      if (replaceTextInElement(titleLink)) {
        replaceThumbnailOld(thing);
      }
    });

    // Post detail page
    const postTitle = document.querySelector(`.top-matter a.title:not([${BATSLOP_ATTR}])`);
    if (postTitle) {
      postTitle.setAttribute(BATSLOP_ATTR, "1");
      replaceTextInElement(postTitle);
    }
  }

  // --- Thumbnail replacement ---

  function replaceThumbnail(postContainer) {
    // New Reddit thumbnails
    const imgs = postContainer.querySelectorAll(
      "img[src*='redd.it'], img[src*='thumbs.redditmedia'], img[src*='preview.redd.it'], " +
      "img[src*='external-preview'], img[alt='Post image'], img[class*='thumbnail'], " +
      "faceplate-img img, img[src*='i.redd.it']"
    );
    imgs.forEach((img) => {
      if (img.getAttribute(BATSLOP_ATTR)) return;
      img.setAttribute(BATSLOP_ATTR, "1");
      img.src = slopImage;
      img.srcset = "";
      img.style.objectFit = "contain";
    });

    // Also handle faceplate-img elements (new Reddit component)
    const faceplateImgs = postContainer.querySelectorAll("faceplate-img");
    faceplateImgs.forEach((fp) => {
      if (fp.getAttribute(BATSLOP_ATTR)) return;
      fp.setAttribute(BATSLOP_ATTR, "1");
      const inner = fp.querySelector("img");
      if (inner) {
        inner.src = slopImage;
        inner.srcset = "";
        inner.style.objectFit = "contain";
      }
    });

    // Handle background-image thumbnails
    const bgEls = postContainer.querySelectorAll("[style*='background-image']");
    bgEls.forEach((el) => {
      if (el.getAttribute(BATSLOP_ATTR)) return;
      el.setAttribute(BATSLOP_ATTR, "1");
      el.style.backgroundImage = `url('${slopImage}')`;
      el.style.backgroundSize = "contain";
      el.style.backgroundPosition = "center";
    });

    // Replace video players with slop image
    replaceVideos(postContainer);
  }

  function replaceVideos(container) {
    // Native <video> elements
    container.querySelectorAll("video").forEach((video) => {
      if (video.getAttribute(BATSLOP_ATTR)) return;
      video.setAttribute(BATSLOP_ATTR, "1");
      const img = document.createElement("img");
      img.src = slopImage;
      img.style.width = "100%";
      img.style.maxHeight = video.style.height || "512px";
      img.style.objectFit = "contain";
      img.style.backgroundColor = "#000";
      img.setAttribute(BATSLOP_ATTR, "1");
      video.pause();
      video.parentNode.replaceChild(img, video);
    });

    // shreddit-player (new Reddit video component)
    container.querySelectorAll("shreddit-player, shreddit-player-2").forEach((player) => {
      if (player.getAttribute(BATSLOP_ATTR)) return;
      player.setAttribute(BATSLOP_ATTR, "1");
      const img = document.createElement("img");
      img.src = slopImage;
      img.style.width = "100%";
      img.style.maxHeight = "512px";
      img.style.objectFit = "contain";
      img.style.backgroundColor = "#000";
      img.setAttribute(BATSLOP_ATTR, "1");
      player.replaceWith(img);
    });

    // Embedded iframes (YouTube, etc.)
    container.querySelectorAll("iframe[src*='youtube'], iframe[src*='youtu.be'], iframe[src*='redditmedia']").forEach((iframe) => {
      if (iframe.getAttribute(BATSLOP_ATTR)) return;
      iframe.setAttribute(BATSLOP_ATTR, "1");
      const img = document.createElement("img");
      img.src = slopImage;
      img.style.width = "100%";
      img.style.maxHeight = iframe.height || "512px";
      img.style.objectFit = "contain";
      img.style.backgroundColor = "#000";
      img.setAttribute(BATSLOP_ATTR, "1");
      iframe.replaceWith(img);
    });
  }

  function replaceThumbnailOld(thing) {
    const thumb = thing.querySelector("a.thumbnail img");
    if (thumb) {
      thumb.setAttribute(BATSLOP_ATTR, "1");
      thumb.src = slopImage;
      thumb.style.objectFit = "contain";
    }
    // Expanded image preview
    const preview = thing.querySelector(".expando img.preview");
    if (preview && !preview.getAttribute(BATSLOP_ATTR)) {
      preview.setAttribute(BATSLOP_ATTR, "1");
      preview.src = slopImage;
      preview.style.objectFit = "contain";
    }
    // Expanded video preview
    replaceVideos(thing);
  }

  // --- Main loop ---

  function isOldReddit() {
    return window.location.hostname === "old.reddit.com";
  }

  function processPage() {
    if (!config || !config.enabled) return;

    const sub = getCurrentSubreddit();
    // On non-subreddit pages (front page, r/all, r/popular), process if feed contains target subs
    // On subreddit pages, only process if it's a target sub
    if (sub && !isTargetSubreddit(sub)) return;

    if (isOldReddit()) {
      processOldReddit();
    } else {
      processNewReddit();
    }
  }

  // For front page / r/all / r/popular: check each post's subreddit individually
  function processPageWithSubredditCheck() {
    if (!config || !config.enabled) return;

    const sub = getCurrentSubreddit();
    if (sub && !isTargetSubreddit(sub) && sub !== "all" && sub !== "popular") return;

    if (!sub || sub === "all" || sub === "popular") {
      processPostsIndividually();
      return;
    }

    if (isOldReddit()) {
      processOldReddit();
    } else {
      processNewReddit();
    }
  }

  function processPostsIndividually() {
    if (isOldReddit()) {
      document.querySelectorAll(`.thing:not([${BATSLOP_ATTR}])`).forEach((thing) => {
        const subLink = thing.querySelector("a.subreddit");
        if (!subLink) return;
        const postSub = subLink.textContent.replace(/^r\//, "").toLowerCase();
        if (!isTargetSubreddit(postSub)) return;

        thing.setAttribute(BATSLOP_ATTR, "1");
        const titleLink = thing.querySelector("a.title");
        if (!titleLink) return;
        if (replaceTextInElement(titleLink)) {
          replaceThumbnailOld(thing);
        }
      });
    } else {
      document.querySelectorAll(`shreddit-post:not([${BATSLOP_ATTR}])`).forEach((post) => {
        const postSub = (post.getAttribute("subreddit-prefixed-name") || "").replace(/^r\//, "").toLowerCase();
        if (postSub && !isTargetSubreddit(postSub)) {
          post.setAttribute(BATSLOP_ATTR, "1");
          return;
        }
        if (!postSub) return;
        processShredditPost(post);
      });
    }
  }

  function startObserver() {
    const observer = new MutationObserver((mutations) => {
      let hasNewNodes = false;
      for (const m of mutations) {
        if (m.addedNodes.length > 0) {
          hasNewNodes = true;
          break;
        }
      }
      if (hasNewNodes) processPageWithSubredditCheck();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  async function init() {
    config = await loadConfig();
    slopImage = getSlopImageUrl();
    if (config.enabled) processPageWithSubredditCheck();
    startObserver();

    // Listen for config changes
    const storage = getStorage();
    if (storage) {
      storage.onChanged.addListener(() => {
        loadConfig().then((newConfig) => {
          config = newConfig;
          clearProcessedMarkers();
          processPageWithSubredditCheck();
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
