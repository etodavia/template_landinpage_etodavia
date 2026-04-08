const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// @route   POST api/newsletter (Public)
router.post('/', async (req, res) => {
    const { email } = req.body;
    try {
        // CORREÇÃO: Usando a coluna 'status' como no schema.sql
        const query = 'INSERT INTO newsletter (email) VALUES (?) ON DUPLICATE KEY UPDATE status = "ativo"';
        await pool.execute(query, [email]);
        res.status(200).json({ msg: 'Inscrição realizada com sucesso!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Erro ao processar sua inscrição.' });
    }
});

module.exports = router;
