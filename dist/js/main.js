document.addEventListener("DOMContentLoaded", () => {
  // ✅ Use same-origin API calls in production to avoid CORS
  const API_BASE =
    window.location.hostname === "localhost"
      ? "/api" // Local dev (Vite proxy → Express)
      : "/api"; // Production (served from same domain as backend)

  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const genreFilter = document.getElementById("genreFilter");
  const resultsDiv = document.getElementById("results");

  let currentMovies = [];

  // Modal setup
  const modal = document.createElement("div");
  modal.id = "movieModal";
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <div id="modalBody"></div>
    </div>
  `;
  document.body.appendChild(modal);
  const modalBody = document.getElementById("modalBody");
  const closeBtn = modal.querySelector(".close");

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  function displayMovies(movies) {
    if (!movies?.length) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    const selectedGenreId = genreFilter.value;
    const filteredMovies = selectedGenreId
      ? movies.filter((movie) =>
          movie.genre_ids?.includes(Number(selectedGenreId))
        )
      : movies;

    if (!filteredMovies.length) {
      resultsDiv.innerHTML = "<p>No results match the selected genre.</p>";
      return;
    }

    resultsDiv.innerHTML = filteredMovies
      .map(
        (movie) => `
        <div class="movie-card" data-id="${movie.id}">
          <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}" />
          <h3>${movie.title}</h3>
          <p>Release: ${movie.release_date || "N/A"}</p>
          <p>Rating: ${movie.vote_average || "N/A"}</p>
        </div>
      `
      )
      .join("");

    document.querySelectorAll(".movie-card").forEach((card) => {
      card.addEventListener("click", () => {
        const movieId = card.dataset.id;
        showMovieDetails(movieId);
      });
    });
  }

  async function showMovieDetails(movieId) {
    try {
      const res = await fetch(`${API_BASE}/movie/${movieId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const movie = await res.json();

      modalBody.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />
        <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
        <p><strong>Genres:</strong> ${movie.genres.map((g) => g.name).join(", ")}</p>
        <p><strong>Overview:</strong> ${movie.overview}</p>
      `;
      modal.style.display = "block";
    } catch (err) {
      console.error("Failed to fetch movie details:", err);
    }
  }

  searchBtn.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Please enter a movie name");
      return;
    }

    resultsDiv.innerHTML = "<p>Searching...</p>";
    try {
      const res = await fetch(
        `${API_BASE}/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      currentMovies = data.results;
      displayMovies(currentMovies);
    } catch (err) {
      console.error("Search failed:", err);
      resultsDiv.innerHTML = "<p>Failed to fetch movies.</p>";
    }
  });

  genreFilter.addEventListener("change", () => {
    displayMovies(currentMovies);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") searchBtn.click();
  });
});
