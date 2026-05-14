const params = new URLSearchParams(window.location.search);
const filmId = params.get("filmId");

// const API_KEY = "fce2ccd9-3605-445d-b734-65b795bf2794";

const actorsList = document.querySelector(".actors__list");
const modal = document.querySelector(".actors__modal");
const modalClose = document.querySelector(".actors__modal-close");

// Загрузка актеров
async function loadActors() {

    try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff?filmId=${filmId}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        })

        const data = await response.json();
        const actors = data.filter(person => person.professionKey === "ACTOR");

        renderActors(actors)

    } catch (error) {
        console.log(error);

    }

}

// Отрисовка актеров
function renderActors(actors) {
    actorsList.innerHTML = "";

    actors.forEach(actor => {
        const card = document.createElement("div");
        card.className = "actor-card";
        card.dataset.id = actor.staffId;

        const name = actor.nameRu || actor.nameEn || "Имя неизвестно";
        const photo = actor.posterUrl || "";

        card.innerHTML = `
            <img src="${photo || 'img/poster.svg'}" class="actor__card_photo">
            <div class="actor__card-content">
            <h3 class="actor__card-name">${name}</h3>
            </div>
        `
        card.addEventListener("click", () => showActorInfo(actor.staffId));
        actorsList.appendChild(card);
    });

}

async function showActorInfo(actorId) {
    modal.classList.add("active");
    try {
        const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v1/staff/${actorId}`, {
            method: 'GET',
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json',
            },
        })

        const actor = await response.json();

        const name = actor.nameRu || actor.nameEn;
        const photo = actor.posterUrl || "";
        const birthday = actor.birthday || "-";
        const birthplace = actor.birthplace || "-";
        const bio = actor.facts && actor.facts.length > 0 ? actor.facts.join(" ") : "-";

        document.querySelector(".actor__modal-name").textContent = name;
        document.querySelector(".actor__modal-birthday").textContent = birthday;
        document.querySelector(".actor__modal_photo").src = photo || 'img/poster.svg';
        document.querySelector(".actor__modal-birthplace").textContent = birthplace;
        document.querySelector(".actor__modal-bio").textContent = bio

        const filmsList = document.querySelector(".actor__modal-films");
        filmsList.innerHTML = "";

        if (actor.films && actor.films.length > 0) {
            actor.films.slice(0, 10).forEach(film => {
                const li = document.createElement("li");
                li.textContent = film.nameRu
                filmsList.appendChild(li);
            })

        }

    } catch (error) {
        console.log(error);
    }
}

modalClose.addEventListener("click", () => {
    modal.classList.remove("active");
})


loadActors()