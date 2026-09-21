const apiKey = "iGTeKPCXgrUny2PqW5vRg6kaRc3egi5ZeANLsKSR";

const dateInput = document.getElementById("date");
const loading = document.getElementById("loading");
const content = document.getElementById("content");
const error = document.getElementById("error");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const shareBtn = document.getElementById("shareBtn");

const title = document.getElementById("title");
const dateDisplay = document.getElementById("date-display");
const explanation = document.getElementById("explanation");

const image = document.getElementById("apod-image");
const mediaBadge = document.getElementById("media-badge");

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}

async function getPicture() {
    const selectedDate = dateInput.value;

    if (!selectedDate) {
        error.textContent = "Please select a date.";
        return;
    }

    loading.style.display = "block";
    content.style.display = "none";
    error.textContent = "";

    try {
        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${selectedDate}`
        );

        if (!response.ok) {
            throw new Error("Unable to fetch NASA data.");
        }

        const data = await response.json();

        title.textContent = data.title;
        dateDisplay.textContent = formatDate(data.date);
        explanation.textContent = data.explanation;

        if (data.media_type === "image") {
            image.src = data.url;
            image.style.display = "block";
            mediaBadge.textContent = "NASA APOD";
        } else {
            image.style.display = "none";
            mediaBadge.textContent = "NASA VIDEO";
        }

        updateFavoriteButton(data.date);
        content.style.display = "block";

    } catch (err) {
        console.error(err);
        error.textContent =
            "Something went wrong. Please try again.";
    } finally {
        loading.style.display = "none";
    }
}

function formatDate(dateString) {
    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

function getFavorites() {
    return JSON.parse(
        localStorage.getItem("nasaFavorites") || "[]"
    );
}

function updateFavoriteButton(date) {
    const favorites = getFavorites();

    if (favorites.includes(date)) {
        favoriteBtn.innerHTML = "♥ <span>Favorited</span>";
    } else {
        favoriteBtn.innerHTML = "♡ <span>Favorite</span>";
    }
}

favoriteBtn.addEventListener("click", function () {
    const date = dateInput.value;
    let favorites = getFavorites();

    if (favorites.includes(date)) {
        favorites = favorites.filter(item => item !== date);
    } else {
        favorites.push(date);
    }

    localStorage.setItem(
        "nasaFavorites",
        JSON.stringify(favorites)
    );

    updateFavoriteButton(date);
    updateFavoritesPanel();
});

shareBtn.addEventListener("click", async function () {
    const shareData = {
        title: title.textContent,
        text: `Check out NASA's Astronomy Picture of the Day: ${title.textContent}`,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(
                window.location.href
            );

            shareBtn.innerHTML =
                "✓ <span>Link Copied</span>";

            setTimeout(function () {
                shareBtn.innerHTML =
                    "🔗 <span>Share</span>";
            }, 2000);
        }
    } catch (err) {
        console.log("Share cancelled.");
    }
});

previousBtn.addEventListener("click", function () {
    const currentDate = new Date(dateInput.value);

    currentDate.setDate(
        currentDate.getDate() - 1
    );

    dateInput.value =
        currentDate.toISOString().split("T")[0];

    getPicture();
});

nextBtn.addEventListener("click", function () {
    const selectedDate = new Date(dateInput.value);
    const today = new Date(getTodayDate());

    selectedDate.setDate(
        selectedDate.getDate() + 1
    );

    if (selectedDate > today) {
        return;
    }

    dateInput.value =
        selectedDate.toISOString().split("T")[0];

    getPicture();
});

dateInput.addEventListener("change", function () {
    getPicture();
});


/* SPACE FACTS */

const spaceFacts = [
    "A day on Venus is longer than a year on Venus.",
    "A million Earths could fit inside the Sun.",
    "Neutron stars are incredibly dense.",
    "Jupiter is the largest planet in our Solar System.",
    "Mars has the largest volcano in the Solar System, Olympus Mons.",
    "Saturn's rings are made mostly of ice and rocky particles.",
    "Light from the Sun takes about 8 minutes to reach Earth.",
    "The Moon is slowly moving away from Earth every year.",
    "A black hole has such strong gravity that even light cannot escape its event horizon."
];

const factElement =
    document.getElementById("space-fact");

const factBtn =
    document.getElementById("factBtn");

function showRandomFact() {
    const randomIndex =
        Math.floor(Math.random() * spaceFacts.length);

    factElement.textContent =
        spaceFacts[randomIndex];
}

factBtn.addEventListener(
    "click",
    showRandomFact
);

showRandomFact();


/* RANDOM EXPLORE */

const randomBtn =
    document.getElementById("randomBtn");

randomBtn.addEventListener("click", function () {
    const start = new Date("1995-06-16");
    const end = new Date();

    const difference =
        end.getTime() - start.getTime();

    const randomTime =
        Math.random() * difference;

    const randomDate =
        new Date(start.getTime() + randomTime);

    const year =
        randomDate.getFullYear();

    const month =
        String(randomDate.getMonth() + 1).padStart(2, "0");

    const day =
        String(randomDate.getDate()).padStart(2, "0");

    dateInput.value =
        `${year}-${month}-${day}`;

    getPicture();
});


/* FAVORITES PANEL */

const favoriteCount =
    document.getElementById("favoriteCount");

const favoritesList =
    document.getElementById("favoritesList");

function updateFavoritesPanel() {
    const favorites = getFavorites();

    favoriteCount.textContent =
        `${favorites.length} picture${favorites.length === 1 ? "" : "s"} saved`;

    if (favorites.length === 0) {
        favoritesList.textContent =
            "No favorites yet.";
        return;
    }

    favoritesList.innerHTML = "";

    favorites.slice().reverse().forEach(function (date) {
        const item =
            document.createElement("span");

        item.className = "favorite-date";
        item.textContent = date;
        item.title = "Open this picture";

        item.addEventListener("click", function () {
            dateInput.value = date;

            getPicture();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        favoritesList.appendChild(item);
    });
}


/* INITIAL LOAD */

dateInput.max = getTodayDate();
dateInput.value = getTodayDate();

updateFavoritesPanel();
getPicture();