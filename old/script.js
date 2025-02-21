/* script.js */
let map;
let currentMarker = null;
let destinationMarker = null;
let pathLine = null;
let userLocation = [23.211236, 77.39374];
let baseLayer, satelliteLayer;

// Initialize the map with base layers
function initMap() {
  // Default Map Layer
  const defaultLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors",
    }
  );

  // Satellite View Layer using Esri
  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye",
    }
  );

  // Initialize map
  map = L.map("map", {
    center: userLocation,
    zoom: 16,
    layers: [defaultLayer], // Default view
  });

  // Add Layer Control for Map & Satellite
  L.control
    .layers(
      { "Map View": defaultLayer, "Satellite View": satelliteLayer },
      null,
      { position: "topright" }
    )
    .addTo(map);

  // Current location marker
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

function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const findPathBtn = document.getElementById("findPath");

  searchInput.addEventListener("input", async (e) => {
    const query = e.target.value.toLowerCase();
    if (!query) {
      findPathBtn.style.display = "none";
      return;
    }

    const response = await fetch(`fetch_locations.php?query=${query}`);
    const locations = await response.json();

    if (locations.length > 0) {
      selectLocation(locations[0]);
      findPathBtn.style.display = "flex";
    } else {
      findPathBtn.style.display = "none";
    }
  });

  findPathBtn.addEventListener("click", findPath);
}

function selectLocation(location) {
  if (destinationMarker) map.removeLayer(destinationMarker);
  if (pathLine) map.removeLayer(pathLine);

  destinationMarker = L.marker([location.latitude, location.longitude])
    .addTo(map)
    .bindPopup(`<h3>${location.name}</h3><p>${location.description}</p>`)
    .openPopup();

  map.fitBounds(
    L.latLngBounds([userLocation, [location.latitude, location.longitude]]),
    { padding: [50, 50] }
  );
}

async function findPath() {
  if (!destinationMarker) return;

  if (pathLine) map.removeLayer(pathLine);

  const destCoords = destinationMarker.getLatLng();

  const response = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${userLocation[1]},${userLocation[0]};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`
  );
  const data = await response.json();

  if (data.code !== "Ok") {
    alert("Unable to find a route.");
    return;
  }

  const coordinates = data.routes[0].geometry.coordinates.map((coord) => [
    coord[1],
    coord[0],
  ]);

  pathLine = L.polyline(coordinates, { color: "#ef4444", weight: 4 }).addTo(
    map
  );

  map.fitBounds(L.latLngBounds(coordinates), { padding: [50, 50] });
}

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  setupSearch();
});
