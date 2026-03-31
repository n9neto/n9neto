const params = new URLSearchParams(window.location.search);

const socialringId = params.get("socialring_id") || "";
const socialringName = params.get("socialring_name") || "";
const socialringDesc = params.get("socialring_desc") || "";
const mainImage = params.get("main_img") || "";
const scheduleId = params.get("schedule_id") || "";
const scheduleLabel = params.get("schedule_label") || "";
const stepImage1 = params.get("step_image_1") || "";
const stepImage2 = params.get("step_image_2") || "";

function waitForImage(imgEl, src, altText) {
  return new Promise((resolve) => {
    if (!imgEl || !src) {
      if (imgEl) imgEl.style.display = "none";
      resolve();
      return;
    }

    imgEl.style.display = "none";

    imgEl.onload = () => {
      imgEl.style.display = "block";
      resolve();
    };

    imgEl.onerror = () => {
      imgEl.style.display = "none";
      resolve();
    };

    imgEl.alt = altText;
    imgEl.src = src;
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const buttonEl = document.getElementById("applyButton");
  const image1El = document.getElementById("stepImage1");
  const image2El = document.getElementById("stepImage2");
  const loadingWrap = document.getElementById("loadingWrap");

  await Promise.all([
    waitForImage(
      image1El,
      stepImage1,
      `${socialringName || "소셜링"} 소개 이미지 1`
    ),
    waitForImage(
      image2El,
      stepImage2,
      `${socialringName || "소셜링"} 소개 이미지 2`
    ),
  ]);

  if (loadingWrap) {
    loadingWrap.classList.add("hidden");
  }

  if (buttonEl) {
    buttonEl.addEventListener("click", () => {
      location.href =
        `./subscription_main.html?socialring_id=${encodeURIComponent(socialringId)}` +
        `&socialring_name=${encodeURIComponent(socialringName)}` +
        `&socialring_desc=${encodeURIComponent(socialringDesc)}` +
        `&main_img=${encodeURIComponent(mainImage)}` +
        `&schedule_id=${encodeURIComponent(scheduleId)}` +
        `&schedule_label=${encodeURIComponent(scheduleLabel)}`;
    });
  }
});