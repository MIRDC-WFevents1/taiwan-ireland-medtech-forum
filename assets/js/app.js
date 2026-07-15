const DATA_PATHS = {
  event: "data/event.json",
  speakers: "data/speakers.json",
  agenda: "data/agenda.json",
  organizers: "data/organizers.json",
};

const get = (id) => document.getElementById(id);

function text(id, value) {
  const node = get(id);
  if (node) node.textContent = value ?? "";
}

function speakerById(speakers, id) {
  return speakers.find((speaker) => speaker.id === id);
}

function speakerLabel(speaker) {
  if (!speaker) return "";
  return `${speaker.name}${speaker.degree ? `, ${speaker.degree}` : ""}`;
}

function renderEvent(event) {
  text("event-series", event.seriesEn);
  text("event-title", event.titleZh);
  text("event-title-en", event.titleEn);
  text("hero-venue", event.venueZh);
  text("hero-time", `${event.checkInZh}｜${event.forumTimeZh}`);
  text("registration-deadline", `${event.registrationDeadlineZh}｜${event.registrationDeadlineEn}`);
  text("quick-date", event.dateDisplayZh);
  text("quick-time", `${event.checkInZh}｜${event.forumTimeZh}`);
  text("quick-venue", event.venueZh);
  text("quick-address", event.addressZh);
  text("banner-deadline", `${event.registrationDeadlineZh}｜名額有限，敬請把握`);
  text("venue-title", event.venueZh);
  text("venue-title-en", event.venueEn);
  text("venue-address", `${event.addressZh}｜${event.addressEn}`);

  document.querySelectorAll(".registration-link").forEach((link) => {
    link.href = event.registrationUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", "前往金屬中心外部報名系統（另開新視窗）");
  });

  const mapLink = get("map-link");
  if (mapLink) mapLink.href = event.mapUrl;

  const intro = get("event-intro");
  if (intro) {
    intro.innerHTML = event.intro.map((paragraph) => `<p>${paragraph}</p>`).join("");
  }

  const focusGrid = get("focus-grid");
  if (focusGrid) {
    focusGrid.innerHTML = event.focusAreas
      .map(
        (focus) => `
          <article class="focus-card">
            <span class="focus-card-number">${focus.number}</span>
            <h3>${focus.titleZh}</h3>
            <small>${focus.titleEn}</small>
            <p>${focus.description}</p>
          </article>`,
      )
      .join("");
  }
}

function renderSpeakers(speakers) {
  const grid = get("speaker-grid");
  if (!grid) return;

  grid.innerHTML = speakers
    .map(
      (speaker, index) => `
        <article class="speaker-card">
          <div class="speaker-photo ${speaker.photoClass}" role="img" aria-label="${speaker.name} 講者照片"></div>
          <div class="speaker-body">
            <span class="speaker-order">SPEAKER ${String(index + 1).padStart(2, "0")}</span>
            <h3>${speaker.name}</h3>
            ${speaker.degree ? `<span class="speaker-degree">${speaker.degree}</span>` : ""}
            <p class="speaker-title"><strong>${speaker.title}</strong>${speaker.organization}</p>
          </div>
        </article>`,
    )
    .join("");
}

function renderAgenda(agenda, speakers) {
  const list = get("agenda-list");
  if (!list) return;

  list.innerHTML = agenda
    .map((item) => {
      const speaker = item.speakerId ? speakerById(speakers, item.speakerId) : null;
      const moderator = item.moderatorId ? speakerById(speakers, item.moderatorId) : null;
      const panelists = (item.panelistIds || []).map((id) => speakerById(speakers, id)).filter(Boolean);

      let people = "";
      if (speaker) {
        people = `<p class="agenda-speaker"><strong>${speakerLabel(speaker)}</strong>｜${speaker.title}, ${speaker.organization}</p>`;
      } else if (moderator) {
        people = `<p class="agenda-speaker"><strong>Moderator：</strong>${speakerLabel(moderator)}<br><strong>Panelists：</strong>${panelists.map(speakerLabel).join("、")}</p>`;
      } else if (item.detailZh) {
        people = `<p class="agenda-speaker"><strong>${item.detailZh}</strong>｜${item.detailEn}</p>`;
      }

      return `
        <article class="agenda-item agenda-item--${item.type}">
          <time class="agenda-time">${item.time}</time>
          <span class="agenda-topic">${item.topic || item.titleEn}</span>
          <div class="agenda-content">
            <h3>${item.titleZh}</h3>
            <p class="agenda-title-en">${item.titleEn}</p>
            ${people}
          </div>
        </article>`;
    })
    .join("");
}

function renderOrganizers(data) {
  const list = get("organizer-list");
  if (!list) return;

  const organizer = `
    <div class="organizer-group">
      <small>主辦單位｜Organizer</small>
      <div class="organizer-logos">
        <div class="organizer-logo">
          <img src="${data.organizer.logo}" alt="${data.organizer.nameZh} ${data.organizer.nameEn}" />
        </div>
      </div>
    </div>`;

  const coOrganizers = `
    <div class="organizer-group">
      <small>協辦單位｜Co-organizers</small>
      <div class="organizer-logos">
        ${data.coOrganizers
          .map(
            (item) => `
              <div class="organizer-logo ${item.nameZh.includes("Medtex") ? "organizer-logo--medtex" : ""}">
                <img src="${item.logo}" alt="${item.nameZh} ${item.nameEn}" />
              </div>`,
          )
          .join("")}
      </div>
    </div>`;

  list.innerHTML = organizer + coOrganizers;
}

function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = get("primary-nav");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
}

async function loadData() {
  const entries = await Promise.all(
    Object.entries(DATA_PATHS).map(async ([key, path]) => {
      const response = await fetch(path);
      if (!response.ok) throw new Error(`Unable to load ${path}`);
      return [key, await response.json()];
    }),
  );
  return Object.fromEntries(entries);
}

async function init() {
  initMenu();

  try {
    const data = await loadData();
    renderEvent(data.event);
    renderSpeakers(data.speakers);
    renderAgenda(data.agenda, data.speakers);
    renderOrganizers(data.organizers);
  } catch (error) {
    console.error(error);
    const main = document.querySelector("main");
    if (main) {
      const notice = document.createElement("p");
      notice.className = "data-error";
      notice.textContent = "活動資料暫時無法載入，請稍後重新整理頁面。";
      main.prepend(notice);
    }
  }
}

init();
