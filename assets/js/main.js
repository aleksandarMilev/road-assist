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

  const openMailClient = (mailtoUrl) => {
    const mailLink = document.createElement("a");
    mailLink.href = mailtoUrl;
    mailLink.target = "_blank";
    mailLink.rel = "noopener noreferrer";
    mailLink.style.display = "none";

    document.body.appendChild(mailLink);
    mailLink.click();
    mailLink.remove();
  };

  const form = $("[data-contact-form]");
  if (form) {
    const note = $("[data-form-note]");
    const setNote = (msg) => {
      if (note) note.textContent = msg;
    };

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);

      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const location = String(data.get("location") || "").trim();
      const message = String(data.get("message") || "").trim();

      if (!name || !phone || !location || !message) {
        setNote("Моля, попълнете всички полета.");
        return;
      }

      const phoneOk = /^[0-9+()\s-]{6,}$/.test(phone);
      if (!phoneOk) {
        setNote("Моля, въведете валиден телефон.");
        return;
      }

      setNote("Отваряме вашия email клиент…");

      const subject = encodeURIComponent(`Запитване за пътна помощ от ${name}`);
      const body = encodeURIComponent(
        `Име: ${name}\nТелефон: ${phone}\nЛокация: ${location}\n\nСъобщение:\n${message}\n`,
      );

      const to = "info@roadassist24.example";
      const mailtoUrl = `mailto:${to}?subject=${subject}&body=${body}`;
      openMailClient(mailtoUrl);

      setTimeout(
        () => setNote("Ако не се отвори email, обадете се на 0888 123 456."),
        900,
      );
    });
  }
})();
