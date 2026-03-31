const API_URL = "https://script.google.com/macros/s/AKfycbwifS62IlXBVe-5-OS5HhcvioW2Dwfjyo-fBTjylrWZOeKFOxZ5lTIpY7KMXdOrBtQOtA/exec";

let socialrings = [];
let schedules = [];

function getValueByTrimmedKey(obj, targetKey) {
  if (!obj || !targetKey) return "";

  const foundKey = Object.keys(obj).find(
    key => String(key).trim() === String(targetKey).trim()
  );

  return foundKey ? obj[foundKey] : "";
}

function showLoading() {
  document.getElementById("loading-wrap").classList.remove("hidden");
  document.getElementById("socialring-list").classList.add("hidden");
}

function hideLoading() {
  document.getElementById("loading-wrap").classList.add("hidden");
  document.getElementById("socialring-list").classList.remove("hidden");
}

async function loadConfig() {
  showLoading();

  try {
    const response = await fetch(`${API_URL}?type=config`);
    const data = await response.json();

    if (!data.ok) {
      hideLoading();
      alert("데이터를 불러오지 못했습니다.");
      return;
    }

    socialrings = data.socialrings || [];
    schedules = data.schedule || [];

    await renderMainImage(socialrings);
    renderSocialrings(socialrings);
    hideLoading();
  } catch (error) {
    console.error(error);
    hideLoading();
    alert("서버 연결에 실패했습니다.");
  }
}

function renderMainImage(items) {
  return new Promise((resolve) => {
    const mainImageEl = document.getElementById("main-socialring-image");
    if (!mainImageEl) {
      resolve();
      return;
    }

    if (!items || items.length === 0) {
      mainImageEl.classList.add("hidden");
      resolve();
      return;
    }

    const firstSocialring = items[0];
    const mainImageUrl = firstSocialring["index_main_img"] || "";

    if (!mainImageUrl) {
      mainImageEl.classList.add("hidden");
      resolve();
      return;
    }

    mainImageEl.onload = () => {
      mainImageEl.classList.remove("hidden");
      resolve();
    };

    mainImageEl.onerror = () => {
      mainImageEl.classList.add("hidden");
      resolve();
    };

    mainImageEl.src = mainImageUrl;
    mainImageEl.alt = firstSocialring["소셜링명"] || "메인 이미지";
  });
}

function renderSocialrings(items) {
  const listEl = document.getElementById("socialring-list");

  listEl.innerHTML = items.map(item => `
    <button
      type="button"
      class="socialring socialring-button"
      data-socialring-id="${item["소셜링ID"] || ""}"
    >
      <img
        class="socialring-img"
        src="${item["이미지"] || ""}"
        alt="${item["소셜링명"] || ""}"
      />
      <div class="socialring-text">
        <h2>${item["소셜링명"] || ""}</h2>
        <p>${item["설명"] || ""}</p>
      </div>
    </button>
  `).join("");

  bindSocialringEvents();
}

function bindSocialringEvents() {
  const buttons = document.querySelectorAll(".socialring-button");

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const socialringId = button.dataset.socialringId;

      const socialring = socialrings.find(item =>
        String(item["소셜링ID"]).trim() === String(socialringId).trim()
      );

      openScheduleModal(socialring);
    });
  });
}

function openScheduleModal(socialring) {
  if (!socialring) return;

  const modal = document.getElementById("schedule-modal");
  const titleEl = document.getElementById("modal-socialring-title");
  const descEl = document.getElementById("modal-socialring-desc");
  const scheduleListEl = document.getElementById("schedule-list");
  const emptyEl = document.getElementById("empty-message");

  titleEl.textContent = `${socialring["소셜링명"] || "NINETO"} 시간선택`;
  descEl.textContent = socialring["설명"] || "";

  const filteredSchedules = schedules.filter(item =>
    String(item["소셜링ID"]).trim() === String(socialring["소셜링ID"]).trim()
  );

const stepImage1 =
  getValueByTrimmedKey(socialring, "step1_img1") ||
  getValueByTrimmedKey(socialring, "step1_image1") ||
  getValueByTrimmedKey(socialring, "상세이미지1") ||
  getValueByTrimmedKey(socialring, "소개이미지1");

const stepImage2 =
  getValueByTrimmedKey(socialring, "step1_img2") ||
  getValueByTrimmedKey(socialring, "step1_image2") ||
  getValueByTrimmedKey(socialring, "상세이미지2") ||
  getValueByTrimmedKey(socialring, "소개이미지2");

  console.log("socialring =", socialring);
  console.log("socialring keys =", Object.keys(socialring));
  console.log("raw step1_img1 =", socialring["step1_img1"]);
  console.log("raw step1_img2 =", socialring["step1_img2"]);

  if (filteredSchedules.length === 0) {
    scheduleListEl.innerHTML = "";
    emptyEl.classList.remove("hidden");
  } else {
    emptyEl.classList.add("hidden");

    scheduleListEl.innerHTML = filteredSchedules.map(item => `
      <button
        type="button"
        class="schedule-item"
        data-socialring-id="${socialring["소셜링ID"] || ""}"
        data-socialring-name="${socialring["소셜링명"] || ""}"
        data-socialring-desc="${socialring["설명"] || ""}"
        data-main-image="${socialring["main_img"] || ""}"
        data-step-image1="${stepImage1}"
        data-step-image2="${stepImage2}"
        data-schedule-id="${item["시간ID"] || ""}"
        data-schedule-label="${item["시간명"] || ""}"
      >
        ${item["시간명"] || ""}
      </button>
    `).join("");

    bindScheduleEvents();
  }

  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function bindScheduleEvents() {
  const scheduleButtons = document.querySelectorAll(".schedule-item");

  scheduleButtons.forEach(button => {
    button.addEventListener("click", () => {
      const socialringId = button.dataset.socialringId || "";
      const socialringName = button.dataset.socialringName || "";
      const socialringDesc = button.dataset.socialringDesc || "";
      const mainImage = button.dataset.mainImage || "";
      const scheduleId = button.dataset.scheduleId || "";
      const scheduleLabel = button.dataset.scheduleLabel || "";
      const stepImage1 = button.dataset.stepImage1 || "";
      const stepImage2 = button.dataset.stepImage2 || "";

      location.href =
      `./pages/step1.html?socialring_id=${encodeURIComponent(socialringId)}` +
        `&socialring_name=${encodeURIComponent(socialringName)}` +
        `&socialring_desc=${encodeURIComponent(socialringDesc)}` +
        `&main_img=${encodeURIComponent(mainImage)}` +
        `&schedule_id=${encodeURIComponent(scheduleId)}` +
        `&schedule_label=${encodeURIComponent(scheduleLabel)}` +
        `&step_image_1=${encodeURIComponent(stepImage1)}` +
        `&step_image_2=${encodeURIComponent(stepImage2)}`;
    });
  });
}

function closeModal() {
  const modal = document.getElementById("schedule-modal");
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.getElementById("modal-overlay").addEventListener("click", closeModal);

  loadConfig();
});