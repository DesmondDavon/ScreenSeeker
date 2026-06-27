const API_KEY = "a246062f683c15c6394495d9c7f07905";
const BASE_URL = "https://api.themoviedb.org/3";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const movieResults = document.getElementById("movieResults");
const homePage = document.getElementById("homePage");

searchBtn.addEventListener("click", searchMovie);

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchMovie();
    }
});

async function searchMovie() {
    const query = searchInput.value.trim();

    if (!query) {
        homePage.hidden = false;
        movieResults.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(
            `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        displayMovies(data.results);

    } catch (error) {
        console.error("Error fetching movies:", error);
    }
} ;

function displayMovies(movies) {
    movieResults.innerHTML = "";

    if (!movies || movies.length === 0) {
        movieResults.innerHTML = "<p>No movies found.</p>";
        return;
    }

    // Hide welcome text when results appear
    homePage.hidden = true;

    movies.forEach(movie => {
        const posterUrl = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "";

        const movieCard = document.createElement("div");

        movieCard.classList.add("movie-card");

        movieCard.innerHTML = `
            ${
                posterUrl
                    ? `<img src="${posterUrl}" alt="${movie.title}" width="200">`
                    : ""
            }

            <h2>${movie.title}</h2>

            <p>⭐ ${movie.vote_average}</p>

            <p>${movie.overview}</p>

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

window.addEventListener("load", () => {
    const introScreen = document.getElementById("introScreen");

    if (!introScreen) return;

    // Has intro already played during this browser visit?
    if (sessionStorage.getItem("introPlayed")) {
        introScreen.remove();
        return;
    }

    sessionStorage.setItem("introPlayed", "true");

    setTimeout(() => {
        introScreen.classList.add("fade-out");

        setTimeout(() => {
            introScreen.remove();
        }, 1000);

    }, 4000);
});

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
}; 

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
