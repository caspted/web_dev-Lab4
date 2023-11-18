import express from 'express';
import bodyParser from 'body-parser';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgres://postgres:password@127.0.0.1:5432/inviscord',
});

async function startServer() {
  const app = express();
  const connection = await pool.connect();

  app
    .get('/channels', async (request, response) => {
      const result = await connection.query(
        'SELECT * FROM channels ORDER BY name',
      );
      response.json(result.rows);
    })
    .get('/messages/:channelName', async (request, response) => {
      const result = await connection.query(
        `
        SELECT messages.* FROM messages 
        INNER JOIN channels ON messages.channel_id = channels.id 
        WHERE name = $1
      `,
        [request.params.channelName],
      );
      console.log('DB results', result.rows);
      response.json(result.rows);
    })
    .use(express.static('public'))
    .listen(3000, () => {
      console.log('Server has started at http://localhost:3000');
    });
}

startServer();
