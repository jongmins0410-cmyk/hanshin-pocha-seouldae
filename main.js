const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const toast = document.querySelector(".toast");
const deliveryDropdown = document.querySelector(".delivery-dropdown");
const deliveryToggle = document.querySelector(".delivery-toggle");
const deliveryMenu = document.querySelector(".delivery-menu");

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-active");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    header.classList.remove("menu-active");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

function setDeliveryOpen(isOpen) {
  if (!deliveryToggle || !deliveryMenu) return;
  deliveryToggle.setAttribute("aria-expanded", String(isOpen));
  deliveryMenu.hidden = !isOpen;
}

deliveryToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  setDeliveryOpen(deliveryMenu?.hidden !== false);
});

deliveryMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setDeliveryOpen(false);
  }
});

document.addEventListener("click", (event) => {
  if (!deliveryDropdown?.contains(event.target)) {
    setDeliveryOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setDeliveryOpen(false);
  }
});

const heroLayers = Array.from(document.querySelectorAll("[data-hero-slide]"));
const heroCopies = Array.from(document.querySelectorAll("[data-hero-copy]"));
const heroDots = Array.from(document.querySelectorAll("[data-hero-dot]"));
const heroArrows = Array.from(document.querySelectorAll("[data-hero-arrow]"));
const heroProgress = document.querySelector(".hero-progress span");
let heroIndex = 0;
let heroTimer;
let heroTypeTimer;
let heroTypeRun = 0;

function showHeroSlide(index) {
  heroIndex = (index + heroLayers.length) % heroLayers.length;
  heroLayers.forEach((layer, layerIndex) => {
    layer.classList.toggle("active", layerIndex === heroIndex);
    const video = layer.querySelector("video");
    if (video) {
      if (layerIndex === heroIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  });
  heroCopies.forEach((copy, copyIndex) => copy.classList.toggle("active", copyIndex === heroIndex));
  heroDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === heroIndex));
  startHeroTyping(heroCopies[heroIndex]);
  restartHeroProgress();
}

function startHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => showHeroSlide(heroIndex + 1), 6000);
}

function restartHeroProgress() {
  if (!heroProgress) return;
  heroProgress.classList.remove("running");
  void heroProgress.offsetWidth;
  heroProgress.classList.add("running");
}

function cacheHeroCopy(copy) {
  if (!copy || copy.dataset.copyReady === "true") return;
  const title = copy.querySelector("h2");
  const body = copy.querySelector("p");
  if (title) {
    title.dataset.fullText = title.innerHTML
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]*>/g, "")
      .trim();
  }
  if (body) body.dataset.fullText = body.textContent.trim();
  copy.dataset.copyReady = "true";
}

function typeInto(element, text, delay, runId, done) {
  if (!element) {
    if (done) done();
    return;
  }

  const chars = Array.from(text);
  let index = 0;
  element.textContent = "";
  element.classList.add("typing-cursor");

  const tick = () => {
    if (runId !== heroTypeRun) return;
    index += 1;
    element.textContent = chars.slice(0, index).join("");

    if (index < chars.length) {
      heroTypeTimer = window.setTimeout(tick, delay);
    } else {
      element.classList.remove("typing-cursor");
      if (done) done();
    }
  };

  if (!chars.length) {
    element.classList.remove("typing-cursor");
    if (done) done();
    return;
  }

  tick();
}

function startHeroTyping(copy) {
  heroTypeRun += 1;
  window.clearTimeout(heroTypeTimer);
  const runId = heroTypeRun;

  heroCopies.forEach((item) => {
    cacheHeroCopy(item);
    item.querySelectorAll(".typing-cursor").forEach((el) => el.classList.remove("typing-cursor"));
    item.querySelectorAll("p").forEach((el) => el.classList.remove("subcopy-visible"));
  });

  const title = copy?.querySelector("h2");
  const body = copy?.querySelector("p");
  if (!title || !body) return;

  title.textContent = "";
  body.textContent = "";
  body.classList.remove("subcopy-visible");

  typeInto(title, title.dataset.fullText || "", 46, runId, () => {
    heroTypeTimer = window.setTimeout(() => {
      if (runId !== heroTypeRun) return;
      body.textContent = body.dataset.fullText || "";
      body.classList.add("subcopy-visible");
    }, 180);
  });
}

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showHeroSlide(Number(dot.dataset.heroDot));
    startHeroTimer();
  });
});

heroArrows.forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const direction = arrow.dataset.heroArrow === "next" ? 1 : -1;
    showHeroSlide(heroIndex + direction);
    startHeroTimer();
  });
});

showHeroSlide(0);
startHeroTimer();

const branchSlides = Array.from(document.querySelectorAll("[data-branch-slide]"));
const branchDots = Array.from(document.querySelectorAll("[data-branch-dot]"));
let branchIndex = 0;
let branchTimer;

function showBranchSlide(index) {
  if (!branchSlides.length) return;
  branchIndex = (index + branchSlides.length) % branchSlides.length;
  branchSlides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === branchIndex));
  branchDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === branchIndex));
}

function startBranchTimer() {
  clearInterval(branchTimer);
  branchTimer = setInterval(() => showBranchSlide(branchIndex + 1), 4200);
}

branchDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showBranchSlide(Number(dot.dataset.branchDot));
    startBranchTimer();
  });
});

showBranchSlide(0);
startBranchTimer();

const menuCopies = Array.from(document.querySelectorAll("[data-menu-copy]"));
const menuImages = Array.from(document.querySelectorAll("[data-menu-image]"));
const menuDots = Array.from(document.querySelectorAll("[data-menu-dot]"));
const menuPrev = document.querySelector(".menu-prev");
const menuNext = document.querySelector(".menu-next");
const menuPhotoPanel = document.querySelector(".menu-copy-panel");
const menuPhotoModal = document.querySelector(".menu-photo-modal");
const menuPhotoImg = document.querySelector(".menu-photo-img");
const menuPhotoCaption = document.querySelector(".menu-photo-caption strong");
const menuPhotoCloseButtons = Array.from(document.querySelectorAll("[data-menu-photo-close]"));
let menuIndex = 0;

function showMenu(index) {
  menuIndex = (index + menuCopies.length) % menuCopies.length;
  menuCopies.forEach((copy, copyIndex) => copy.classList.toggle("active", copyIndex === menuIndex));
  menuImages.forEach((image, imageIndex) => image.classList.toggle("active", imageIndex === menuIndex));
  menuDots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === menuIndex));
}

menuDots.forEach((dot) => {
  dot.addEventListener("click", () => showMenu(Number(dot.dataset.menuDot)));
});

menuPrev.addEventListener("click", () => showMenu(menuIndex - 1));
menuNext.addEventListener("click", () => showMenu(menuIndex + 1));
showMenu(0);

function openMenuPhoto() {
  const activeImage = menuImages[menuIndex];
  const activeCopy = menuCopies[menuIndex];
  if (!activeImage || !menuPhotoModal || !menuPhotoImg || !menuPhotoCaption) return;

  const menuName = activeCopy?.querySelector(".menu-name")?.textContent?.trim() || activeImage.alt || "메뉴";
  menuPhotoImg.src = activeImage.currentSrc || activeImage.src;
  menuPhotoImg.alt = `${menuName} 메뉴 사진`;
  menuPhotoCaption.textContent = menuName;
  menuPhotoModal.classList.add("open");
  menuPhotoModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("nav-open");
}

function closeMenuPhoto() {
  if (!menuPhotoModal) return;
  menuPhotoModal.classList.remove("open");
  menuPhotoModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("nav-open");
}

menuPhotoPanel?.addEventListener("click", (event) => {
  if (event.target.closest("a, button")) return;
  openMenuPhoto();
});

menuPhotoPanel?.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (event.target.closest("a, button")) return;
  event.preventDefault();
  openMenuPhoto();
});

menuPhotoCloseButtons.forEach((button) => button.addEventListener("click", closeMenuPhoto));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenuPhoto();
});

const copyButton = document.querySelector("[data-copy-address]");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

copyButton.addEventListener("click", async () => {
  const address = "서울 관악구 관악로16길 38, 2층";
  try {
    await navigator.clipboard.writeText(address);
    showToast("주소가 복사되었습니다.");
  } catch {
    showToast(address);
  }
});
