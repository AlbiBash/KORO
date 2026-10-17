document.documentElement.classList.add("js");

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const menu = document.getElementById("menu");
if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.textContent = open ? "Close" : "Menu";
  });
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.textContent = "Menu";
    }
  });
}

// Volume selector updates the basket price
const priceOut = document.querySelector("[data-price-out]");
document.querySelectorAll('.sizes input[name="size"]').forEach((input) => {
  input.addEventListener("change", () => {
    if (priceOut) priceOut.textContent = input.dataset.price;
  });
});

// Gentle fade-in as sections enter the viewport
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-in"));
}

// Framed artwork configurator
const frame = document.querySelector(".frame");
const frameArt = document.getElementById("frame-art");
const frameOrder = document.querySelector("[data-frame-order]");
if (frame && frameArt && frameOrder) {
  const pick = (name) => document.querySelector(`input[name="${name}"]:checked`);
  const update = () => {
    const art = pick("art");
    const finish = pick("finish");
    const size = pick("frame-size");

    if (frameArt.getAttribute("src") !== art.dataset.src) {
      frameArt.src = art.dataset.src;
      frameArt.alt = art.dataset.alt;
    }
    frame.classList.toggle("is-wide", art.value === "savour");
    frame.dataset.finish = finish.value;

    document.querySelector("[data-art-name]").textContent = art.dataset.name;
    document.querySelector("[data-finish-name]").textContent = finish.dataset.name;
    document.querySelector("[data-frame-price]").textContent = size.dataset.price;

    const subject = `Framed artwork: ${art.dataset.name}, ${finish.dataset.name}, ${size.value}`;
    frameOrder.href = `mailto:info@koroperfumes.com?subject=${encodeURIComponent(subject)}`;
  };
  document.querySelectorAll('input[name="art"], input[name="finish"], input[name="frame-size"]')
    .forEach((input) => input.addEventListener("change", update));
  update();
}
