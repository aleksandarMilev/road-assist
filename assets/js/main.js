(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const header = $("[data-header]");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 6);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navToggle = $("[data-nav-toggle]");
  const nav = $("[data-nav]");
  const setNavOpen = (open) => {
    if (!nav || !navToggle) return;
    nav.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "Затвори меню" : "Отвори меню");
  };

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("open"));
    });

    nav.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      setNavOpen(false);
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      const inside = nav.contains(target) || navToggle.contains(target);
      if (!inside) setNavOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setNavOpen(false);
    });
  }

  const path = (
    location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();
  $$("[data-navlink]").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("active");
  });

  $$("[data-copy-phone]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const phone = btn.getAttribute("data-phone") || "";
      try {
        await navigator.clipboard.writeText(phone);
        const prev = btn.textContent;
        btn.textContent = "Копирано ✓";
        window.setTimeout(() => {
          btn.textContent = prev;
        }, 1200);
      } catch {
        window.prompt("Копирай номера:", phone);
      }
    });
  });

  if ($(".mobile-callbar")) {
    document.body.classList.add("has-callbar");
  }

  const faqGroups = $$("[data-faq]");
  faqGroups.forEach((group) => {
    const triggers = $$("[data-faq-trigger]", group);
    const setExpanded = (trigger, expanded) => {
      const panelId = trigger.getAttribute("aria-controls");
      if (!panelId) return;

      const panel = document.getElementById(panelId);
      trigger.setAttribute("aria-expanded", expanded ? "true" : "false");
      if (panel) panel.hidden = !expanded;
    };

    triggers.forEach((trigger, index) => {
      setExpanded(trigger, false);

      trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach((item) => {
          if (item !== trigger) setExpanded(item, false);
        });

        setExpanded(trigger, !isExpanded);
      });

      trigger.addEventListener("keydown", (e) => {
        let nextIndex = index;

        if (e.key === "ArrowDown") nextIndex = (index + 1) % triggers.length;
        if (e.key === "ArrowUp") {
          nextIndex = (index - 1 + triggers.length) % triggers.length;
        }
        if (e.key === "Home") nextIndex = 0;
        if (e.key === "End") nextIndex = triggers.length - 1;

        if (nextIndex !== index) {
          e.preventDefault();
          triggers[nextIndex].focus();
        }
      });
    });
  });

  if ("serviceWorker" in navigator && window.location.protocol.startsWith("http")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        // Graceful fallback: do nothing if registration is unavailable.
      });
    });
  }
})();
