const express = require('express');
const cors = require('cors');
const { getScores, addScore } = require('./database');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/submit-score', async (req, res) => {
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

app.get('/api/leaderboard', async (req, res) => {
    try {
        const scores = await getScores();
        console.log("Ranking enviado:", scores);
        res.status(200).json(scores);
    } catch (err) {
        console.error('Erro ao obter ranking:', err);
        res.status(500).send('Erro ao obter ranking');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
