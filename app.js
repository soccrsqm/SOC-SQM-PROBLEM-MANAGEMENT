const API_URL = "https://script.google.com/macros/s/AKfycbz34GvjpKG4PO78KsEvK8kcgZGADEBYJMSRcarKWSGpdik0rvjbfp5Yn1eTfKeMok0A/exec";

async function loadCsv() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !Array.isArray(result.data)) {
      throw new Error("Format data API tidak sesuai");
    }

    const data = result.data;

    console.log("Jumlah data:", data.length);
    console.log("Headers:", result.headers);
    console.log("Contoh data:", data[0]);

    // Gunakan data untuk memperbarui dashboard.
    // Sesuaikan dengan fungsi render yang sudah ada.
    return data;

  } catch (error) {
    console.error("Gagal membaca Google Sheets:", error);
    throw error;
  }
}
