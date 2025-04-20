import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authorRoutes from './routes/authors.js';
import blogPostRoutes from './routes/blogposts.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/authors', authorRoutes);
app.use('/blogposts', blogPostRoutes);

app.get('/', (req, res) => {
  res.send('Hello from the Blog API!');
});

// DB connection & server start
const initServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connesso a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server avviato su http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Errore di connessione a MongoDB:', error);
  }
};

initServer();
