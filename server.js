// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

const app = express();

// Configure CORS to allow requests from specific origins
app.use(cors({
  origin: [
    'http://localhost:5173', // Your Vite dev server
    'https://wdd330-fp.onrender.com' // Your Render frontend URL (change to yours)
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.error('TMDB_API_KEY is not set in environment variables');
  process.exit(1);
}

// Proxy endpoint for genres
app.get('/api/genres', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching genres:', err);
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

// Proxy endpoint for movie search by genre
app.get('/api/movies', async (req, res) => {
  const { genreId } = req.query;

  if (!genreId) {
    return res.status(400).json({ error: 'genreId query parameter is required' });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).json({ error: 'Error fetching movies' });
  }
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
