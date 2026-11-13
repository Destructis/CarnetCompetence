"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navbar");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(expanded));
  navigation.classList.toggle("is-open", expanded);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuToggle.getAttribute("aria-expanded") === "true"
  ) {
    closeMenu();
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});

const navigationLinks = [...navigation.querySelectorAll('a[href^="#"]')];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting);
      if (!visible.length) return;
      const current = visible.sort(
        (a, b) => b.intersectionRatio - a.intersectionRatio,
      )[0].target.id;
      navigationLinks.forEach((link) => {
        if (link.hash === `#${current}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -45% 0px", threshold: [0, 0.1, 0.5] },
  );
  document
    .querySelectorAll("main section[id]")
    .forEach((section) => observer.observe(section));
}

const filterButtons = [...document.querySelectorAll("[data-filter]")];
const projectCards = [...document.querySelectorAll(".project-card")];
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    let visibleCount = 0;
    projectCards.forEach((card) => {
      card.hidden =
        button.dataset.filter !== "all" &&
        card.dataset.category !== button.dataset.filter;
      if (!card.hidden) visibleCount++;
    });
    document.querySelector("#filter-status").textContent =
      `${visibleCount} projet${visibleCount > 1 ? "s" : ""} affiché${visibleCount > 1 ? "s" : ""}.`;
  });
});

document.querySelector("#copy-email").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  const email = "eloi.anquetil@gmail.com";
  try {
    await navigator.clipboard.writeText(email);
    status.textContent = "Adresse e-mail copiée !";
  } catch {
    status.textContent = `Copiez cette adresse : ${email}`;
    const range = document.createRange();
    range.selectNodeContents(document.querySelector(".contact-email"));
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
