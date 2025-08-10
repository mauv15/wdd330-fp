// public/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsDiv = document.getElementById("results");

  // Event listener for search button
  searchBtn.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (!query) {
      alert("Please enter a movie name");
      return;
    }
    searchMovies(query);
  });

  // Press Enter to search
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
        <div class="movie-card">
          <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" 
               alt="${movie.title}" />
          <h3>${movie.title}</h3>
          <p>Release: ${movie.release_date || "N/A"}</p>
          <p>Rating: ${movie.vote_average || "N/A"}</p>
        </div>
      `)
      .join("");
  }
});
