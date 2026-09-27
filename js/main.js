(function () {
  var nav = document.getElementById("navbar");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var scrollBtn = document.getElementById("scrollTop");
  var sections = document.querySelectorAll(".section[id], .hero[id]");
  var navAnchors = document.querySelectorAll(".nav-links a");

  toggle.addEventListener("click", function () {
    var open = toggle.classList.toggle("open");
    links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      toggle.classList.remove("open");
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        nav.classList.toggle("scrolled", window.scrollY > 10);
        scrollBtn.classList.toggle("visible", window.scrollY > 400);

        var current = "";
        sections.forEach(function (s) {
          if (window.scrollY >= s.offsetTop - 120) current = s.id;
        });
        navAnchors.forEach(function (a) {
          a.classList.toggle(
            "active",
            a.getAttribute("href") === "#" + current
          );
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
