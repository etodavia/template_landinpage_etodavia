const pool = require('./config/db');

async function debug() {
    try {
        const [rows] = await pool.execute('SELECT * FROM usuarios');
        console.log('--- USUÁRIOS NO BANCO ---');
        console.log(rows);
        
        if (rows.length === 0) {
            console.log('⚠️ Nenhum usuário encontrado. Criando admin padrão...');
            const bcrypt = require('bcryptjs');
            const hashed = await bcrypt.hash('Et.123654*', 10);
            await pool.execute('INSERT INTO usuarios (id, nome, email, senha) VALUES (1, "Admin Arquê", "admin@teste.com", ?)', [hashed]);
            console.log('✅ Admin criado.');
        } else {
            console.log('✅ Usuário encontrado com ID:', rows[0].id);
        }
        process.exit(0);
    } catch (err) {
        console.error('❌ ERRO:', err);
        process.exit(1);
    }
}

debug();
