# 🚀 Panduan Import Data Faslabuh (Dermaga)

## 📋 Ringkasan

Fitur import data faslabuh memungkinkan Anda untuk mengimport data dermaga secara massal dari file Excel dengan kemampuan **UPSERT** (Update + Insert) yang cerdas.

## ✨ Fitur Utama

### 1. **Tiga Mode Import**
- ✅ **Upsert (Recommended)**: Otomatis tambah data baru atau update data existing berdasarkan nama dermaga
- ➕ **Insert Only**: Hanya tambah data baru, error jika nama dermaga sudah ada
- 🔄 **Update Only**: Hanya update data existing berdasarkan nama dermaga, skip data baru

### 2. **Preview & Validasi**
- 👁️ Preview data sebelum import
- ✅ Validasi otomatis format data
- ⚠️ Deteksi error dengan detail lengkap
- 📊 Statistik data yang akan diimport

### 3. **Progress Tracking**
- 📈 Real-time import progress
- 📊 Detail hasil: berapa ditambah, diupdate, gagal
- 🔍 Error log untuk debugging

### 4. **Template Excel**
- 📥 Download template dengan format yang benar
- 📝 Contoh data untuk referensi
- 💡 Mendukung hingga 5 jenis kapal sandar per dermaga

## 🎯 Cara Penggunaan

### Step 1: Download Template
1. Klik tombol **"📋 Export Template"**
2. Buka file Excel yang terdownload
3. Lihat baris 2 untuk contoh data
4. Mulai isi data dari baris 3

### Step 2: Isi Data Excel

Berikut adalah kolom-kolom yang tersedia:

#### A. Identitas & Lokasi
| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| **Provinsi** | ✅ | Nama provinsi lokasi dermaga |
| **Lokasi** | ✅ | Nama lokasi/pelabuhan |
| **Nama Dermaga** | ✅ | Nama dermaga (identifier unik) |
| **Konstruksi** | ❌ | Jenis konstruksi (Beton, Kayu, dll) |
| **Kode Barang** | ❌ | Kode barang aset (referensi ke master asset) |
| **No Sertifikat** | ❌ | Nomor sertifikat tanah |
| **Tgl Sertifikat** | ❌ | Tanggal sertifikat (format: YYYY-MM-DD) |
| **Longitude** | ❌ | Koordinat longitude (desimal) |
| **Latitude** | ❌ | Koordinat latitude (desimal) |

#### B. Dimensi & Kondisi
| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| **Panjang (m)** | ❌ | Panjang dermaga dalam meter |
| **Lebar (m)** | ❌ | Lebar dermaga dalam meter |
| **Draft LWL (m)** | ❌ | Kedalaman air saat Low Water Level |
| **Pasut HWL-LWL (m)** | ❌ | Selisih pasang surut |
| **Kondisi (%)** | ❌ | Kondisi dermaga dalam persen (0-100) |

#### C. Kemampuan Sandar (Hingga 5 Jenis Kapal)
| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| **Sandar Tipe 1-5** | ❌ | Jenis kapal (Fregat, Korvet, dll) |
| **Sandar Ton 1-5** | ❌ | Bobot kapal dalam ton |
| **Sandar Jumlah 1-5** | ❌ | Jumlah kapal yang bisa sandar |

**Contoh:**
- Sandar Tipe 1: Fregat, Ton: 5000, Jumlah: 2
- Sandar Tipe 2: Korvet, Ton: 2500, Jumlah: 3
- Sandar Tipe 3: Kapal Patroli, Ton: 1000, Jumlah: 4

#### D. Kemampuan Plat Lantai
| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| **Plat MST (ton)** | ❌ | Maximum Safe Tonnage plat lantai |
| **Plat Jenis Ranmor** | ❌ | Jenis kendaraan yang bisa melintas |
| **Plat Berat Max (ton)** | ❌ | Berat maksimum kendaraan |

#### E. Dukungan Listrik
| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| **Listrik Jml Titik** | ❌ | Jumlah titik listrik |
| **Listrik Kap (Amp)** | ❌ | Kapasitas dalam Ampere |
| **Listrik Tegangan (Volt)** | ❌ | Tegangan (220, 380, 440) |
| **Listrik Frek (Hz)** | ❌ | Frekuensi (50 atau 60) |
| **Listrik Sumber** | ❌ | Sumber (PLN, Genset, dll) |
| **Listrik Daya (kVA)** | ❌ | Daya dalam kVA |

#### F. Dukungan Air Tawar
| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| **Air GWT (m³)** | ❌ | Ground Water Tank dalam m³ |
| **Air Debit (m³/jam)** | ❌ | Debit air per jam |
| **Air Sumber** | ❌ | Sumber air (PDAM, Sumur, dll) |

#### G. BBM & Hydrant
| Kolom | Wajib | Keterangan |
|-------|-------|------------|
| **BBM** | ❌ | Jenis BBM tersedia |
| **Hydrant** | ❌ | Ketersediaan hydrant |
| **Keterangan** | ❌ | Catatan tambahan |

**⚠️ PENTING**: Kolom **Nama Dermaga** WAJIB diisi dan akan digunakan sebagai identifier untuk update data!

### Step 3: Upload & Preview
1. Klik **"📂 Import Excel"**
2. Pilih file Excel Anda
3. Pilih **Mode Import** sesuai kebutuhan
4. Klik **"👁️ Preview Data"** untuk melihat data yang akan diimport
5. Periksa apakah ada error validasi

### Step 4: Import ke Database
1. Jika tidak ada error, klik **"🚀 Import ke Database"**
2. Konfirmasi import
3. Tunggu proses selesai
4. Lihat hasil import (berapa data ditambah/diupdate/gagal)

## 🔧 Mode Import - Kapan Menggunakan?

### 🎯 Mode: Upsert (Tambah & Update Otomatis)
**Gunakan Untuk:**
- Import rutin/berkala
- Update data existing + tambah data baru sekaligus
- Sinkronisasi data dari sistem lain

**Cara Kerja:**
```
Jika Nama Dermaga sudah ada → UPDATE data
Jika Nama Dermaga belum ada → INSERT data baru
```

**Contoh Skenario:**
```
Database: Dermaga A, Dermaga B
Excel: Dermaga A (update), Dermaga C (baru)
Hasil: Dermaga A diupdate, Dermaga C ditambahkan
```

### ➕ Mode: Insert Only (Hanya Tambah Baru)
**Gunakan Untuk:**
- Import data baru pertama kali
- Mencegah overwrite data existing
- Memastikan tidak ada duplikasi

**Cara Kerja:**
```
Jika Nama Dermaga sudah ada → ERROR (skip)
Jika Nama Dermaga belum ada → INSERT data baru
```

### 🔄 Mode: Update Only (Hanya Update Existing)
**Gunakan Untuk:**
- Update massal data yang sudah ada
- Tidak ingin menambah data baru
- Koreksi data existing

**Cara Kerja:**
```
Jika Nama Dermaga sudah ada → UPDATE data
Jika Nama Dermaga belum ada → SKIP (diabaikan)
```

## 💡 Tips & Best Practices

### ✅ DO (Lakukan)
1. ✅ **Selalu gunakan Preview** sebelum import
2. ✅ **Backup data** sebelum import besar
3. ✅ **Gunakan mode Upsert** untuk fleksibilitas maksimal
4. ✅ **Pastikan Nama Dermaga konsisten** (format yang sama)
5. ✅ **Test dengan data kecil** dulu (5-10 baris)
6. ✅ **Cek hasil import** setelah selesai
7. ✅ **Gunakan format tanggal YYYY-MM-DD** untuk kolom tanggal
8. ✅ **Isi koordinat dengan desimal** (contoh: 106.8839, -6.1085)

### ❌ DON'T (Hindari)
1. ❌ **Jangan skip Preview** - bisa menyebabkan data salah
2. ❌ **Jangan import tanpa backup** untuk data penting
3. ❌ **Jangan ubah header kolom** di template
4. ❌ **Jangan kosongkan kolom Nama Dermaga**
5. ❌ **Jangan gunakan format tanggal lain** selain YYYY-MM-DD
6. ❌ **Jangan isi koordinat dengan format DMS** (gunakan desimal)

## 🔄 Workflow Recommended

```
1. Download Template
   ↓
2. Isi Data di Excel
   ↓
3. Upload File
   ↓
4. Pilih Mode Import (Upsert recommended)
   ↓
5. Preview & Validasi
   ↓
6. Perbaiki Error (jika ada)
   ↓
7. Import ke Database
   ↓
8. Cek Hasil Import
   ↓
9. Verifikasi Data di Aplikasi
```

## 🎬 Contoh Skenario Real

### Skenario 1: Import Awal 10 Dermaga Baru
```
Mode: Insert Only atau Upsert
File: 10 baris data baru
Hasil: 10 dermaga ditambahkan
```

### Skenario 2: Update Bulanan
```
Mode: Upsert
File: 15 baris (10 existing + 5 baru)
Hasil: 10 dermaga diupdate, 5 dermaga ditambahkan
```

### Skenario 3: Koreksi Data Massal
```
Mode: Update Only
File: 8 baris data existing
Hasil: 8 dermaga diupdate, data baru diabaikan
```

### Skenario 4: Import dengan Error
```
Mode: Upsert
File: 12 baris (2 error validasi)
Hasil: 10 dermaga berhasil, 2 gagal
Error ditampilkan dengan detail baris dan penyebab
```

## 🛠️ Troubleshooting

### Problem: Import Gagal Semua
**Kemungkinan Penyebab:**
- Database tidak terhubung
- Format Excel salah
- Semua data tidak valid

**Solusi:**
1. Cek koneksi database (lihat console)
2. Download ulang template
3. Cek preview untuk melihat error

### Problem: Sebagian Data Gagal
**Kemungkinan Penyebab:**
- Validasi gagal untuk beberapa baris
- Duplikat di mode Insert Only
- Format data tidak sesuai

**Solusi:**
1. Lihat detail error di hasil import
2. Perbaiki data yang error
3. Import ulang hanya data yang gagal

### Problem: Data Tidak Muncul Setelah Import
**Kemungkinan Penyebab:**
- Kolom Nama Dermaga kosong
- Data masuk tapi tidak ter-refresh

**Solusi:**
1. Pastikan kolom Nama Dermaga terisi
2. Refresh halaman
3. Cek di tabel faslabuh

## 🗑️ Delete All Data

Fitur **Delete All** tersedia untuk menghapus semua data faslabuh sekaligus.

**⚠️ PERINGATAN:**
- Proses ini **TIDAK BISA** dibatalkan!
- Semua data dermaga akan dihapus permanen
- Gunakan dengan sangat hati-hati
- Pastikan sudah backup data sebelumnya

**Cara Menggunakan:**
1. Klik tombol **"🗑️ Delete All"**
2. Konfirmasi pertama
3. Konfirmasi kedua (terakhir)
4. Data terhapus

## 📞 Support

Jika mengalami masalah:
1. Cek dokumentasi ini
2. Lihat console browser untuk error log
3. Hubungi admin sistem

## 🔐 Keamanan

- ✅ Semua import menggunakan **transaction** - jika ada error, semua rollback
- ✅ Validasi di frontend dan backend
- ✅ Tidak ada SQL injection risk (menggunakan prepared statements)
- ✅ Log semua aktivitas import

## 📈 Performance

- ⚡ Batch processing untuk import cepat
- 📊 Optimized untuk ratusan data
- 🔄 Transaction untuk konsistensi data
- 💾 Minimal memory footprint

---

**Dibuat dengan ❤️ untuk kemudahan import data faslabuh NEXIS-3 Jakarta**
