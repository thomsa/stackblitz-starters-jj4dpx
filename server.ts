import express, { Request, Response } from 'express';
import { resolve } from 'path';
import { PostgreSQL } from './_mocks/db';
import { createClient } from './_mocks/redis';

/* Redis client created and ready to sue */
const redisClient = createClient();

const app = express();
const port: number = 3010;

const db = new PostgreSQL();
let connection = false;

async function connectDB() {
  if (connection) return;

  await db.connect();
  connection = true;
}

app.use(express.static('static'));

app.get('/', (req: Request, res: Response) => {
  res.sendFile(resolve(__dirname, '../../pages/index.html'));
});

app.get('/api/search', async (req: Request, res: Response) => {
  try {
    await connectDB();
    let cacheValue = 'HIT';
    
    let cachedValueFromReids = redisClient.get(req.query.value);
     
    res.status(200).header({ 'x-cache': cacheValue }).json({ data: cachedValueFromReids });

    if(!cachedValue) {
      const result = await db.query(
        "SELECT * FROM users WHERE first_name LIKE 'j%'",
        [req.query.value]
      );  
      redisClient.set(req.query.value , JSON.stringify(result.rows), (data) => {
        console.log('redis ' , data);
        cachedValueFromReids = data;
        cacheValue = 'MISS'
      });
    }


     

    res.status(200).header({ 'x-cache': cacheValue }).json({ data: cachedValueFromReids });
  } catch (e) {
    res.status(500).json({ error: 'Internal server error!' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
