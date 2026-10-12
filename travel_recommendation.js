// ---------- Data ----------
let travelData = null;

fetch("travel_recommendation_api.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  })
  .then(data => {
    travelData = data;
    console.log("Travel data loaded:", travelData);
  })
  .catch(error => {
    console.error("Error fetching travel data:", error);
  });

// ---------- Page elements ----------
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const resultsDiv = document.getElementById("results");

// ---------- Time zones (Task 10) ----------
const timeZones = {
  "Sydney, Australia": "Australia/Sydney",
  "Melbourne, Australia": "Australia/Melbourne",
  "Tokyo, Japan": "Asia/Tokyo",
  "Kyoto, Japan": "Asia/Tokyo",
  "Rio de Janeiro, Brazil": "America/Sao_Paulo",
  "São Paulo, Brazil": "America/Sao_Paulo",
  "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
  "Taj Mahal, India": "Asia/Kolkata",
  "Bora Bora, French Polynesia": "Pacific/Tahiti",
  "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

function getLocalTime(timeZone) {
  const options = {
    timeZone: timeZone,
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric"
  };
  return new Date().toLocaleTimeString("en-US", options);
}

function updateTimes() {
  document.querySelectorAll(".local-time").forEach(el => {
    el.textContent = "Local time: " + getLocalTime(el.dataset.tz);
  });
}

setInterval(updateTimes, 1000);

// ---------- Search (Task 7) ----------
function searchRecommendations() {
  if (!travelData) {
    resultsDiv.innerHTML = "<p class='no-results'>Data is still loading, please try again.</p>";
    return;
  }

  const keyword = searchInput.value.trim().toLowerCase();
  if (keyword === "") {
    resultsDiv.innerHTML = "<p class='no-results'>Please enter a keyword such as beach, temple or country.</p>";
    return;
  }

  let results = [];

  // Beaches: "beach", "beaches"
  if (keyword.includes("beach")) {
    results = travelData.beaches;
  }
  // Temples: "temple", "temples"
  else if (keyword.includes("temple")) {
    results = travelData.temples;
  }
  // Countries: "country", "countries"
  else if (keyword.includes("countr")) {
    travelData.countries.forEach(country => {
      results = results.concat(country.cities);
    });
  }
  // A specific country name like "japan"
  else {
    const match = travelData.countries.find(
      country => country.name.toLowerCase().includes(keyword)
    );
    if (match) {
      results = match.cities;
    }
  }

  displayResults(results);
}

// ---------- Display results (Task 8) ----------
function displayResults(results) {
  resultsDiv.innerHTML = "";

  if (results.length === 0) {
    resultsDiv.innerHTML = "<p class='no-results'>No recommendations found. Try beach, temple or country.</p>";
    return;
  }

  results.forEach(place => {
    const tz = timeZones[place.name];
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <img src="${place.imageUrl}" alt="${place.name}">
      <div class="result-info">
        <h3>${place.name}</h3>
        <p>${place.description}</p>
        ${tz ? `<p class="local-time" data-tz="${tz}">Local time: ${getLocalTime(tz)}</p>` : ""}
      </div>
    `;
    resultsDiv.appendChild(card);
  });

  resultsDiv.scrollIntoView({ behavior: "smooth" });
}

// ---------- Clear (Task 9) ----------
function clearResults() {
  resultsDiv.innerHTML = "";
  searchInput.value = "";
}

// ---------- Event listeners ----------
searchBtn.addEventListener("click", searchRecommendations);
resetBtn.addEventListener("click", clearResults);