let map;
let markers = [];

document.addEventListener("DOMContentLoaded", function () {
  // Initialize map centered on MANIT Bhopal
  map = L.map("map").setView([23.2149, 77.3919], 15);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Load initial locations
  loadLocations();

  // Search and filter functionality
  document
    .getElementById("search-input")
    .addEventListener("input", filterLocations);
  document
    .getElementById("category-filter")
    .addEventListener("change", filterLocations);
});

function loadLocations() {
  fetch("get_locations.php")
    .then((response) => response.json())
    .then((data) => {
      clearMarkers();
      data.forEach((location) => {
        addMarker(location);
      });
    });
}

function addMarker(location) {
  const marker = L.marker([location.latitude, location.longitude])
    .addTo(map)
    .bindPopup(`<b>${location.name}</b><br>${location.category}`);

  marker.on("click", () => showLocationDetails(location));
  markers.push(marker);
}

function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}

function filterLocations() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const category = document.getElementById("category-filter").value;

  fetch("get_locations.php")
    .then((response) => response.json())
    .then((data) => {
      clearMarkers();
      const filtered = data.filter((location) => {
        const matchesSearch = location.name.toLowerCase().includes(searchTerm);
        const matchesCategory =
          category === "all" || location.category === category;
        return matchesSearch && matchesCategory;
      });
      filtered.forEach((location) => addMarker(location));
    });
}

function showLocationDetails(location) {
  const detailsDiv = document.getElementById("location-details");
  detailsDiv.innerHTML = `
        <h3>${location.name}</h3>
        <p>Category: ${location.category}</p>
        <p>${location.description}</p>
        <p>Coordinates: ${location.latitude}, ${location.longitude}</p>
    `;
}
