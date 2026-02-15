import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());



const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('Welcome to Tiny Tours API!');
});
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});