let map;
let currentMarker = null;
let destinationMarker = null;
let pathLine = null;
let userLocation = [23.211236, 77.39374]; // Your current location
let manitLocations = []; // Populated from database

// Define custom red icon for the destination marker after finding path
const redIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fetch locations from PHP
async function fetchLocations() {
  try {
    const response = await fetch("fetch_locations.php");
    const data = await response.json();
    if (data.error) {
      console.error(data.error);
      return;
    }
    manitLocations = data;
  } catch (error) {
    console.error("Error fetching locations:", error);
  }
}

// Initialize the map with layer control and restricted zooming
function initMap() {
  map = L.map("map", {
    zoomControl: false, // Disable zoom buttons (+/-)
    scrollWheelZoom: false, // Disable mouse scroll zooming
    doubleClickZoom: false, // Disable double-click zooming
    boxZoom: false, // Disable shift-drag box zoom
    keyboard: false, // Disable keyboard zoom controls
    touchZoom: true, // Enable pinch-to-zoom on touch devices
  }).setView(userLocation, 16);

  // Base layer: OpenStreetMap (Street View)
  const osmLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map); // Default layer

  // Satellite layer: Esri World Imagery (No API key required)
  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );

  // Layer control to toggle between Street and Satellite views
  const baseLayers = {
    "Street Map": osmLayer,
    "Satellite View": satelliteLayer,
  };

  const layerControl = L.control.layers(baseLayers).addTo(map);

  // Automatically collapse layer control after selection
  map.on("baselayerchange", function () {
    // Find the layer control container and collapse it
    const controlContainer = document.querySelector(".leaflet-control-layers");
    if (
      controlContainer &&
      controlContainer.classList.contains("leaflet-control-layers-expanded")
    ) {
      controlContainer.classList.remove("leaflet-control-layers-expanded");
    }
  });

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
  if (destinationMarker) {
    map.removeLayer(destinationMarker);
  }
  if (pathLine) {
    map.removeLayer(pathLine);
  }
  document.getElementById("routeInfo").style.display = "none";

  destinationMarker = L.marker(location.coordinates)
    .addTo(map)
    .bindPopup(`<h3>${location.name}</h3><p>${location.description}</p>`)
    .openPopup();

  const bounds = L.latLngBounds([userLocation, location.coordinates]);
  map.fitBounds(bounds, { padding: [50, 50] });

  document.getElementById("searchResults").innerHTML = "";
  document.getElementById("searchResults").style.display = "none";
  document.getElementById("searchInput").value = "";
  document.getElementById("findPath").style.display = "flex";
}

async function findPath() {
  if (!destinationMarker) return;

  destinationMarker.closePopup();

  const destCoords = destinationMarker.getLatLng();
  map.removeLayer(destinationMarker);
  destinationMarker = L.marker(destCoords, { icon: redIcon }).addTo(map);

  if (pathLine) {
    map.removeLayer(pathLine);
  }

  try {
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

    pathLine = L.polyline(coordinates, {
      color: "#3b82f6",
      weight: 4,
      opacity: 0.8,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);

    const distance = (route.distance / 1000).toFixed(2);
    const duration = Math.round(route.duration / 60);

    document.getElementById(
      "routeDistance"
    ).textContent = `Distance: ${distance} km`;
    document.getElementById(
      "routeDuration"
    ).textContent = `Estimated time: ${duration} minutes`;
    document.getElementById("routeInfo").style.display = "block";

    const bounds = L.latLngBounds(coordinates);
    map.fitBounds(bounds, { padding: [50, 50] });
  } catch (error) {
    console.error("Error finding route:", error);
    alert("Unable to find a route. Please try again.");
  }
}

// Initialize the application
document.addEventListener("DOMContentLoaded", async () => {
  await fetchLocations();
  initMap();
  setupSearch();
});
