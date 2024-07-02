const express = require('express');
const cors = require('cors');
const path = require('path');
const { getScores, addScore } = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.post('/submit-score', async (req, res) => {
    const { apelido, tempo, jogadas } = req.body;

    if (!apelido || !tempo || !jogadas) {
        return res.status(400).send('Missing parameters');
    }

    console.log("Score recebido:", { apelido, tempo, jogadas });

    try {
        await addScore(apelido, tempo, jogadas);
        res.status(200).send('Score submitted');
    } catch (err) {
        console.error('Erro ao inserir score:', err);
        res.status(500).send('Erro ao inserir score');
    }
});

app.get('/leaderboard', async (req, res) => {
    try {
        const scores = await getScores();
        console.log("Ranking enviado:", scores);
        res.status(200).json(scores);
    } catch (err) {
        console.error('Erro ao obter ranking:', err);
        res.status(500).send('Erro ao obter ranking');
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
