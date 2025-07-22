import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import importRoute from './routes/import';

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// Route registration
app.use(importRoute);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// npx ts-node index.ts 
//  is how you can run this file directly
