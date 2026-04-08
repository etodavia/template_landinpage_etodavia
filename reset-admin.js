const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

async function reset() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '',
        database: process.env.DB_NAME || 'arque_gestao',
        port: process.env.DB_PORT || 3306
    });

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('Et.123654*', salt);

        console.log('⏳ Atualizando usuário administrador...');
        
        // Remove se existir e cria de novo para garantir
        await connection.query('DELETE FROM usuarios WHERE email = "admin@teste.com"');
        await connection.query('INSERT INTO usuarios (nome, email, senha, nivel) VALUES (?, ?, ?, ?)', 
            ['Admin ARQUÊ', 'admin@teste.com', hash, 'admin']
        );

        console.log('✅ SENHA RESETADA COM SUCESSO!');
        console.log('👉 E-mail: admin@teste.com');
        console.log('👉 Senha: Et.123654*');
        console.log('🚀 Pode tentar o login novamente agora!');
        process.exit(0);
    } catch (err) {
        console.error('❌ ERRO AO RESETAR:', err.message);
        process.exit(1);
    }
}

reset();
