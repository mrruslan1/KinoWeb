// const API_KEY = 'fce2ccd9-3605-445d-b734-65b795bf2794';

const list = document.querySelector(".top250__list");
const tabs = document.querySelectorAll(".top250__tab");
const prevBtn = document.querySelector(".top250__prev");
const nextBtn = document.querySelector(".top250__next");
const pageSpan = document.querySelector(".top250__page");

let movies = [];
let limit = 10;
let currentPage = 1;
const PER_PAGE = 15;

// Загрузка фильмов 
async function loadMovies() {
    list.innerHTML = '<div class="loading">Загрузка фильмов...</div>';

    try {
        let allMovies = [];
        let page = 1;
        let hasMore = true;

        while (allMovies.length < 250 && hasMore) {
            const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=${page}`, {
                method: 'GET',
                headers: {
                    'X-API-KEY': API_KEY,
                    'Content-Type': 'application/json',
                },
            })
            if (!response) {
                throw new Error(`Ошибка ${response.status}`);
            }

            const data = await response.json();

            if (data.items && data.items.length > 0) {
                allMovies = allMovies.concat(data.items);
                page++;

            } else {
                hasMore = false;
            }

            if (page > 20) {
                hasMore = false;
            }
        }
        movies = allMovies.slice(0, 250).map((movie, index) => {
            movie.topPosition = index + 1;
            return movie;
        })

        renderMovies()

    } catch (error) {
        console.log(error);
        list.innerHTML = '<div class="error">Ошибка загрузки фильмов. Попробуйте позже</div>';
    }
}

// Получение фильмов с учетом лимита
function getMovies() {
    return movies.slice(0, limit);
}

// Отрисовка фильмов 
function renderMovies() {
    const currentMoviesList = getMovies()
    const totalPages = Math.ceil(currentMoviesList.length / PER_PAGE);
    const start = (currentPage - 1) * PER_PAGE;
    const currentMovies = currentMoviesList.slice(start, start + PER_PAGE);
    list.innerHTML = "";

    if (currentMovies === 0) {
        '<div class="empty">Фильмы не найдены</div>';
    }

    document.querySelector(".top250__pagination").style.display = "flex";
    currentMovies.forEach(movie => {
        const card = document.createElement("article");

        card.className = movie.topPosition <= 3 ? "top250__card top250__card-winner" : "top250__card";

        const genre = movie.genres && movie.genres.length > 0 ? movie.genres[0].genre : "Жанр не указан";

        card.innerHTML = `
            <div class="top250__card-number">${movie.topPosition}</div>
            <img class="top250__card-poster" src="${movie.posterUrlPreview || 'img/poster.svg'}">
            <div class="top250__card-content">
                <h2 class="top250__card-title">${movie.nameRu || movie.nameEn || 'Неизвестно'}</h2>
                <p class="top250__card-genre">${genre}</p>
                <p class="top250__card-year">${movie.year || 'Год не указан'}</p>
            </div>
        <div class="top250__card-rating">${movie.ratingKinopoisk || movie.ratingImdb || "-"}</div>
        `

        // Добавляем ссылку на фильм
        card.addEventListener("click", () => {
            window.location.href = `movies.html?id=${movie.kinopoiskId}`
        })

        list.appendChild(card)

    })
    updatePagination(totalPages);

}

// Обновление пагинации
function updatePagination(totalPages) {
    pageSpan.textContent = `${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    const pagination = document.querySelector(".top250__pagination");
    if (totalPages <= 1) {
        pagination.style.display = "none";
    } else {
        pagination.style.display = "flex";
    }
}

// сброс на первую страницу
function resetPage() {
    currentPage = 1
    renderMovies();
}



// Обработчик топ10 топ50 топ250
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");


        limit = parseInt(tab.dataset.limit);
        resetPage();
    })
})


prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderMovies();
    }
})

nextBtn.addEventListener("click", () => {
    const currentMovies = getMovies();
    const totalPages = Math.ceil(currentMovies.length / PER_PAGE);
    if (currentPage < totalPages) {
        currentPage++;
        renderMovies();
    }
})

loadMovies()