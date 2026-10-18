const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz34GvjpKG4PO78KsEvK8kcgZGADEBYJMSRcarKWSGpdik0rvjbfp5Yn1eTfKeMok0A/exec";

function loadGoogleSheetData() {
  return new Promise((resolve, reject) => {
    const callbackName =
      "googleSheetCallback_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() * 10000);

    const script = document.createElement("script");
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("Timeout saat membaca Google Sheets."));
    }, 30000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = function (result) {
      cleanup();

      if (!result || result.success !== true) {
        reject(
          new Error(
            result?.error || "Gagal membaca Google Sheets."
          )
        );
        return;
      }

      if (!Array.isArray(result.data)) {
        reject(new Error("Format data Google Sheets tidak valid."));
        return;
      }

      resolve(result);
    };

    script.onerror = function () {
      cleanup();
      reject(new Error("Gagal menghubungi Apps Script."));
    };

    const separator = GOOGLE_SCRIPT_URL.includes("?")
      ? "&"
      : "?";

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
