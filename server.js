import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// === Serve frontend build ===
app.use(express.static(path.join(__dirname, 'dist')));

// === API endpoints ===
app.get('/api/genres', async (req, res) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`
    );
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch genres' });
  }
});

app.get('/api/search', async (req, res) => {
  const query = req.query.q || req.query.query;
  if (!query) return res.status(400).json({ error: 'Missing search query' });

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    if (!response.ok) throw new Error(`TMDB API error: ${response.status}`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// === Catch-all to serve index.html for any other route ===
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
