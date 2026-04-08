const pool = require('./config/db');

async function migrate() {
    try {
        console.log('--- INICIANDO MIGRAÇÃO DE E-MAIL RESPOSTA ---');
        const queries = [
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS email_reply_contact TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS email_reply_newsletter TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS email_subject_contact VARCHAR(255)",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS email_subject_newsletter VARCHAR(255)"
        ];

        for (let query of queries) {
            try {
                await pool.execute(query);
                console.log(`✅ EXECUTADO: ${query.substring(0, 50)}...`);
            } catch (e) {
                console.log(`⚠️ JÁ EXISTE OU ERRO: ${query.substring(0, 50)}...`);
            }
        }
        console.log('--- MIGRAÇÃO CONCLUÍDA ---');
        process.exit(0);
    } catch (err) {
        console.error('❌ ERRO:', err);
        process.exit(1);
    }
}

migrate();
