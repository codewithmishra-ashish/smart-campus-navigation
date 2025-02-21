let map;
let currentMarker = null;
let destinationMarker = null;
let pathLine = null;
let userLocation = [23.211236, 77.39374]; // Your current location

// Initialize the map
function initMap() {
  map = L.map("map").setView(userLocation, 16);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Add marker for current location
  L.marker(userLocation, {
    icon: L.divIcon({
      className: "current-location-marker",
      html: '<div class="ripple"></div>',
      iconSize: [20, 20],
    }),
  })
    .addTo(map)
    .bindPopup("Your Current Location")
    .openPopup();
}

// Search functionality
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const findPathBtn = document.getElementById("findPath");

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
      searchResults.innerHTML = "";
      searchResults.style.display = "none";
      return;
    }

    const filtered = manitLocations.filter(
      (location) =>
        location.name.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query)
    );

    displaySearchResults(filtered);
  });

  findPathBtn.addEventListener("click", findPath);
}

function displaySearchResults(results) {
  const searchResults = document.getElementById("searchResults");
  searchResults.innerHTML = "";
  searchResults.style.display = "block";

  results.forEach((location) => {
    const div = document.createElement("div");
    div.className = "search-result-item";
    div.innerHTML = `
      <h3>${location.name}</h3>
      <p>${location.description}</p>
    `;
    div.addEventListener("click", () => selectLocation(location));
    searchResults.appendChild(div);
  });
}

function selectLocation(location) {
  // Clear previous destination marker if exists
  if (destinationMarker) {
    map.removeLayer(destinationMarker);
  }

  // Clear previous path if exists
  if (pathLine) {
    map.removeLayer(pathLine);
  }

  // Hide route info
  document.getElementById("routeInfo").style.display = "none";

  // Add new marker for destination
  destinationMarker = L.marker(location.coordinates)
    .addTo(map)
    .bindPopup(
      `
      <h3>${location.name}</h3>
      <p>${location.description}</p>
      `
    )
    .openPopup();

  // Fit map to show both current location and destination
  const bounds = L.latLngBounds([userLocation, location.coordinates]);
  map.fitBounds(bounds, { padding: [50, 50] });

  // Clear search results and input
  document.getElementById("searchResults").innerHTML = "";
  document.getElementById("searchResults").style.display = "none";
  document.getElementById("searchInput").value = "";

  // Show find path button
  document.getElementById("findPath").style.display = "flex";
}

async function findPath() {
  if (!destinationMarker) return;

  // Clear previous path if exists
  if (pathLine) {
    map.removeLayer(pathLine);
  }

  // Get destination coordinates
  const destCoords = destinationMarker.getLatLng();

  try {
    // Fetch route from OSRM
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`
    );
    const data = await response.json();

    if (data.code !== "Ok") {
      throw new Error("Unable to find route");
    }

    const route = data.routes[0];
    const coordinates = route.geometry.coordinates.map((coord) => [
      coord[1],
      coord[0],
    ]);

    // Draw the path
    pathLine = L.polyline(coordinates, {
      color: "#3b82f6",
      weight: 4,
      opacity: 0.8,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    // Update route information
    const distance = (route.distance / 1000).toFixed(2);
    const duration = Math.round(route.duration / 60);

    document.getElementById(
      "routeDistance"
    ).textContent = `Distance: ${distance} km`;
    document.getElementById(
      "routeDuration"
    ).textContent = `Estimated time: ${duration} minutes`;
    document.getElementById("routeInfo").style.display = "block";

    // Fit map to show the entire path
    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [50, 50] });
  } catch (error) {
    console.error("Error finding route:", error);
    alert("Unable to find a route. Please try again.");
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initMap();
  setupSearch();
});
