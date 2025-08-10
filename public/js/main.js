document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  // Modal elements
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

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Search button click
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Please enter a movie name");
      return;
    }
    searchMovies(query);
  });

  // Enter key to search
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  async function searchMovies(query) {
    resultsDiv.innerHTML = "<p>Searching...</p>";
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      displayMovies(data.results);
    } catch (err) {
      console.error(err);
      resultsDiv.innerHTML = "<p>Failed to fetch movies.</p>";
    }
  }

  function displayMovies(movies) {
    if (!movies || movies.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    resultsDiv.innerHTML = movies
      .map(movie => `
        <div class="movie-card" data-id="${movie.id}">
          <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" 
               alt="${movie.title}" />
          <h3>${movie.title}</h3>
          <p>Release: ${movie.release_date || "N/A"}</p>
          <p>Rating: ${movie.vote_average || "N/A"}</p>
        </div>
      `)
      .join("");

    document.querySelectorAll(".movie-card").forEach(card => {
      card.addEventListener("click", () => {
        const movieId = card.getAttribute("data-id");
        showMovieDetails(movieId);
      });
    });
  }

  async function showMovieDetails(movieId) {
    try {
      const res = await fetch(`/api/movie/${movieId}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const movie = await res.json();

      modalBody.innerHTML = `
        <h2>${movie.title}</h2>
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />
        <p><strong>Release Date:</strong> ${movie.release_date || "N/A"}</p>
        <p><strong>Genres:</strong> ${movie.genres.map(g => g.name).join(", ")}</p>
        <p><strong>Overview:</strong> ${movie.overview}</p>
      `;
      modal.style.display = "block";
    } catch (err) {
      console.error("Failed to fetch movie details", err);
    }
  }
});
