import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

/**
 * Master Asset Utama - Menampilkan daftar asset utama
 */
function MasterAssetUtama() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null);

    const loadMasterData = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/master-asset-utama');
            if (res.ok) {
                const data = await res.json();
                setAssets(data);
            } else {
                console.error("Failed to load Master Asset Utama: HTTP", res.status);
                setAssets([]);
            }
        } catch (err) {
            console.error("Gagal load Master Asset Utama:", err);
            setAssets([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMasterData();
    }, []);

    // Format currency
    const formatCurrency = (value) => {
        if (!value && value !== 0) return '-';
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(num);
    };

    // Format number
    const formatNumber = (value) => {
        if (!value && value !== 0) return '-';
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        return new Intl.NumberFormat('id-ID').format(num);
    };

    // Consistent font families
    const FONT_SYSTEM = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    const FONT_MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

    const columns = [
        { key: 'no', label: 'No', width: 50, align: 'center' },
        { key: 'jenis_bmn', label: 'Jenis BMN', width: 120 },
        { key: 'kode_satker', label: 'Kode Satker', width: 120, type: 'code' },
        { key: 'nama_satker', label: 'Nama Satker', width: 200 },
        { key: 'kode_barang', label: 'Kode Barang', width: 140, type: 'code' },
        { key: 'nup', label: 'NUP', width: 80, type: 'code' },
        { key: 'tanggal_penghapusan', label: 'Tanggal Penghapusan', width: 150, align: 'center' },
        { key: 'nilai_perolehan_pertama', label: 'Nilai Perolehan Pertama', width: 180, align: 'right', format: 'currency', type: 'currency' },
        { key: 'nilai_mutasi', label: 'Nilai Mutasi', width: 140, align: 'right', format: 'currency', type: 'currency' },
        { key: 'nilai_perolehan', label: 'Nilai Perolehan', width: 160, align: 'right', format: 'currency', type: 'currency' },
        { key: 'nilai_penyusutan', label: 'Nilai Penyusutan', width: 160, align: 'right', format: 'currency', type: 'currency' },
        { key: 'nilai_buku', label: 'Nilai Buku', width: 160, align: 'right', format: 'currency', type: 'currency' },
        { key: 'luas_tanah_seluruhnya', label: 'Luas Tanah Seluruhnya', width: 180, align: 'right', format: 'number', type: 'number' },
        { key: 'luas_tanah_bangunan', label: 'Luas Tanah Untuk Bangunan', width: 220, align: 'right', format: 'number', type: 'number' },
        { key: 'luas_tanah_sarana', label: 'Luas Tanah Untuk Sarana Lingkungan', width: 260, align: 'right', format: 'number', type: 'number' },
        { key: 'luas_lahan_kosong', label: 'Luas Lahan Kosong', width: 180, align: 'right', format: 'number', type: 'number' },
        { key: 'luas_bangunan', label: 'Luas Bangunan', width: 150, align: 'right', format: 'number', type: 'number' },
        { key: 'luas_tapak_bangunan', label: 'Luas Tapak Bangunan', width: 180, align: 'right', format: 'number', type: 'number' },
        { key: 'luas_pemanfataan', label: 'Luas Pemanfataan', width: 160, align: 'right', format: 'number', type: 'number' },
        { key: 'kelurahan_desa', label: 'Kelurahan/Desa', width: 180 },
        { key: 'kecamatan', label: 'Kecamatan', width: 150 },
        { key: 'kab_kota', label: 'Kab/Kota', width: 150 },
        { key: 'kode_kab_kota', label: 'Kode Kab/Kota', width: 140, type: 'code' },
        { key: 'provinsi', label: 'Provinsi', width: 150 },
        { key: 'kode_provinsi', label: 'Kode Provinsi', width: 140, type: 'code' },
        { key: 'kode_pos', label: 'Kode Pos', width: 100, type: 'code' },
        { key: 'sbsk', label: 'SBSK', width: 120 },
        { key: 'optimalisasi', label: 'Optimalisasi', width: 150 },
        { key: 'penghuni', label: 'Penghuni', width: 150 },
        { key: 'pengguna', label: 'Pengguna', width: 150 },
        { key: 'kode_kpknl', label: 'Kode KPKNL', width: 120, type: 'code' },
        { key: 'uraian_kpknl', label: 'Uraian KPKNL', width: 200 },
        { key: 'uraian_kanwil_djkn', label: 'Uraian Kanwil DJKN', width: 220 },
        { key: 'nama_kl', label: 'Nama K/L', width: 150 },
        { key: 'nama_e1', label: 'Nama E1', width: 150 },
        { key: 'nama_korwil', label: 'Nama Korwil', width: 150 },
        { key: 'kode_register', label: 'Kode Register', width: 120, type: 'code' },
        { key: 'lokasi_ruang', label: 'Lokasi Ruang', width: 150 },
        { key: 'jenis_identitas', label: 'Jenis Identitas', width: 120 },
        { key: 'no_identitas', label: 'No Identitas', width: 150, type: 'code' },
        { key: 'no_stnk', label: 'No STNK', width: 120, type: 'code' },
        { key: 'nama_pengguna', label: 'Nama Pengguna', width: 150 },
        { key: 'status_pmk', label: 'Status PMK', width: 120 },
        { key: 'longitude', label: 'Longitude', width: 130, align: 'right', type: 'code' },
        { key: 'latitude', label: 'Latitude', width: 130, align: 'right', type: 'code' },
    ];

    const getCellValue = (asset, col, index) => {
        if (col.key === 'no') return index + 1;
        let value = asset[col.key];

        if (!value && value !== 0) return '-';

        if (col.format === 'currency') return formatCurrency(value);
        if (col.format === 'number') return formatNumber(value);

        return String(value);
    };

    const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

    const handleExportExcel = () => {
        try {
            // Build rows using defined column order & labels
            const headerRow = columns
                .filter(col => col.key !== 'no')
                .map(col => col.label);

            const dataRows = assets.map(asset =>
                columns
                    .filter(col => col.key !== 'no')
                    .map(col => {
                        const val = asset[col.key];
                        if (val === undefined || val === null || val === '') return '';
                        return val;
                    })
            );

            const worksheetData = [headerRow, ...dataRows];
            const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Master Aset Utama');
            XLSX.writeFile(workbook, 'Master_Aset_Utama.xlsx');
        } catch (error) {
            console.error('Export Excel failed:', error);
            alert('Gagal mengekspor Excel: ' + error.message);
        }
    };

    const handleImportExcel = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const data = new Uint8Array(evt.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const wsname = workbook.SheetNames[0];
                const ws = workbook.Sheets[wsname];
                const jsonData = XLSX.utils.sheet_to_json(ws, { defval: '' });

                if (jsonData && jsonData.length > 0) {
                    const labelToKey = {};
                    columns.forEach(col => { labelToKey[col.label] = col.key; });

                    const mappedData = jsonData.map((row) => {
                        const entry = {};
                        Object.keys(row).forEach(header => {
                            const key = labelToKey[header] || header.toLowerCase().replace(/ /g, '_');
                            entry[key] = row[header];
                        });
                        return entry;
                    });

                    // Prompt Mode Import
                    const modeAman = window.confirm(
                        "PILIH MODE IMPORT:\n\n" +
                        "▶ [OK] = UPDATE / LENGKAPI\nSistem otomatis mendeteksi data duplikat dan menyesuaikannya dengan info Excel baru. Data yang belum ada akan ditambahkan otomatis. Data lama lainnya tidak hilang.\n\n" +
                        "▶ [CANCEL] = GANTI TOTAL (REPLACE ALL)\nAkan menghapus total seluruh data DB, digantikan murni dari Excel ini."
                    );
                    
                    let importMode = 'upsert';
                    if (!modeAman) {
                        const yakinkanMode = window.confirm(
                            "⛔ PERINGATAN BAHAYA!\n\nAnda memilih GANTI TOTAL (REPLACE ALL).\n" +
                            "Semua data Master Aset Utama di database akan dihapus permanen!\n\nLanjutkan penghapusan ekstrim ini?"
                        );
                        if (!yakinkanMode) {
                            e.target.value = null;
                            return;
                        }
                        importMode = 'replace';
                    }

                    setLoading(true);

                    // If REPLACE MODE: Delete ALL first
                    if (importMode === 'replace') {
                        try {
                            const delRes = await fetch('/api/master-asset-utama', { method: 'DELETE' });
                            if (delRes.ok) {
                                console.log("Database reset (TRUNCATE) success.");
                            } else {
                                const errText = await delRes.text();
                                console.error("Failed to truncate:", delRes.status, errText);
                                alert('⚠️ Gagal menghapus data lama. Import dibatalkan.\n' + errText);
                                setLoading(false);
                                return;
                            }
                        } catch (err) {
                            console.error("Failed to delete old db:", err);
                            alert('⚠️ Gagal menghapus data lama: ' + err.message);
                            setLoading(false);
                            return;
                        }
                    }

                    // Bulk upsert all data to unified table
                    try {
                        const res = await fetch('/api/master-asset-utama/bulk-upsert', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ assets: mappedData, mode: importMode === 'replace' ? 'insert' : 'upsert' })
                        });

                        if (!res.ok) {
                            const errText = await res.text();
                            console.error('Bulk upsert failed:', res.status, errText);
                            alert(`❌ Import gagal (HTTP ${res.status}):\n${errText}`);
                            setLoading(false);
                            await loadMasterData();
                            return;
                        }

                        const result = await res.json();
                        const totalInserted = result.inserted || 0;
                        const totalUpdated = result.updated || 0;
                        const totalErrors = result.failed || 0;

                        alert(`✅ Proses Import Selesai!\n• Data Baru Ditambahkan: ${totalInserted}\n• Data Terupdate/Terlengkapi: ${totalUpdated}\n• Gagal: ${totalErrors}\n\nSilakan refresh tabel untuk melihat hasil.`);
                    } catch (err) {
                        console.error('Import request failed:', err);
                        alert('❌ Import gagal: ' + err.message);
                    }

                    await loadMasterData();
                } else {
                    alert('File Excel kosong atau tidak ada data yang dapat dibaca.');
                }
            } catch (err) {
                console.error('Import Excel failed:', err);
                alert('❌ Gagal membaca file Excel: ' + err.message);
                setLoading(false);
            }
        };
        reader.onerror = () => { alert('Gagal membaca file!'); };
        reader.readAsArrayBuffer(file);
        e.target.value = null;
    };

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF({ orientation: 'landscape', format: 'a2' });

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Data Master Aset Utama', 14, 14);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })}`, 14, 21);

            const tableColumn = columns.map(col => col.label);
            const tableRows = assets.map((asset, index) =>
                columns.map(col => {
                    if (col.key === 'no') return index + 1;
                    const val = asset[col.key];
                    if (val === undefined || val === null || val === '') return '-';
                    if (col.format === 'currency') return formatCurrency(val);
                    if (col.format === 'number') return formatNumber(val);
                    return String(val);
                })
            );

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 26,
                styles: { fontSize: 5.5, cellPadding: 1.5, overflow: 'linebreak', font: 'helvetica' },
                headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold', fontSize: 6 },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                columnStyles: { 0: { halign: 'center', cellWidth: 12 } },
                margin: { top: 26, left: 10, right: 10 }
            });

            doc.save('Master_Aset_Utama.pdf');
        } catch (error) {
            console.error('Export PDF failed:', error);
            alert('❌ Gagal mengekspor PDF: ' + error.message);
        }
    };

    return (
        <div className="fade-in" style={{ fontFamily: FONT_SYSTEM, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '20px', padding: '16px 20px', background: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Master Aset Utama</h1>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '4px' }}>Daftar lengkap aset utama dengan informasi teknis, finansial, dan administratif.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'pulse 2s infinite' }}>⏳</div>
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Memuat data aset utama...</p>
                    <style>{`@keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }`}</style>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Summary Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'white',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.25rem' }}>📊</span>
                            <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                                Total: <strong style={{ color: '#0f172a' }}>{assets.length}</strong> Aset Utama
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input 
                                type="file" 
                                accept=".xlsx, .xls" 
                                style={{ display: 'none' }} 
                                ref={fileInputRef}
                                onChange={handleImportExcel}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                style={{
                                    background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px',
                                    padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer',
                                    color: '#334155', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px'
                                }}
                            >
                                📥 Import Excel
                            </button>
                            <button
                                onClick={handleExportExcel}
                                style={{
                                    background: '#10b981', border: 'none', borderRadius: '6px',
                                    padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer',
                                    color: 'white', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px',
                                    boxShadow: '0 1px 2px rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                📊 Export Excel
                            </button>
                            <button
                                onClick={handleExportPDF}
                                style={{
                                    background: '#ef4444', border: 'none', borderRadius: '6px',
                                    padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer',
                                    color: 'white', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px',
                                    boxShadow: '0 1px 2px rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                📄 Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            overflowX: 'auto',
                            overflowY: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            flex: 1
                        }}>
                            <table style={{
                                minWidth: `${totalWidth}px`,
                                borderCollapse: 'collapse',
                                width: 'max-content',
                                tableLayout: 'fixed'
                            }}>
                                <thead>
                                    <tr>
                                        {columns.map((col) => (
                                            <th
                                                key={col.key}
                                                style={{
                                                    width: `${col.width}px`,
                                                    minWidth: `${col.width}px`,
                                                    padding: '12px 10px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    fontFamily: FONT_SYSTEM,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.05em',
                                                    color: '#f8fafc',
                                                    background: '#1e293b',
                                                    textAlign: col.align || 'left',
                                                    position: 'sticky',
                                                    top: 0,
                                                    zIndex: 10,
                                                    borderBottom: '3px solid #0f172a',
                                                    whiteSpace: 'nowrap',
                                                    verticalAlign: 'middle'
                                                }}
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {assets.map((asset, index) => (
                                        <tr
                                            key={asset.id}
                                            style={{
                                                background: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                                                transition: 'background 0.2s',
                                                borderBottom: '1px solid #e2e8f0'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#f1f5f9';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = index % 2 === 0 ? '#ffffff' : '#f8fafc';
                                            }}
                                        >
                                            {columns.map((col) => {
                                                const cellValue = getCellValue(asset, col, index);
                                                const isMonospace = col.type === 'code' || col.type === 'currency' || col.type === 'number';

                                                return (
                                                    <td
                                                        key={col.key}
                                                        style={{
                                                            width: `${col.width}px`,
                                                            minWidth: `${col.width}px`,
                                                            padding: '10px',
                                                            fontSize: '0.8rem',
                                                            fontFamily: isMonospace ? FONT_MONO : FONT_SYSTEM,
                                                            color: '#334155',
                                                            textAlign: col.align || 'left',
                                                            verticalAlign: 'middle',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {col.type === 'currency' ? (
                                                            <span style={{ fontWeight: '500', color: '#0f172a' }}>
                                                                {cellValue}
                                                            </span>
                                                        ) : (
                                                            cellValue
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                    {assets.length === 0 && (
                                        <tr>
                                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                                                Data tidak tersedia
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MasterAssetUtama;
