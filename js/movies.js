const API_KEY = "603d8bb5539485e07e18e1d0becc48ad";
const BASE_URL = "https://api.themoviedb.org/3";

const movieResults = document.getElementById("movieResults");

async function getTrendingMovies() {
    try {
        const response = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
        );

        console.log("Status:", response.status);

        const data = await response.json();

        console.log(data);

        displayMovies(data.results);

    } catch (error) {
        console.error("Error fetching trending movies:", error);
    }
}

function displayMovies(movies) {
    movieResults.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");

        movieCard.innerHTML = `
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average}</p>
            <img
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
                alt="${movie.title}"
                width="200"
            >
            <div class="button-container">
            <button class="watchlist-btn">
                 ➕ Add to Watchlist
            </button>

             <button class="trailer-btn">
                🎬 Watch Trailer
             </button>
            </div>
        `;

         const watchlistBtn =
            movieCard.querySelector(".watchlist-btn");

        watchlistBtn.addEventListener("click", () => {
            addToWatchlist(movie);
        });

        const trailerBtn =
            movieCard.querySelector(".trailer-btn");

        trailerBtn.addEventListener("click", () => {
            getTrailer(movie.id);
        });

        movieResults.appendChild(movieCard);
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

async function getTrailer(movieId) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
        );

        const data = await response.json();

        const trailer = data.results.find(video =>
            video.site === "YouTube" &&
            video.type === "Trailer"
        );

        if (trailer) {
            window.open(
                `https://www.youtube.com/watch?v=${trailer.key}`,
                "_blank"
            );
        } else {
            alert("No trailer available.");
        }

    } catch (error) {
        console.error("Error loading trailer:", error);
    }
}

getTrendingMovies();