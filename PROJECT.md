// PROJECT WEBSITE
Saya mau website ini dijalankan menggunakan framework Nextjs 
untuk tampilan dashboard (client) saya ingin sederhana saja seperti website https://api.betabotz.eu.org/profile tampilan yang sederhana namun moderen seperti menggunakan php

// SISTEM 
User memilih kategori layanan dari form pemesanan -> user diminta memasukan query/target yang ingin dicari -> tampilkan harga layanan (3 token) dan (5 token untuk layanan cari wajah) -> User submit form -> sistem memproses permintaan dan mengirimkan data result dari API ke user dengan format yang rapi

// HARGA TOKEN & Rules
1 Token = Rp2.500 dengan Rules minimal pembelian 5 Token


// PAYMENT GATEWAY 
Payment Gateway ambil dari Pakasir QRIS Only
API KEy : bZSgVa8RdQmb25dYMn4t5aety7U0QNps
Slug : vanness-store

B.2. Opsi: Hanya QRIS
Untuk mengaktifkan hanya QRIS, sehingga pengunjung langsung melihat QR code dan tidak bisa mengubah ke metode pembayaran lain.

Tambahkan qris_only=1 pada URL.

https://app.pakasir.com/pay/depodomain/22000?order_id=240910HDE7C9&qris_only=1
C. Integrasi Via API
Disini Anda membutuhkan API Key yang terdapat di halaman detail Proyek.

C.1. Penjelasan
Integrasi via API, artinya kami akan mengirimkan detail berikut:

QR string atau nomor Virtual Account
Total Pembayaran
Waktu kadaluarsa (Expired)
Untuk menampilkan Kode QR atau Nomor Virtual Account dan Nominal kepada pengguna, menjadi tanggung jawab Anda. Anda bisa menggunakan library yang mengubah QR string menjadi gambar.

C.2. API: Transaction create
Method: POST
URL: https://app.pakasir.com/api/transactioncreate/{method}
Body (JSON):
{
    "project": "depodomain",
    "order_id": "INV123123",
    "amount": 99000,
    "api_key": "xxx123"
}
Contoh penggunaannya dengan CURL:

curl -L 'https://app.pakasir.com/api/transactioncreate/qris' \
-H 'Content-Type: application/json' \
-d '{
    "project": "depodomain",
    "order_id": "INV123123",
    "amount": 99000,
    "api_key": "xxx123"
}'
Untuk responsenya kurang lebih seperti berikut:

{
    "payment": {
        "project": "depodomain",
        "order_id": "INV123123",
        "amount": 99000,
        "fee": 1003,
        "total_payment": 100003,
        "payment_method": "qris",
        "payment_number": "00020101021226610016ID.CO.SHOPEE.WWW01189360091800216005230208216005230303UME51440014ID.CO.QRIS.WWW0215ID10243228429300303UME5204792953033605409100003.005802ID5907Pakasir6012KAB. KEBUMEN61055439262230519SP25RZRATEQI2HQ65Q46304A079",
        "expired_at": "2025-09-19T01:18:49.678622564Z"
    }
}
C.3. Pilihan Payment Method
cimb_niaga_va
bni_va
qris
sampoerna_va
bnc_va
maybank_va
permata_va
atm_bersama_va
artha_graha_va
bri_va
C.4. API: Payment simulation
Jika proyek Anda masih di mode Sandbox, Anda dapat lakukan simulasi pembayaran untuk mengetes webhook.

Method: POST
URL: https://app.pakasir.com/api/paymentsimulation
Body (JSON):
{
    "project": "depodomain",
    "order_id": "INV123123",
    "amount": 99000,
    "api_key": "xxx123"
}
Contoh penggunaannya dengan CURL:

curl -L 'https://app.pakasir.com/api/paymentsimulation' \
-H 'Content-Type: application/json' \
-d '{
    "project": "depodomain",
    "order_id": "INV123123",
    "amount": 99000,
    "api_key": "xxx123"
}'
C.5. API: Transaction Cancel
Anda dapat membatalkan transaksi jika memang dibutuhkan. Silakan gunakan API berikut untuk melakukannya:

Method: POST
URL: https://app.pakasir.com/api/transactioncancel
Body (JSON):
{
    "project": "depodomain",
    "order_id": "INV123123",
    "amount": 99000,
    "api_key": "xxx123"
}
Contoh penggunaannya dengan CURL:

curl -L 'https://app.pakasir.com/api/transactioncancel' \
-H 'Content-Type: application/json' \
-d '{
    "project": "depodomain",
    "order_id": "INV123123",
    "amount": 99000,
    "api_key": "xxx123"
}'
D. Webhook
Ketika pelanggan berhasil melakukan pembayaran dan dana masuk ke sistem kami, maka kami akan memberitahukan sistem Anda melalui webhook.

Kami akan mengirimkan http POST dengan struktur body sebagai berikut:

{
  "amount": 22000,
  "order_id": "240910HDE7C9",
  "project": "depodomain",
  "status": "completed",
  "payment_method": "qris",
  "completed_at": "2024-09-10T08:07:02.819+07:00"
}
Untuk menerima webhook tersebut, silakan isi Webhook URL pada proyek Anda (yaitu melalui form Edit Proyek).

Penting: Saat menerima webhook pastikan amount dan order_id sesuai dengan transaksi di sistem Anda. Kami sarankan untuk tetap menggunakan API dibawah ini untuk pengecekan status yang lebih valid.

E. Transaction Detail API
Untuk mengetahui status sebuah transaksi Anda bisa lakukan melalui API ini. Disini Anda membutuhkan API Key yang terdapat di halaman detail Proyek.

Berikut ini adalah API yang bisa Anda panggil:

GET https://app.pakasir.com/api/transactiondetail?project={slug}&amount={amount}&order_id={order_id}&api_key={api_key}
Contoh penggunaan yang benar dengan CURL:

curl https://app.pakasir.com/api/transactiondetail?project=depodomain&amount=22000&order_id=240910HDE7C9&api_key=JHGejwhe237dkhjeukyw8e33
Untuk response yang akan Anda dapatkan kurang lebih seperti berikut:

{
  "transaction": {
    "amount": 22000,
    "order_id": "240910HDE7C9",
    "project": "depodomain",
    "status": "completed",
    "payment_method": "qris",
    "completed_at": "2024-09-10T08:07:02.819+07:00"
  }
}

// LOGIN
user diwajibkan register dan login untuk mengakses Dashboard website 
login wajib (username/email & password strong)
register wajib username + email + no hp (62xxx) + password strong

// DASHBOARD ADMIN (hanya admin) https://domain.my.id/ekhem (agar tidak mudah ditebak)
Username : pannessaja
Password : pannessaja56
Sidebar berisikan :
- Dashboard (total user, total transaksi, total saldo)
- Manage User 
- Generate Voucher 
- Laporan (pdf)


// DASHBOARD USER https://domain.my.id

Referensi Tema dan desain seperti ada pada image.png


// FIRUR API DAN DOKUMENTASI

API KEY : 1517ace02ee44427a75eec756cfdc700
Dokumentasi :

1. CEK NIK
GET
/api/cek_nik?nik={nik}&key={api_key}
Pencarian data kependudukan berdasarkan NIK dari Dukcapil. Mengembalikan data lengkap termasuk nama, tanggal lahir, alamat dengan RT/RW, kelurahan, kecamatan, kabupaten, dan provinsi.

Parameter
Param	Tipe	Keterangan
nik	string	NIK 16 digitrequired
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "data": {
    "nik": "3275XXXXXXXXXXXX",
    "nama_lengkap": "BUDI S*****",
    "tanggal_lahir": "1990-01-01",
    "jenis_kelamin": "LAKI-LAKI",
    "jenis_kelamin_id": "1",
    "alamat": "JL. C***** NO.** RT * RW *",
    "no_rt": 3,
    "no_rw": 5,
    "kelurahan": "KELURAHAN C*****",
    "kelurahan_id": "XXXXX",
    "kelurahan_id_text": "Kelurahan C*****",
    "kode_kelurahan": 1001,
    "kecamatan": "KECAMATAN C*****",
    "kecamatan_id": "XXXX",
    "kecamatan_id_text": "Kecamatan C*****",
    "kode_kecamatan": 4,
    "kabupaten": "KOTA ADM. JAKARTA SELATAN",
    "kabupaten_id": "XXX",
    "kabupaten_id_text": "Jakarta Selatan",
    "kode_kabupaten": 74,
    "provinsi": "DKI JAKARTA",
    "provinsi_id": "XX",
    "provinsi_id_text": "Daerah Khusus Jakarta",
    "kode_provinsi": 31
  }
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
3329014608860004
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/cek_nik?nik=%7Bnik%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);

2. CEK NIK + FOTO KTP
GET
/api/nikfoto?nik={nik}&key={api_key}
Pencarian data kependudukan disertai foto KTP dan family tree. Mengembalikan seluruh data pribadi beserta gambar dokumen base64 yang terdaftar di sistem pemerintah.

Parameter
Param	Tipe	Keterangan
nik	string	NIK 16 digitrequired
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "data": {
    "NIK": "357807XXXXXX0002",
    "NO_KK": "357807XXXXXX6345",
    "NAMA_LENGKAP": "INDRI*** ***",
    "JENIS_KELAMIN": "F",
    "TEMPAT_LAHIR": "YOGYAKARTA",
    "TANGGAL_LAHIR": "1971-02-01 00:00:00",
    "AGAMA": "KRISTEN",
    "GOL_DARAH": "O",
    "PENDIDIKAN": "SLTA / SEDERAJAT",
    "STATUS_PERNIKAHAN": "KAWIN",
    "PEKERJAAN": "MENGURUS RUMAH TANGGA",
    "STATUS_HUBUNGAN_KELUARGA": "ISTRI",
    "ALAMAT": "***",
    "RT": "***",
    "RW": "***",
    "KELURAHAN": "KETABANG",
    "KECAMATAN": "GENTENG",
    "KOTA": "KOTA SURABAYA",
    "PROVINSI": "JAWA TIMUR",
    "FOTO_KTP": "[base64 image string ~40KB]",
    "FAMILY_TREE": [
      {
        "NIK": "357807XXXXXX0002",
        "NO_KK": "357807XXXXXX6345",
        "NAMA_LENGKAP": "ANDREW F*** *** ***",
        "JENIS_KELAMIN": "M",
        "TEMPAT_LAHIR": "SURABAYA",
        "TANGGAL_LAHIR": "1994-02-10 00:00:00",
        "AGAMA": "KRISTEN",
        "GOL_DARAH": "-",
        "PENDIDIKAN": "SLTA / SEDERAJAT",
        "STATUS_PERNIKAHAN": "BELUM KAWIN",
        "PEKERJAAN": "PELAJAR / MAHASISWA",
        "STATUS_HUBUNGAN_KELUARGA": "ANAK"
      }
    ]
  },
  "tokens_remaining": 810
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
3329014608860004
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/nik_foto?nik=%7Bnik%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);

3. CEK DATA BOCOR
GET
/api/data-bocor?q={query}&key={api_key}
Pencarian kebocoran data berdasarkan nama, email, NIK, atau nomor HP dari ratusan sumber database publik yang terindeks.

Parameter
Param	Tipe	Keterangan
q	string	Nama, email, NIK, atau nomor HPrequired
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "total_hasil": 300,
  "total_sumber": 62,
  "data": [
    {
      "sumber": "000webhost",
      "jumlah": 1,
      "records": [
        {
          "AKU P": "125.xxx.xxx.xx",
          "Email": "m***@yahoo.co.id",
          "Kata sandi": "des***",
          "NickName": "Budi S***"
        }
      ],
      "info_bocor": "Sekitar Maret 2015, pemegang web 000WebHost gratis menderita kebocoran data. Hampir 15 juta catatan klien diungkapkan."
    },
    {
      "sumber": "AndroidLista",
      "jumlah": 1,
      "records": [
        {
          "Email": "sant***@gmail.com",
          "FullName": "Santoso ***",
          "NickName": "santo***",
          "RegDate": "2015-11-10 01:23:33"
        }
      ],
      "info_bocor": "Pada Juli 2021, di toko Android Spanyol Lista, terjadi kebocoran data yang mempengaruhi 6,6 juta pengguna."
    }
  ],
  "tokens_remaining": 98
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
3329014608860004
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/data_bocor?nik=%7Bnik%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);

4. CEK NAMA SESUAI DUKCAPIL
GET
/api/cek_nama?nama={nama}&key={api_key}
Pencarian berdasarkan nama lengkap dari database Dukcapil. Mengembalikan beberapa hasil beserta NIK, alamat, dan data kependudukan jika ditemukan lebih dari satu orang dengan nama yang sama.

Parameter
Param	Tipe	Keterangan
nama	string	Nama lengkap (min. 3 karakter)required
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "total": 1,
  "data": [
    {
      "nik": "357807XXXXXX0001",
      "nama": "JANICE P*** ***",
      "tanggal_lahir": "22-01-2008",
      "umur": "18 tahun",
      "jenis_kelamin": "Perempuan",
      "tempat_lahir": "SURABAYA",
      "pekerjaan": "Pelajar / Mahasiswa",
      "noKK": "357807XXXXXX6345",
      "alamat": "Kec. Genteng, Kota Surabaya, Jawa Timur",
      "nikMom": "",
      "nikDad": "",
      "rt": "***",
      "rw": "***",
      "kecamatan": "GENTENG",
      "kab_kota": "SURABAYA",
      "provinsi": "JAWA TIMUR"
    }
  ],
  "tokens_remaining": 98
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
Budi Santoso
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/cek_nama?nama=%7Bnama%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);

5. CEK PLAT NOMOR KENDARAAN
GET
/api/nopol?plat={plat}&key={api_key}
Pencarian data kendaraan berdasarkan plat nomor. Mengembalikan spesifikasi kendaraan, data pemilik terdaftar, nomor rangka/mesin, dan status pajak STNK.

Parameter
Param	Tipe	Keterangan
plat	string	Plat nomor kendaraanrequired
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "data": [
    {
      "plat": "D 1*** ***",
      "merk": "DATSUN",
      "tipe": "GO+PANCA T 1.2 M/T",
      "tahun": "2016",
      "warna": "PUTIH",
      "warnaTnkb": "HITAM",
      "cc": "1198",
      "rangka": "MHBJ***",
      "mesin": "HR12***",
      "bpkb": "N05***",
      "stnk": "",
      "apm": "",
      "tglDaftar": "2020-05-30 00:00:00.000000",
      "bbm": "BENSIN",
      "sumbu": "",
      "roda": "",
      "nama": "YANET K*** ***",
      "nik": "327304XXXXXX0001",
      "noKK": "",
      "pekerjaan": "",
      "alamat": "*** RT ** RW ** BANDUNG",
      "kota": "",
      "provinsi": "",
      "polda": "",
      "rtRw": "",
      "noHp": "",
      "email": "",
      "jenisKendaraan": "MB. PENUMPANG",
      "statusPajak": "",
      "tglPajakExp": "",
      "tglStnk": "",
      "jumlahPajak": "",
      "tglBayarPajak": "",
      "pkbPokok": "",
      "pkbDenda": ""
    }
  ],
  "tokens_remaining": 98
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
D1315AFJ
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/nopol?plat=%7Bplat%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);

6. NIK --> NOMOR KK
GET
/api/nik2kk?nik={nik}&key={api_key}
Mengambil Nomor Kartu Keluarga (No. KK) berdasarkan NIK dari database Dukcapil. Mengembalikan nokk, nama, tempat/tanggal lahir, dan jenis kelamin.

Parameter
Param	Tipe	Keterangan
nik	string	NIK 16 digitrequired
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "data": {
    "nik": "127703XXXXXXX006",
    "nokk": "127703XXXXXX0003",
    "nama": "JUL P*** B***",
    "tempat_lahir": "PEMATANG SIANTAR",
    "tanggal_lahir": "1977-07-07",
    "jenis_kelamin": "LAKI-LAKI"
  },
  "tokens_remaining": 95
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
3329014608860004
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/nik2kk?nik=%7Bnik%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);

7. CEK KARTU KELUARGA
GET
/api/kk?nokk={nokk}&key={api_key}
Pencarian seluruh data anggota kartu keluarga berdasarkan No. KK dari dua sumber Dukcapil (KK Lama & KK Terbaru). Mengembalikan kepala keluarga, seluruh anggota beserta data lengkap masing-masing.

Parameter
Param	Tipe	Keterangan
nokk	string	No. KK 16 digit (bukan NIK)required
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "data": {
    "kk_lama": [],
    "kk_terbaru": {
      "no_kk": "127703XXXXXX0003",
      "jumlah_anggota": 4,
      "kepala_keluarga": {
        "NIK": "127703XXXXXXX006",
        "NAMA_LENGKAP": "JUL P*** B***",
        "JENIS_KELAMIN": "M",
        "TEMPAT_LAHIR": "PEMATANG SIANTAR",
        "TANGGAL_LAHIR": "1977-07-07 00:00:00",
        "AGAMA": "ISLAM",
        "GOL_DARAH": "A",
        "PENDIDIKAN": "DIPLOMA IV / STRATA I",
        "STATUS_PERNIKAHAN": "KAWIN",
        "PEKERJAAN": "GURU",
        "STATUS_HUBUNGAN_KELUARGA": "KEPALA KELUARGA",
        "KELURAHAN": "BATUNADUA JAE",
        "KECAMATAN": "PADANGSIDIMPUAN BATUNADUA",
        "KOTA": "KOTA PADANGSIDIMPUAN",
        "PROVINSI": "SUMATERA UTARA",
        "NAMA_LGKP_IBU": "A*** W*** W***",
        "NAMA_LGKP_AYAH": "K*** B***"
      },
      "anggota": [
        {
          "NIK": "127703XXXXXXX001",
          "NAMA_LENGKAP": "YENNI N*** A*** R***",
          "JENIS_KELAMIN": "F",
          "TANGGAL_LAHIR": "1986-12-16 00:00:00",
          "STATUS_HUBUNGAN_KELUARGA": "ISTRI",
          "KELURAHAN": "BATUNADUA JAE",
          "KECAMATAN": "PADANGSIDIMPUAN BATUNADUA",
          "KOTA": "KOTA PADANGSIDIMPUAN",
          "PROVINSI": "SUMATERA UTARA"
        }
      ]
    }
  },
  "tokens_remaining": 93
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
3300100605100003
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/kk?nokk=%7Bnokk%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);

8. CEK WAJAH 
GET
/api/fr?url={image_url}&key={api_key}
Mencocokkan wajah seseorang dari URL gambar dengan database kependudukan. Mengembalikan kandidat yang cocok beserta data identitas lengkap (NIK, nama, alamat, dll). Token dipotong hanya jika wajah ditemukan.

Tips gambar: Gunakan foto wajah yang jelas dan sudah di-crop (potong area wajah/kepala saja, jangan foto badan penuh). Upload foto ke imgbb.com untuk mendapatkan URL langsung berformat JPG/PNG, lalu masukkan URL tersebut ke parameter url.

Parameter
Param	Tipe	Keterangan
url	string	URL gambar wajah (http/https)required
key	string	API key Andarequired
Contoh Response
{
  "success": true,
  "total": 1,
  "data": [
    {
      "nama": "BUDI S*****",
      "nik": "3275XXXXXXXXXXXX",
      "tgl_lahir": "1990-05-15",
      "usia": "34",
      "jenis_kelamin": "LAKI-LAKI",
      "status_kawin": "KAWIN",
      "alamat": "JL. ME*****",
      "skor": "98.7"
    }
  ],
  "tokens_remaining": 75
}
Code Snippet
cURL
JavaScript
Python
API Key kamu...
https://example.com/photo.jpg
const res = await fetch("https://typically-bonus-ultram-appearance.trycloudflare.com/api/fr?url=%7Burl%7D&key=%7Bapi_key%7D");
const data = await res.json();
console.log(data);