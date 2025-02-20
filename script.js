let map;
let markers = [];

document.addEventListener("DOMContentLoaded", function () {
  map = L.map("map").setView([23.2149, 77.3919], 15);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const searchInput = document.getElementById("search-input");
  const suggestionsList = document.getElementById("search-suggestions");

  searchInput.addEventListener("input", function () {
    const query = searchInput.value.trim();
    if (query.length > 0) {
      fetch(`get_locations.php?search=${encodeURIComponent(query)}`)
        .then((response) => response.json())
        .then((data) => {
          suggestionsList.innerHTML = "";
          data.forEach((location) => {
            const li = document.createElement("li");
            li.textContent = location.name;
            li.addEventListener("click", () => {
              addMarker(location);
              showLocationDetails(location);
              suggestionsList.innerHTML = "";
              searchInput.value = location.name;
            });
            suggestionsList.appendChild(li);
          });
        });
    } else {
      suggestionsList.innerHTML = "";
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target)) {
      suggestionsList.innerHTML = "";
    }
  });
});

function addMarker(location) {
  clearMarkers();
  const marker = L.marker([location.latitude, location.longitude])
    .addTo(map)
    .bindPopup(`<b>${location.name}</b>`)
    .openPopup();

  markers.push(marker);
  map.setView([location.latitude, location.longitude], 17);
}

function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

function showLocationDetails(location) {
  const detailsDiv = document.getElementById("location-details");
  detailsDiv.innerHTML = `
    <h3>${location.name}</h3>
    <p><strong>Category:</strong> ${location.category}</p>
    <p>${location.description}</p>
    <p><strong>Coordinates:</strong> ${location.latitude}, ${location.longitude}</p>
  `;
}
