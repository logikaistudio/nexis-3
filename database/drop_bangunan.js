import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'NEXIS-3',
    password: 'postgres',
    port: 5432,
});

async function dropBangunanTable() {
    try {
        console.log('🗑️  Menghapus tabel assets_bangunan...');

        // Drop the table
        await pool.query('DROP TABLE IF EXISTS assets_bangunan CASCADE');

        console.log('✅ Tabel assets_bangunan berhasil dihapus!');
        console.log('📊 Semua data aset bangunan telah dihapus dari database.');

    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await pool.end();
    }
}

dropBangunanTable()
    .then(() => {
        console.log('\n✨ Proses selesai!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Proses gagal:', error);
        process.exit(1);
    });
