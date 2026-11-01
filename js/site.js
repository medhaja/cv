/* medhaja.me — progressive enhancement only. The site is fully usable without JS. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /**
   * Accessible mobile navigation: toggles the link list, keeps aria-expanded
   * in sync, closes on link activation / Escape, and resets above the breakpoint.
   * @returns {void}
   */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!toggle || !menu) return;

    var mq = window.matchMedia("(max-width: 760px)");

    /**
     * @param {boolean} open Whether the menu should be shown.
     * @returns {void}
     */
    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle-text").textContent = open ? "Close" : "Menu";
      if (mq.matches) {
        menu.hidden = !open;
      } else {
        menu.hidden = false;
      }
    }

    /** @returns {void} */
    function sync() {
      setOpen(false);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", function (event) {
      if (event.target.closest("a") && mq.matches) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    document.addEventListener("click", function (event) {
      if (mq.matches && toggle.getAttribute("aria-expanded") === "true" &&
          !menu.contains(event.target) && !toggle.contains(event.target)) {
        setOpen(false);
      }
    });

    if (mq.addEventListener) mq.addEventListener("change", sync);
    else if (mq.addListener) mq.addListener(sync);
    sync();
  }

  /**
   * Fades sections in once as they enter the viewport. Skipped entirely when the
   * user prefers reduced motion or IntersectionObserver is unavailable.
   * @returns {void}
   */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
  }

  /**
   * Marks the nav link for the section currently in view (aria-current="true").
   * @returns {void}
   */
  function initActiveLink() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href*="#"]'));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = a.getAttribute("href").split("#")[1];
      var section = id && document.getElementById(id);
      if (section) map[id] = a;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = map[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(function (a) { a.removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNav();
    initReveal();
    initActiveLink();
  });
})();
