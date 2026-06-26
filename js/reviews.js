const API_KEY = "603d8bb5539485e07e18e1d0becc48ad";
const BASE_URL = "https://api.themoviedb.org/3";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const reviewsContainer = document.getElementById("reviewsContainer");

searchBtn.addEventListener("click", searchMovieReviews);

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchMovieReviews();
    }
});

async function searchMovieReviews() {
    const query = searchInput.value.trim();

    if (!query) {
        reviewsContainer.innerHTML =
            "<p>Please enter a movie title.</p>";
        return;
    }

    try {
        // Search for movie
        const searchResponse = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );

        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
            reviewsContainer.innerHTML =
                "<p>No movie found.</p>";
            return;
        }

        const movie = searchData.results[0];
        let reviewHistory =
    JSON.parse(localStorage.getItem("reviewHistory"))
    || [];

// Remove duplicates
     reviewHistory = reviewHistory.filter(
    item => item.id !== movie.id
);

// Add newest movie to the top
    reviewHistory.unshift(movie);

// Keep only the last 10 movies
    reviewHistory = reviewHistory.slice(0, 10);

localStorage.setItem(
    "reviewHistory",
    JSON.stringify(reviewHistory)
);

        // Get reviews
        const reviewsResponse = await fetch(
            `${BASE_URL}/movie/${movie.id}/reviews?api_key=${API_KEY}`
        );

        const reviewsData = await reviewsResponse.json();

        displayReviews(movie, reviewsData.results);

        loadHistory();

    } catch (error) {
        console.error(error);
        reviewsContainer.innerHTML =
            "<p>Error loading reviews.</p>";
    }
}

function loadHistory() {
    const historyList =
        document.getElementById("historyList");

    if (!historyList) return;

    const reviewHistory =
        JSON.parse(localStorage.getItem("reviewHistory"))
        || [];

    historyList.innerHTML = "";

    reviewHistory.forEach(movie => {
        const movieItem =
            document.createElement("div");

        movieItem.classList.add("history-item");

        movieItem.innerHTML = `
    <img
        src="https://image.tmdb.org/t/p/w92${movie.poster_path}"
        alt="${movie.title}"
        width="50"
    >
    <span>${movie.title}</span>
`;

        movieItem.addEventListener("click", () => {
            loadSavedMovieReviews(movie);
        });

        historyList.appendChild(movieItem);
    });
}

function displayReviews(movie, reviews) {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "";

    reviewsContainer.innerHTML = `
    <div class="movie-review-layout">
        <img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            alt="${movie.title}"
            class="movie-poster"
        >

        <div class="movie-details">
    <h2>${movie.title}</h2>
    <p><strong>⭐ Rating:</strong> ${movie.vote_average}</p>
    <p>${movie.overview}</p>

    <button id="watchlistBtn">
        ➕ Add to Watchlist
    </button>

    <div id="reviewList"></div>
</div>
    </div>
`;

const reviewList = document.getElementById("reviewList");
const watchlistBtn =document.getElementById("watchlistBtn");

watchlistBtn.addEventListener("click", () => {
    addToWatchlist(movie);
});

if (!reviews || reviews.length === 0) {
    reviewList.innerHTML =
        "<p>No reviews available for this movie.</p>";
    return;
}
reviews.forEach(review => {
    const reviewCard = document.createElement("div");

    reviewCard.classList.add("review-card");

    reviewCard.innerHTML = `
        <h3>${review.author}</h3>
        <p>${review.content.substring(0, 400)}...</p>
    `;

    reviewList.appendChild(reviewCard);
});

}

function addToWatchlist(movie) {
    let watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    const alreadyExists = watchlist.some(
        item => item.id === movie.id
    );

    if (alreadyExists) {
        alert("Movie already in watchlist!");
        return;
    }

    watchlist.push(movie);

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

    alert(`${movie.title} added to watchlist!`);
}

window.addEventListener("load", () => {
    loadHistory();

    const reviewHistory =
        JSON.parse(localStorage.getItem("reviewHistory"))
        || [];

    if (reviewHistory.length > 0) {
        loadSavedMovieReviews(reviewHistory[0]);
    }
});

async function loadSavedMovieReviews(movie) {
    try {
        const reviewsResponse = await fetch(
            `${BASE_URL}/movie/${movie.id}/reviews?api_key=${API_KEY}`
        );

        const reviewsData = await reviewsResponse.json();

        displayReviews(movie, reviewsData.results);

    } catch (error) {
        console.error(error);
    }
}


