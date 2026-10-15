# SQDT Problem Management Dashboard — Dark Mode

Dashboard ini disesuaikan dengan kolom pada file `SQM Problem Management Dashboard.xlsx`:
`SQDT`, `SEVERITY`, `Status`, `BRANCH / NODE`, `KABUPATEN`, `REGION`, `CIRCLE`, `RCA`, `MTTR`, `MTTD 1 (terhadap Initial Posting)`, `TRAFFIC LOSS (TB) TOTAL`, `Achievement CESO`.

## Hubungkan ke Google Sheets
1. Import workbook Excel Anda ke Google Sheets.
2. Pastikan baris pertama adalah header kolom tersebut.
3. Pilih **File → Share → Publish to web**. Pilih tab raw data dan format **Comma-separated values (.csv)**, lalu klik Publish.
4. Salin URL CSV hasil publikasi.
5. Edit `index.html`, cari `const GOOGLE_SHEETS_CSV_URL="PASTE_GOOGLE_SHEETS_CSV_URL_HERE";` dan ganti placeholder dengan URL CSV Anda.
6. Upload `index.html` ke root repository GitHub.
7. Buka **Settings → Pages → Deploy from a branch**, pilih branch `main` dan folder `/(root)`, lalu Save.

## Catatan
- Publikasi CSV membuat tab yang dipilih dapat diakses publik. Jangan lakukan jika data incident bersifat rahasia.
- Tanggal trend diekstrak dari ID `SQDT-YYYYMMDD-...`; jika format ID berbeda, trend untuk baris tersebut tidak akan terplot.
- MTTR diolah sebagai angka untuk menghitung rata-rata; jika format desimal data menggunakan koma, dashboard mencoba mengubahnya.
- Open vs Closed menganggap status berisi CLOSED/CLOSE/RESOLVED/COMPLETE sebagai Closed; status lain dianggap Open.
- Dashboard mengambil data dari Google Sheets saat dibuka, tombol Refresh ditekan, dan otomatis setiap 15 menit.
