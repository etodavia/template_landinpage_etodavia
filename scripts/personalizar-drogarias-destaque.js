const pool = require('../config/db');

const settings = {
    site_name: 'Drogarias Destaque',
    footer_text: 'Todos os direitos reservados.',
    footer_short_text: 'A sua saúde merece destaque.',
    meta_title_home: 'Drogarias Destaque | A sua saúde merece destaque',
    meta_description_home: 'Medicamentos, higiene, beleza e bem-estar para toda a família, com atendimento próximo e facilidade para pedir pelo WhatsApp.',
    meta_keywords: 'Drogarias Destaque, drogaria, farmácia, medicamentos, higiene, beleza, perfumaria, vitaminas',
    home_hero_title: 'A sua saúde merece <em>destaque</em>.',
    home_hero_description: 'Cuidado, economia e praticidade para você e toda a sua família.',
    home_hero_button_text: 'Pedir pelo WhatsApp',
    home_hero_card_title: 'Tudo para cuidar de quem você <em>ama</em>.',
    home_hero_card_subtitle: 'Drogarias Destaque',
    nav_cta_text: 'Peça pelo WhatsApp',
    whatsapp_message: 'Olá! Vim pelo site da Drogarias Destaque e gostaria de consultar um produto.',
    header_strip_text: 'Medicamentos, higiene, beleza e bem-estar em um só lugar',
    site_menu: 'Início|/#home\nA Drogaria|/#sobre\nProdutos|/#servicos\nVantagens|/#beneficios\nAvaliações|/#depoimentos\nContato|/#contato',
    about_title: 'Cuidar de você é o nosso maior <em>destaque</em>.',
    about_text: 'Na Drogarias Destaque, você encontra muito mais que produtos: encontra atenção, confiança e conveniência. Reunimos medicamentos, higiene, beleza e bem-estar para facilitar sua rotina e cuidar de toda a família.',
    home_about_button_text: 'Conheça nossas opções',
    services_section_title: 'Tudo o que você precisa em um só <em>lugar</em>',
    services_section_text: 'Variedade para cuidar da saúde, da beleza e do bem-estar em todas as fases da vida.',
    home_services_button_text: 'Consultar produto',
    benefits_title: 'Por que escolher a Drogarias Destaque?',
    benefits_text: 'Cuidado de verdade aparece nos detalhes: atendimento atencioso, variedade, economia e facilidade para comprar.',
    testimonial_section_title: 'A confiança de quem escolhe a <em>Destaque</em>',
    contact_section_title: 'Precisando de algo? Fale com a nossa equipe.',
    contact_section_subtitle: 'Consulte produtos, tire dúvidas e faça seu pedido com rapidez pelo WhatsApp.',
    contact_page_description: 'Nossa equipe está pronta para atender você com atenção e agilidade.',
    contact_form_title: 'Envie sua mensagem',
    contact_extra_title: 'Quer consultar um produto agora?',
    contact_extra_text: 'Chame no WhatsApp e receba um atendimento rápido e próximo.',
    destaque_paralaxe_title: 'Seu cuidado não pode esperar',
    destaque_paralaxe_subtitle: 'Encontre o que precisa com mais praticidade e atendimento de confiança.',
    destaque_paralaxe_button_text: 'Falar com a equipe',
    destaque_paralaxe_button_url: '#contato'
};

const services = [
    {
        slug: 'medicamentos',
        titulo: 'Medicamentos',
        resumo: 'Medicamentos e itens essenciais com atendimento atencioso para uma compra mais tranquila.',
        icone: 'ri-capsule-line'
    },
    {
        slug: 'higiene-cuidados-pessoais',
        titulo: 'Higiene e cuidados pessoais',
        resumo: 'Produtos para o cuidado diário de toda a família, da higiene pessoal aos primeiros cuidados.',
        icone: 'ri-heart-pulse-line'
    },
    {
        slug: 'beleza-perfumaria',
        titulo: 'Beleza e perfumaria',
        resumo: 'Cuidados para pele, cabelos e corpo que valorizam sua beleza e seu bem-estar todos os dias.',
        icone: 'ri-sparkling-2-line'
    },
    {
        slug: 'vitaminas-bem-estar',
        titulo: 'Vitaminas e bem-estar',
        resumo: 'Opções para complementar sua rotina de cuidado, disposição e qualidade de vida.',
        icone: 'ri-leaf-line'
    },
    {
        slug: 'mamae-bebe',
        titulo: 'Mamãe e bebê',
        resumo: 'Fraldas, higiene e cuidados especiais para acompanhar cada fase dos primeiros anos.',
        icone: 'ri-bear-smile-line'
    },
    {
        slug: 'conveniencia',
        titulo: 'Conveniência',
        resumo: 'Itens úteis para o dia a dia reunidos em um só lugar, com uma compra rápida e prática.',
        icone: 'ri-shopping-basket-2-line'
    }
];

const benefits = [
    ['ri-customer-service-2-line', 'Atendimento próximo', 'Atenção e agilidade para ajudar você a encontrar o que precisa.'],
    ['ri-price-tag-3-line', 'Economia para cuidar', 'Boas opções para cuidar da saúde sem descuidar do orçamento.'],
    ['ri-store-2-line', 'Variedade para a família', 'Saúde, higiene, beleza, bem-estar e conveniência em um só lugar.'],
    ['ri-whatsapp-line', 'Facilidade pelo WhatsApp', 'Consulte produtos e faça seu pedido de onde estiver.']
];

async function run() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const keys = Object.keys(settings);
        await connection.execute(
            `UPDATE configuracoes_globais SET ${keys.map((key) => `\`${key}\` = ?`).join(', ')} WHERE id = 1`,
            keys.map((key) => settings[key])
        );

        await connection.execute('DELETE FROM servicos');
        for (let index = 0; index < services.length; index += 1) {
            const service = services[index];
            await connection.execute(
                `INSERT INTO servicos
                (slug, titulo, resumo, conteudo, icone, meta_title, meta_description, destaque_home, ordem, ativo)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, 1)`,
                [
                    service.slug,
                    service.titulo,
                    service.resumo,
                    service.resumo,
                    service.icone,
                    `${service.titulo} | Drogarias Destaque`,
                    service.resumo,
                    index
                ]
            );
        }

        await connection.execute('DELETE FROM beneficios');
        for (let index = 0; index < benefits.length; index += 1) {
            const [icone, titulo, texto] = benefits[index];
            await connection.execute(
                'INSERT INTO beneficios (icone, titulo, texto, ordem) VALUES (?, ?, ?, ?)',
                [icone, titulo, texto, index]
            );
        }

        await connection.commit();
        console.log('Conteúdo da Drogarias Destaque atualizado.');
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
        await pool.end();
    }
}

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
