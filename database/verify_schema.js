import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const requiredSchema = {
    roles: ['id', 'name', 'description', 'permissions', 'created_at', 'updated_at'],
    users: ['id', 'name', 'email', 'role', 'status', 'username', 'password', 'created_at', 'updated_at'],
    master_asset_folders: ['id', 'name', 'description', 'created_at', 'updated_at'],
    assets_tanah: ['id', 'code', 'name', 'folder_id', 'source_file', 'jenis_bmn', 'kode_barang', 'nup', 'nama_barang', 'kondisi', 'created_at', 'updated_at'],
    assets_bangunan: ['id', 'code', 'name', 'folder_id', 'source_file', 'created_at', 'updated_at'],
    assets_kapling: ['id', 'code', 'name', 'category', 'created_at', 'updated_at'],
    assets_rumneg: ['id', 'occupant_name', 'occupant_rank', 'occupant_nrp', 'created_at', 'updated_at'],
    assets_pemanfaatan: ['id', 'objek', 'pemanfaatan', 'created_at'],
    assets_diskes: ['id', 'name', 'type', 'location', 'status', 'created_at', 'updated_at'],
    faslabuh: ['id', 'nama_dermaga', 'fungsi_dermaga', 'longitude', 'latitude', 'fotos', 'created_at', 'updated_at'],
    master_asset_utama: ['id', 'unique_key', 'kode_barang', 'nup', 'nama_barang', 'created_at', 'updated_at'],
    supplies: ['id', 'code', 'name', ['stock', 'quantity'], 'unit', 'created_at', 'updated_at'],
    master_locations: ['id', 'code', 'name', 'type', 'created_at', 'updated_at'],
    master_officers: ['id', 'nrp', 'name', 'position', 'phone', 'created_at', 'updated_at'],
    master_units: ['id', 'code', 'name', 'type', 'created_at', 'updated_at'],
    departments: ['id', 'name', 'code', 'description', 'created_at', 'updated_at'],
    staff: ['id', 'name', 'nrp', 'rank', 'position', 'department_id', 'email', 'phone', 'created_at', 'updated_at'],
    tasks: ['id', 'title', 'status', 'created_by', 'assigned_to', 'created_at', 'updated_at']
};

async function verifyTableExists(client, tableName) {
    const result = await client.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1);`,
        [tableName]
    );
    return result.rows[0].exists;
}

async function verifyColumnExists(client, tableName, columnNameOrList) {
    if (Array.isArray(columnNameOrList)) {
        const result = await client.query(
            `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = ANY($2));`,
            [tableName, columnNameOrList]
        );
        return result.rows[0].exists;
    }

    const result = await client.query(
        `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = $1 AND column_name = $2);`,
        [tableName, columnNameOrList]
    );
    return result.rows[0].exists;
}

async function verifySchema() {
    const client = await pool.connect();
    console.log('🔗 Connecting to Supabase for schema verification...');

    const issues = [];
    const successes = [];

    try {
        for (const [table, columns] of Object.entries(requiredSchema)) {
            const exists = await verifyTableExists(client, table);
            if (!exists) {
                issues.push(`MISSING TABLE: ${table}`);
                continue;
            }
            successes.push(`Table ${table} exists.`);

            for (const column of columns) {
                const hasColumn = await verifyColumnExists(client, table, column);
                const label = Array.isArray(column) ? column.join(' or ') : column;
                if (!hasColumn) {
                    issues.push(`MISSING COLUMN: ${table}.${label}`);
                } else {
                    successes.push(`Column ${table}.${label} exists.`);
                }
            }
        }

        console.log('\n--- Verification Results ---');
        successes.forEach((msg) => console.log('✅ ' + msg));

        if (issues.length > 0) {
            console.log('\n❌ FOUND ISSUES:');
            issues.forEach((issue) => console.log('   - ' + issue));
            console.log('\n⚠️ Database structure is NOT fully synced with the canonical schema.');
        } else {
            console.log('\n✨ Database structure is fully synced with the canonical schema.');
        }
    } catch (error) {
        console.error('❌ Error verifying schema:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

verifySchema();
