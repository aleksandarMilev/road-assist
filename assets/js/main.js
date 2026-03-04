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
      const inside = nav.contains(e.target) || navToggle.contains(e.target);
      if (!inside) setNavOpen(false);
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
        setTimeout(() => (btn.textContent = prev), 1200);
      } catch {
        window.prompt("Копирай номера:", phone);
      }
    });
  });
})();
