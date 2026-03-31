const API_URL =
  "https://script.google.com/macros/s/AKfycbwifS62IlXBVe-5-OS5HhcvioW2Dwfjyo-fBTjylrWZOeKFOxZ5lTIpY7KMXdOrBtQOtA/exec";

const pages = document.querySelectorAll(".page");
let currentPage = 0;

let selectedGender = "";
let paymentConfirmed = "";
let noticeConfirmed = "";
let privacyAgreed = "";
let toastTimer = null;

const params = new URLSearchParams(window.location.search);
const selectedSocialringId = params.get("socialring_id") || "";
const selectedSocialringName = params.get("socialring_name") || "";
const selectedMainImage = params.get("main_img") || "";
const selectedScheduleId = params.get("schedule_id") || "";
const selectedScheduleLabel = params.get("schedule_label") || "";
const noticeCheckBtn = document.getElementById("noticeCheckBtn");
const noticeModal = document.getElementById("noticeModal");
const noticeModalClose = document.getElementById("noticeModalClose");
const noticeModalX = document.getElementById("noticeModalX");
const noticeConfirmBtn = document.getElementById("noticeConfirmBtn");
const privacyCheckBtn = document.getElementById("privacyCheckBtn");
const privacyModal = document.getElementById("privacyModal");
const privacyModalClose = document.getElementById("privacyModalClose");
const privacyModalX = document.getElementById("privacyModalX");
const privacyConfirmBtn = document.getElementById("privacyConfirmBtn");

function showPage(index) {
  pages.forEach((page, i) => {
    page.classList.remove("active", "prev");
    if (i < index) page.classList.add("prev");
    if (i === index) page.classList.add("active");
  });

  currentPage = index;
  updateProgress(index);
}

function updateProgress(index) {
  const activePage = pages[index];
  if (!activePage) return;

  const progressText = activePage.querySelector(".progress-text");
  const progressFill = activePage.querySelector(".progress-fill");

  if (!progressText || !progressFill) return;

  const step = index;
  const totalSteps = 7;
  const percent = Math.round((step / totalSteps) * 100);

  progressText.textContent = `${step}/${totalSteps}`;
  progressFill.style.width = `${percent}%`;
}

function showToast(message) {
  const toast = document.getElementById("centerToast");
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 1000);
}

function validateCurrentPageBeforeNext() {
  if (currentPage === 1) {
    const nickname = document.getElementById("nicknameInput")?.value.trim() || "";
    if (!nickname) {
      showToast("닉네임을 입력해주세요.");
      return false;
    }
  }

  if (currentPage === 2) {
    const age = document.getElementById("ageInput")?.value.trim() || "";
    const job = document.getElementById("jobInput")?.value.trim() || "";
    const charm = document.getElementById("charmInput")?.value.trim() || "";

    if (!selectedGender) {
      showToast("성별을 선택해주세요.");
      return false;
    }

    if (!age) {
      showToast("나이를 입력해주세요.");
      return false;
    }

    if (!job) {
      showToast("직업을 입력해주세요.");
      return false;
    }

    if (!charm) {
      showToast("나만의 매력을 입력해주세요.");
      return false;
    }
  }

  if (currentPage === 3) {
    const phone = document.getElementById("phoneInput")?.value.trim() || "";
    if (!phone) {
      showToast("전화번호를 입력해주세요.");
      return false;
    }
  }

  if (currentPage === 5) {
    if (!paymentConfirmed) {
      showToast("입금 안내 확인을 선택해주세요.");
      return false;
    }
  }

  if (currentPage === 6) {
    const refundBank = document.getElementById("bankNameInput")?.value.trim() || "";
    const refundAccount = document.getElementById("accountNumberInput")?.value.trim() || "";
    const refundHolder = document.getElementById("accountHolderInput")?.value.trim() || "";

    if (!refundBank) {
      showToast("은행명을 입력해주세요.");
      return false;
    }

    if (!refundAccount) {
      showToast("계좌번호를 입력해주세요.");
      return false;
    }

    if (!refundHolder) {
      showToast("예금주를 입력해주세요.");
      return false;
    }
  }

  return true;
}

function formatPhoneNumber(value) {
  const numbers = value.replace(/\D/g, "").slice(0, 11);

  if (numbers.length < 4) {
    return numbers;
  }

  if (numbers.length < 8) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  }

  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
}

function bindPhoneInputEvent() {
  const phoneInput = document.getElementById("phoneInput");
  if (!phoneInput) return;

  phoneInput.addEventListener("input", (e) => {
    e.target.value = formatPhoneNumber(e.target.value);
  });
}

function bindPageMoveEvents() {
  document.querySelectorAll(".next-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      const nextIndex = Number(btn.dataset.next);

      if (!validateCurrentPageBeforeNext()) {
        return;
      }

      showPage(nextIndex);
    });
  });

  document.querySelectorAll(".prev-step").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentPage > 0) showPage(currentPage - 1);
    });
  });
}

function renderSocialringTitle() {
  const titleEl = document.getElementById("socialringTitle");
  if (!titleEl) return;

  titleEl.textContent = selectedSocialringName;
}

function renderSocialringMainImage() {
  const imageEl = document.getElementById("socialringMainImage");
  if (!imageEl) return;

  if (!selectedMainImage) {
    imageEl.style.display = "none";
    return;
  }

  imageEl.onload = () => {
    imageEl.style.display = "block";
  };

  imageEl.onerror = () => {
    imageEl.style.display = "none";
  };

  imageEl.src = selectedMainImage;
  imageEl.alt = selectedSocialringName || "대표 이미지";
}

function bindChoiceEvents() {
  document.querySelectorAll(".gender-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".gender-item").forEach((item) => {
        item.classList.remove("selected");
      });
      btn.classList.add("selected");
      selectedGender = btn.dataset.gender || "";
    });
  });

  document.querySelectorAll(".payment-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".payment-item").forEach((item) => {
        item.classList.remove("selected");
      });
      btn.classList.add("selected");
      paymentConfirmed = btn.dataset.value || "";
    });
  });
}

function openNoticeModal() {
  noticeModal.classList.add("open");
  noticeModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeNoticeModal() {
  noticeModal.classList.remove("open");
  noticeModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (noticeCheckBtn) {
  noticeCheckBtn.addEventListener("click", () => {
    openNoticeModal();
  });
}

if (noticeModalClose) {
  noticeModalClose.addEventListener("click", closeNoticeModal);
}

if (noticeModalX) {
  noticeModalX.addEventListener("click", closeNoticeModal);
}

if (noticeConfirmBtn) {
  noticeConfirmBtn.addEventListener("click", () => {
    noticeCheckBtn.classList.add("confirmed", "selected");
    noticeCheckBtn.setAttribute("data-confirmed", "true");
    noticeConfirmed = "확인완료";
    closeNoticeModal();
  });
}

if (privacyCheckBtn) {
  privacyCheckBtn.addEventListener("click", () => {
    openPrivacyModal();
  });
}

if (privacyModalClose) {
  privacyModalClose.addEventListener("click", closePrivacyModal);
}

if (privacyModalX) {
  privacyModalX.addEventListener("click", closePrivacyModal);
}

if (privacyConfirmBtn) {
  privacyConfirmBtn.addEventListener("click", () => {
    privacyCheckBtn.classList.add("confirmed", "selected");
    privacyCheckBtn.setAttribute("data-confirmed", "true");
    privacyAgreed = "동의";
    closePrivacyModal();
  });
}

function openPrivacyModal() {
  privacyModal.classList.add("open");
  privacyModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePrivacyModal() {
  privacyModal.classList.remove("open");
  privacyModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (!loadingOverlay) return;

  loadingOverlay.classList.add("show");
  loadingOverlay.setAttribute("aria-hidden", "false");
}

function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (!loadingOverlay) return;

  loadingOverlay.classList.remove("show");
  loadingOverlay.setAttribute("aria-hidden", "true");
}

function bindSubmitEvent() {
  const submitBtn = document.getElementById("submitBtn");
  if (!submitBtn) return;

  submitBtn.addEventListener("click", async () => {
    const payload = {
      socialring_id: selectedSocialringId,
      socialring_name: selectedSocialringName,
      schedule_id: selectedScheduleId,
      schedule_label: selectedScheduleLabel,

      nickname: document.getElementById("nicknameInput")?.value.trim() || "",
      gender: selectedGender,
      age: document.getElementById("ageInput")?.value.trim() || "",
      job: document.getElementById("jobInput")?.value.trim() || "",
      charm: document.getElementById("charmInput")?.value.trim() || "",
      phone: document.getElementById("phoneInput")?.value.trim() || "",
      instagram: document.getElementById("instagramInput")?.value.trim() || "",

      deposit_confirm: paymentConfirmed,
      refund_bank: document.getElementById("bankNameInput")?.value.trim() || "",
      refund_account: document.getElementById("accountNumberInput")?.value.trim() || "",
      refund_holder: document.getElementById("accountHolderInput")?.value.trim() || "",

      notice_confirm: noticeConfirmed,
      privacy_agree: privacyAgreed
    };

    if (!payload.schedule_id) {
      alert("참여 시간이 선택되지 않았습니다. 메인 화면에서 다시 선택해주세요.");
      return;
    }
    if (!payload.nickname) {
      showToast("닉네임을 입력해주세요.");
      return;
    }
    if (!payload.gender) {
      showToast("성별을 선택해주세요.");
      return;
    }
    if (!payload.age) {
      showToast("나이를 입력해주세요.");
      return;
    }
    if (!payload.job) {
      showToast("직업을 입력해주세요.");
      return;
    }
    if (!payload.charm) {
      showToast("나만의 매력을 입력해주세요.");
      return;
    }
    if (!payload.phone) {
      showToast("전화번호를 입력해주세요.");
      return;
    }
    if (!payload.deposit_confirm) {
      showToast("참가 시간을 선택해주세요.");
      return;
    }
    if (!payload.refund_bank) {
      showToast("은행명을 입력해주세요.");
      return;
    }
    if (!payload.refund_account) {
      showToast("계좌번호를 입력해주세요.");
      return;
    }
    if (!payload.refund_holder) {
      showToast("예금주를 입력해주세요.");
      return;
    }
    if (!payload.notice_confirm) {
      showToast("공지사항을 확인해주세요.");
      return;
    }
    if (!payload.privacy_agree) {
      showToast("개인정보 수집 및 이용에 동의해주세요.");
      return;
    }

    try {
      showLoading();

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (result.ok) {
        hideLoading();
        alert("신청이 완료되었습니다.");
        location.href = "../index.html";
      } else {
        hideLoading();
        alert("전송 중 오류가 발생했습니다: " + (result.message || result.detail || ""));
      }
    } catch (error) {
      hideLoading();
      console.error(error);
      alert("전송 중 오류가 발생했습니다.");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSocialringTitle();
  renderSocialringMainImage();
  bindPageMoveEvents();
  bindChoiceEvents();
  bindPhoneInputEvent();
  bindSubmitEvent();
  showPage(0);
});