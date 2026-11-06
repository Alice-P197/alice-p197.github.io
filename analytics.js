/* ==========================================================================
   Alice-P197 shared analytics loader (GA4)
   Everything is driven by CONFIG below. Edit once, all sites update.
   Include in any site:  <script src="https://alice-p197.github.io/analytics.js" defer></script>
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = {
    // GA4 measurement ID, looks like G-ABC123XYZ9. Replace the placeholder.
    ga4Id: "G-XXXXXXXXXX",
    // Turn on console logs while setting things up.
    debug: false
  };

  var PLACEHOLDER = /^G-X+$/i;
  var loaded = false;

  function log(msg) {
    if (CONFIG.debug) console.log("[track] " + msg);
  }

  function initGtag() {
    if (loaded || PLACEHOLDER.test(CONFIG.ga4Id)) {
      if (PLACEHOLDER.test(CONFIG.ga4Id)) log("GA4 ID not configured, skip.");
      return;
    }
    loaded = true;

    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + CONFIG.ga4Id;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", CONFIG.ga4Id, { send_page_view: true });
    log("gtag ready: " + CONFIG.ga4Id);
  }

  /* Send a custom event. Usage from any page:
     Track("copy_bibtex", { item_id: "metae-former" });
     Track("download", { file_name: "fresnel_compare_d30.png" });                */
  window.Track = function (name, params) {
    if (!window.gtag) return;
    window.gtag("event", name, params || {});
  };

  /* Declarative tracking. Add data-track="xxx" to any element:
     <a href="paper.pdf" data-track="download" data-track-label="paper-pdf"> */
  document.addEventListener("click", function (e) {
    var el = e.target && e.target.closest ? e.target.closest("[data-track]") : null;
    if (!el) return;
    window.Track(el.getAttribute("data-track"), {
      label: el.getAttribute("data-track-label") || (el.textContent || "").trim().slice(0, 60),
      page_path: location.pathname
    });
  }, true);

  /* GA4 enhanced measurement already covers outbound clicks and file downloads,
     so this loader does not duplicate them. Enable it in:
     Admin > Data streams > your stream > Enhanced measurement. */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGtag);
  } else {
    initGtag();
  }
})();
