
/* ==========================================
   SQDT PROBLEM MANAGEMENT
   GOOGLE SHEETS AUTO REFRESH
   ========================================== */

// GANTI dengan URL Web App Apps Script Anda.
const GOOGLE_SCRIPT_URL =
  "PASTE_URL_WEB_APP_ANDA_DI_SINI";

// Interval update otomatis: 5 menit.
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000;

let googleSheetData = [];
let googleSheetLastUpdated = null;
let googleSheetRefreshTimer = null;
let googleSheetLoading = false;

/* ==========================================
   LOAD DATA DARI GOOGLE SHEETS
   Menggunakan JSONP untuk menghindari CORS.
   ========================================== */

function loadGoogleSheetData() {
  return new Promise((resolve, reject) => {
    if (
      !GOOGLE_SCRIPT_URL ||
      GOOGLE_SCRIPT_URL.includes("PASTE_URL")
    ) {
      reject(
        new Error("URL Google Apps Script belum diisi.")
      );
      return;
    }

    const callbackName =
      "sqdtCallback_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() * 100000);

    const script = document.createElement("script");
    const separator = GOOGLE_SCRIPT_URL.includes("?")
      ? "&"
      : "?";

    let finished = false;

    const timeout = setTimeout(() => {
      finish(
        new Error("Waktu tunggu Google Sheets habis.")
      );
    }, 30000);

    function finish(error, result) {
      if (finished) return;
      finished = true;

      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();

      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    }

    window[callbackName] = function (result) {
      if (!result || result.success !== true) {
        finish(
          new Error(
            result?.error ||
            "Google Sheets mengembalikan error."
          )
        );
        return;
      }

      if (!Array.isArray(result.data)) {
        finish(
          new Error("Format data Google Sheets tidak valid.")
        );
        return;
      }

      finish(null, result);
    };

    script.onerror = function () {
      finish(
        new Error(
          "Gagal mengakses Apps Script. Periksa URL dan izin deployment."
        )
      );
    };

    script.src =
      GOOGLE_SCRIPT_URL +
      separator +
      "callback=" +
      encodeURIComponent(callbackName) +
      "&t=" +
      Date.now();

    document.head.appendChild(script);
  });
}

/* ==========================================
   REFRESH DATA DASHBOARD
   ========================================== */

async function refreshDashboardData() {
  if (googleSheetLoading) return;

  googleSheetLoading = true;
  setDashboardMessage("Memuat data Google Sheets...", false);

  try {
    const result = await loadGoogleSheetData();

    googleSheetData = result.data;
    googleSheetLastUpdated = new Date();

    console.log("Google Sheets berhasil dibaca.");
    console.log("Total baris:", result.total);
    console.log("Header:", result.headers);
    console.log("Waktu sumber:", result.updatedAt);

    if (googleSheetData.length === 0) {
      setDashboardMessage(
        "Google Sheets berhasil diakses, tetapi belum ada data.",
        true
      );
      return;
    }

    /*
     * INTEGRASI DASHBOARD:
     * Data terbaru tersedia pada googleSheetData.
     *
     * Hubungkan ke fungsi pemrosesan dan rendering
     * dashboard Anda yang sudah ada.
     *
     * Contoh jika fungsi renderDashboard(data) memang
     * sudah tersedia di app.js:
     *
     * renderDashboard(googleSheetData);
     *
     * Jangan aktifkan baris tersebut sebelum memastikan
     * fungsi dan format datanya cocok.
     */

    setDashboardMessage(
      "Google Sheets berhasil dimuat: " +
      googleSheetData.length +
      " baris. Diperbarui " +
      googleSheetLastUpdated.toLocaleTimeString("id-ID"),
      false
    );

    console.log(
      "Data siap diproses:",
      googleSheetData
    );

  } catch (error) {
    console.error(
      "Gagal memperbarui dashboard:",
      error
    );

    setDashboardMessage(
      "Gagal membaca data Google Sheets: " +
      error.message,
      true
    );

  } finally {
    googleSheetLoading = false;
  }
}

/* ==========================================
   PESAN STATUS
   ========================================== */

function setDashboardMessage(message, isError) {
  let status = document.getElementById(
    "googleSheetStatus"
  );

  if (!status) {
    status = document.createElement("div");
    status.id = "googleSheetStatus";

    Object.assign(status.style, {
      padding: "10px 14px",
      margin: "8px 0",
      borderRadius: "6px",
      fontSize: "13px",
      fontFamily: "Arial, sans-serif"
    });

    const target =
      document.querySelector("main") ||
      document.querySelector(".container") ||
      document.body;

    target.prepend(status);
  }

  status.textContent = message;

  status.style.background = isError
    ? "#4b1728"
    : "#103b35";

  status.style.color = isError
    ? "#ffc4d0"
    : "#a7f3d0";
}

/* ==========================================
   TOMBOL REFRESH MANUAL
   Panggil fungsi ini dari tombol Refresh Data.
   ========================================== */

function manualRefreshGoogleSheet() {
  return refreshDashboardData();
}

/* ==========================================
   AUTO REFRESH SETIAP 5 MENIT
   ========================================== */

function startGoogleSheetAutoRefresh() {
  // Hindari timer ganda.
  if (googleSheetRefreshTimer !== null) {
    clearInterval(googleSheetRefreshTimer);
  }

  // Muat data saat dashboard dibuka.
  refreshDashboardData();

  // Muat ulang setiap 5 menit.
  googleSheetRefreshTimer = setInterval(
    refreshDashboardData,
    AUTO_REFRESH_INTERVAL
  );
}

/* ==========================================
   START
   ========================================== */

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    startGoogleSheetAutoRefresh,
    { once: true }
  );
} else {
  startGoogleSheetAutoRefresh();
}
