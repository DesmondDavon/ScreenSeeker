const watchlistContainer =
    document.getElementById("watchlistContainer");

displayWatchlist();

function displayWatchlist() {
    const watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlistContainer.innerHTML = "";

    if (watchlist.length === 0) {
        watchlistContainer.innerHTML =
            "<p>Your watchlist is empty.</p>";
        return;
    }

    watchlist.forEach(movie => {
        const movieCard = document.createElement("div");

        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                alt="${movie.title}"
                width="200"
            >

            <h2>${movie.title}</h2>

            <p>⭐ ${movie.vote_average}</p>

            <button class="remove-btn"
                onclick="removeFromWatchlist(${movie.id})">
                Remove
            </button>
        `;

        watchlistContainer.appendChild(movieCard);
    });
}

function removeFromWatchlist(movieId) {
    let watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlist = watchlist.filter(
        movie => movie.id !== movieId
    );

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

    displayWatchlist();
}