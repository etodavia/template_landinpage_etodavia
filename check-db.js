const pool = require('./config/db');

async function testConnection() {
    try {
        const [rows] = await pool.execute('SELECT 1 + 1 AS result');
        console.log('✅ Conexão com o banco de dados bem-sucedida:', rows[0].result);
        process.exit(0);
    } catch (err) {
        console.error('❌ Erro de conexão com o banco de dados:', err.message);
        process.exit(1);
    }
}

testConnection();
