/**
 * MIGRASI DATABASE → SUPABASE
 * Jalankan dengan: node database/migrate_to_supabase.cjs
 * Script ini membuat semua tabel di Supabase secara idempoten (IF NOT EXISTS)
 */

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const log = (msg) => console.log(msg);
const ok  = (msg) => console.log('  ✅ ' + msg);
const err = (msg) => console.error('  ❌ ' + msg);

async function run(client, sql, label) {
    try {
        await client.query(sql);
        ok(label);
    } catch (e) {
        err(`${label}: ${e.message}`);
    }
}

async function migrate() {
    const client = await pool.connect();
    try {
        // Test koneksi
        const now = await client.query('SELECT NOW()');
        log('\n🔗 Terhubung ke Supabase: ' + now.rows[0].now);
        log('──────────────────────────────────────────');

        const schema = await import('./schema.js');
        await schema.ensureAllTables(client);

        // ─── VERIFIKASI AKHIR ────────────────────────────────────
        log('\n──────────────────────────────────────────');
        log('📋 Verifikasi tabel yang berhasil dibuat:\n');
        const tablesResult = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        `);
        tablesResult.rows.forEach(row => {
            console.log('   ✔ ' + row.table_name);
        });

        log('\n──────────────────────────────────────────');
        log('🎉 Migrasi ke Supabase SELESAI!\n');

    } catch (e) {
        err('Fatal error: ' + e.message);
        console.error(e);
    } finally {
        client.release();
        await pool.end();
    }
}

migrate();
