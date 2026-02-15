import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import User from './models/User.js';

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

app.post('/signup', async (req, res) => {
  const { username, email, password, mobile, country,city } = req.body;
  const newUser = new User({
    username,
    email,
    password,
    mobile,
    country,
    city
  });
  try{
    const savedUser = await newUser.save();
    return res.json({
      success: true,
      message: 'User registered successfully',
      data: savedUser
    });
  }
  catch(error){
    return res.json({
      success: false,
      message: `Error registering user : ${error.message}`,
      data: null
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});