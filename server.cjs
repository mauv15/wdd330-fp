const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// TMDB search route
app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  try {
    const tmdbRes = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: process.env.TMDB_API_KEY,
        query,
      },
    });
    res.json(tmdbRes.data);
  } catch (error) {
    console.error('TMDB fetch failed:', error.message);
    res.status(500).json({ error: 'TMDB fetch failed' });
  }
});

// TMDB movie details route
app.get('/api/movie/:id', async (req, res) => {
  try {
    const tmdbRes = await axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}`, {
      params: {
        api_key: process.env.TMDB_API_KEY,
        append_to_response: 'videos'
      }
    });
    res.json(tmdbRes.data);
  } catch (error) {
    console.error('TMDB movie details fetch failed:', error.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});