const pool = require('./config/db');

async function migrate() {
    try {
        console.log('--- INICIANDO MIGRAÇÃO DE CONFIGURAÇÕES ---');
        const queries = [
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS smtp_host VARCHAR(255)",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS smtp_port INT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS smtp_user VARCHAR(255)",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS smtp_pass VARCHAR(255)",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS meta_keywords TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS pinterest_pixel TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS linkedin_pixel TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS custom_head_code TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS custom_body_code TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS logo TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS logo_white TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS favicon TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS license_qr_code TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS license_nf_data TEXT",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS license_auth_code VARCHAR(255)",
            "ALTER TABLE configuracoes_globais ADD COLUMN IF NOT EXISTS license_pdf TEXT"
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
