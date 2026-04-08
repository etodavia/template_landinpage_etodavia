const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    console.log('🌱 Iniciando semeadura de serviços...');

    try {
        await pool.execute(`
            INSERT IGNORE INTO servicos (slug, titulo, resumo, imagem, conteudo, icone) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [
                'mentoria-de-lideranca', 
                'Mentoria de Liderança', 
                'Capacitação estratégica para gestores transformarem potencial em resultados exponenciais.', 
                'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800', 
                '<h3>Líderes que Inspiram</h3><p>Liderança não é cargo, é impacto. Nossa mentoria foca em competências comportamentais e inteligência emocional para que seu time de gestão atue como verdadeiros parceiros do negócio. Trabalhamos a autoconsciência e a gestão de conflitos.</p>', 
                'ri-focus-3-line'
            ]
        );

        await pool.execute(`
            INSERT IGNORE INTO servicos (slug, titulo, resumo, imagem, conteudo, icone) 
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [
                'gestao-de-processos-rh', 
                'Gestão de Processos de RH', 
                'Recrutamento técnico e estruturação de fluxos operacionais com foco em eficiência máxima.', 
                'https://images.unsplash.com/photo-1507679793137-c72a09c17e64?auto=format&fit=crop&q=80&w=800', 
                '<h3>Eficiência em cada Contratação</h3><p>Otimizamos todo o ciclo do colaborador, do onboarding ao offboarding. Processos claros reduzem custos e aumentam a clareza para todos os envolvidos no ecossistema da empresa. Estruturamos seu plano de cargos e salários.</p>', 
                'ri-node-tree'
            ]
        );

        console.log('✅ Serviços semeados com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao semear:', error.message);
    } finally {
        await pool.end();
    }
}

seed();
