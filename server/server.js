// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Proxy endpoint for genres
app.get('/api/genres', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching genres' });
  }
});

// Proxy endpoint for movie search by genre
app.get('/api/movies', async (req, res) => {
  const { genreId } = req.query;
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching movies' });
  }
});

app.listen(3000, () => console.log(`Server running at http://localhost:${PORT}`));
