const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'etodavia'
    });

    try {
        console.log('🔍 Checking columns...');
        const [rows] = await pool.execute('SHOW COLUMNS FROM configuracoes_globais');
        const columnNames = rows.map(r => r.Field);
        console.log('Columns found:', columnNames);

        const needed = ['benefits_icon_bg', 'benefits_icon_color', 'benefits_title_color', 'benefits_text_color'];
        for (const col of needed) {
            if (!columnNames.includes(col)) {
                console.log(`➕ Adding column ${col}...`);
                await pool.execute(`ALTER TABLE configuracoes_globais ADD COLUMN ${col} VARCHAR(50)`);
            }
        }
        console.log('✅ Columns checked and added if missing.');
    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        process.exit();
    }
}

check();
