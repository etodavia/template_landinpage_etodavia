const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Rota auxiliar para verificar se o usuário é superadmin
function requireSuperAdmin(req, res, next) {
    if (res.locals.userRole === 'superadmin') {
        next();
    } else {
        res.redirect('/admin/dashboard?error=1&message=Acesso+restrito+a+Super+Admins');
    }
}

// Listar Usuários
router.get('/', requireSuperAdmin, async (req, res) => {
    try {
        const [users] = await pool.execute('SELECT id, nome, email, nivel, permissoes FROM usuarios ORDER BY id DESC');
        res.render('admin/usuarios', {
            title: 'Gestão de Usuários',
            users,
            success: req.query.success,
            error: req.query.error,
            errorMessage: req.query.message
        });
    } catch (e) {
        console.error(e);
        res.redirect('/admin/dashboard?error=1&message=Erro+ao+listar+usuários');
    }
});

// Novo Usuário Form
router.get('/novo', requireSuperAdmin, (req, res) => {
    res.render('admin/form-usuario', {
        title: 'Novo Usuário',
        user: null,
        error: req.query.error,
        errorMessage: req.query.message
    });
});

// Criar Usuário POST
router.post('/novo', requireSuperAdmin, async (req, res) => {
    const { nome, email, senha, nivel, perms } = req.body;
    
    if (!nome || !email || !senha) {
        return res.redirect('/admin/usuarios/novo?error=1&message=Preencha+todos+os+campos+obrigatórios');
    }

    try {
        // Verificar se e-mail já existe
        const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.redirect('/admin/usuarios/novo?error=1&message=E-mail+já+cadastrado');
        }

        const hashed = await bcrypt.hash(senha, 10);
        const permissionsJson = JSON.stringify(Array.isArray(perms) ? perms : (perms ? [perms] : []));

        await pool.execute('INSERT INTO usuarios (nome, email, senha, nivel, permissoes) VALUES (?, ?, ?, ?, ?)',
            [nome, email, hashed, nivel || 'admin', permissionsJson]);

        res.redirect('/admin/usuarios?success=1&message=Usuário+criado+com+sucesso');
    } catch (e) {
        console.error(e);
        res.redirect('/admin/usuarios/novo?error=1&message=Erro+ao+criar+usuário');
    }
});

// Editar Usuário Form
router.get('/editar/:id', requireSuperAdmin, async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, nome, email, nivel, permissoes FROM usuarios WHERE id = ?', [req.params.id]);
        const user = rows[0];
        
        if (!user) {
            return res.redirect('/admin/usuarios?error=1&message=Usuário+não+encontrado');
        }

        // Parse de permissões
        let userPerms = [];
        try {
            userPerms = user.permissoes ? JSON.parse(user.permissoes) : [];
        } catch (e) {
            userPerms = [];
        }
        user.permissoesArr = userPerms;

        res.render('admin/form-usuario', {
            title: 'Editar Usuário',
            user,
            error: req.query.error,
            errorMessage: req.query.message
        });
    } catch (e) {
        console.error(e);
        res.redirect('/admin/usuarios?error=1&message=Erro+ao+abrir+edição');
    }
});

// Editar Usuário POST
router.post('/editar/:id', requireSuperAdmin, async (req, res) => {
    const { nome, email, senha, nivel, perms } = req.body;
    
    if (!nome || !email) {
        return res.redirect(`/admin/usuarios/editar/${req.params.id}?error=1&message=Nome+e+e-mail+são+obrigatórios`);
    }

    try {
        // Verificar se e-mail já existe em outro ID
        const [existing] = await pool.execute('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, req.params.id]);
        if (existing.length > 0) {
            return res.redirect(`/admin/usuarios/editar/${req.params.id}?error=1&message=E-mail+já+utilizado+por+outro+usuário`);
        }

        const permissionsJson = JSON.stringify(Array.isArray(perms) ? perms : (perms ? [perms] : []));

        if (senha && senha.trim()) {
            const hashed = await bcrypt.hash(senha, 10);
            await pool.execute('UPDATE usuarios SET nome = ?, email = ?, senha = ?, nivel = ?, permissoes = ? WHERE id = ?',
                [nome, email, hashed, nivel || 'admin', permissionsJson, req.params.id]);
        } else {
            await pool.execute('UPDATE usuarios SET nome = ?, email = ?, nivel = ?, permissoes = ? WHERE id = ?',
                [nome, email, nivel || 'admin', permissionsJson, req.params.id]);
        }

        res.redirect('/admin/usuarios?success=1&message=Usuário+atualizado+com+sucesso');
    } catch (e) {
        console.error(e);
        res.redirect(`/admin/usuarios/editar/${req.params.id}?error=1&message=Erro+ao+atualizar+usuário`);
    }
});

// Deletar Usuário POST
router.post('/deletar/:id', requireSuperAdmin, async (req, res) => {
    // Impedir que o superadmin delete a si mesmo
    if (req.user && parseInt(req.user.id) === parseInt(req.params.id)) {
        return res.redirect('/admin/usuarios?error=1&message=Não+é+permitido+deletar+a+si+mesmo');
    }

    try {
        await pool.execute('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        res.redirect('/admin/usuarios?success=1&message=Usuário+removido+com+sucesso');
    } catch (e) {
        console.error(e);
        res.redirect('/admin/usuarios?error=1&message=Erro+ao+remover+usuário');
    }
});

module.exports = router;
