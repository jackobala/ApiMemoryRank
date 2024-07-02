const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
});

pool.on('connect', () => {
    console.log('Conectado ao banco de dados PostgreSQL');
});

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        apelido TEXT NOT NULL,
        tempo INTEGER NOT NULL,
        jogadas INTEGER NOT NULL
    );
`;

pool.query(createTableQuery)
    .then(() => {
        console.log('Tabela criada ou já existe');
    })
    .catch(err => {
        console.error('Erro ao criar tabela:', err);
    });

async function getScores() {
    const query = `SELECT apelido, tempo, jogadas FROM scores ORDER BY tempo ASC, jogadas ASC LIMIT 5`;
    const { rows } = await pool.query(query);
    return rows;
}

async function addScore(apelido, tempo, jogadas) {
    const query = `
        INSERT INTO scores (apelido, tempo, jogadas) 
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    await pool.query(query, [apelido, tempo, jogadas]);

    const deleteQuery = `
        DELETE FROM scores
        WHERE id NOT IN (
            SELECT id FROM scores
            ORDER BY tempo ASC, jogadas ASC
            LIMIT 5
        );
    `;
    await pool.query(deleteQuery);
}

module.exports = { getScores, addScore };
