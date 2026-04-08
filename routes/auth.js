const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// @route   POST api/auth/login
// @desc    Authenticate admin & get token (Prepared Statements!)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ? LIMIT 1', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.senha);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciais inválidas' });
        }

        const payload = { 
            user: { 
                id: user.id, 
                nome: user.nome,
                email: user.email,
                nivel: user.nivel 
            } 
        };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' }, (err, token) => {
            if (err) throw err;
            res.json({ token, role: user.nivel });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor.');
    }
});

module.exports = router;
