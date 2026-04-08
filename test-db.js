const pool = require('./config/db');

async function testConnection() {
    try {
        const [rows] = await pool.execute('SELECT 1 + 1 AS result');
        console.log('✅ CONEXÃO COM O BANCO OK! Resultado:', rows[0].result);
        
        const [users] = await pool.execute('SELECT email FROM usuarios');
        console.log('✅ USUÁRIOS NO BANCO:', users);
        
        process.exit(0);
    } catch (err) {
        console.error('❌ ERRO DE CONEXÃO:');
        console.error('Mensagem:', err.message);
        console.error('Código:', err.code);
        console.error('Verifique se o MySQL está rodando e se o usuário/senha no .env estão corretos.');
        process.exit(1);
    }
}

testConnection();
