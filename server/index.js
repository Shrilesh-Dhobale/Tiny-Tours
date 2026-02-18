import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import User from './models/User.js';
import Tour from './models/Tour.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());



const PORT = process.env.PORT || 8080;

const checkJWT=(req,res,next)=>{
  const { authorization } = req.headers;
  const token = authorization && authorization.split(' ')[1];

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    next();
  }
  catch(error){
    return res.json({
      success: false,
      message: 'Invalid token',
      data: null
    });
  }
};

app.get('/', (req, res) => {
  res.send('Welcome to Tiny Tours API!');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.post('/signup', async (req, res) => {
  const { username, email, password, mobile, country,city } = req.body;
  if(!username){
    return res.json({
      success: false,
      message: 'Username is required'
    });
  }
  if(!email){
    return res.json({
      success: false,
      message: 'Email is required'
    });
  }
  if(!password){
    return res.json({
      success: false,
      message: 'Password is required'
    });
  }

  const existingUser = await User.findOne({ email });
  if(existingUser){
    return res.json({
      success: false,
      message: 'Email already exists'
    });
  }

  const salt=bcrypt.genSaltSync(10);
  const encryptedPassword=bcrypt.hashSync(password,salt);

  const newUser = new User({
    username,
    email,
    password: encryptedPassword,
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if(!email){
    return res.json({
      success: false,
      message: 'Email is required'
    });
  }
  if(!password){
    return res.json({
      success: false,
      message: 'Password is required'
    });
  }
  const existingUser = await User.findOne({ email });
  if(!existingUser){
    return res.json({
      success: false,
      message: 'Invalid email or password',
      data: null
    });
  }

  const isPasswordValid=bcrypt.compareSync(password,existingUser.password);
  existingUser.password=undefined;

  if(isPasswordValid){
    return res.json({
      success: true,
      message: 'Login successful',
      data: existingUser
    });
  }
    return res.json({
      success: false,
      message: 'Invalid email or password',
      data: null
    });
  }
);

app.post('/tours',checkJWT, async (req, res) => {
  const { title, description, cities, startDate, endDate, photos, userID } = req.body;

  const newTour = new Tour({
    title,
    description,
    cities,
    startDate,
    endDate,
    photos,
    user: userID
  });
  try {
    const savedTour = await newTour.save();
    return res.json({
      success: true,
      message: 'Tour created successfully',
      data: savedTour
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `Error creating tour: ${error.message}`,
      data: null
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});