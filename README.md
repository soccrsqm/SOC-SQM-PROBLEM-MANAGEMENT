SQDT Problem Management Dashboard — Google Sheets API

1. Unggah index.html ke root repository GitHub Pages, ganti file lama.
2. Apps Script endpoint telah diatur di dalam index.html.
3. Apps Script doGet harus mengembalikan JSONP saat menerima parameter callback, dengan format {success:true, data:[{...}], updatedAt:"..."}.
4. Nama tab yang digunakan oleh Apps Script: SQM Problem Management 2025.
5. Dashboard mencoba memuat data saat dibuka, tombol Refresh data memuat ulang, dan refresh otomatis dilakukan setiap 15 menit.

Jika muncul error, buka URL endpoint dengan parameter callback contoh: ?callback=testCallback. Respons seharusnya berupa JavaScript testCallback({...});. Jika masih berupa JSON biasa atau menampilkan error deployment, deploy ulang Apps Script sebagai Web app dan pastikan endpoint /exec menggunakan versi terbaru.

Keamanan: endpoint yang bisa diakses publik dapat mengekspos data yang dikembalikannya. Jangan gunakan untuk data rahasia atau sensitif.
