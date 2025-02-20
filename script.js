let map;
let markers = [];

document.addEventListener("DOMContentLoaded", function () {
  const manitCoordinates = [23.216439, 77.405785];
  const defaultZoom = 16;

  // Normal OSM Tile Layer
  const osmLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );

  // Satellite Tile Layer (Esri)
  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles © Esri",
    }
  );

  // Initialize the map with OSM as default
  map = L.map("map", {
    center: manitCoordinates,
    zoom: defaultZoom,
    layers: [osmLayer], // Default Layer
  });

  // Layer control for toggling between views
  const baseMaps = {
    "Normal View": osmLayer,
    "Satellite View": satelliteLayer,
  };

  L.control.layers(baseMaps).addTo(map); // Adds toggle on top right

  const searchInput = document.getElementById("search-input");
  const suggestionsList = document.getElementById("search-suggestions");

  // Search Functionality
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

// Function to add marker on map
function addMarker(location) {
  clearMarkers();
  const marker = L.marker([location.latitude, location.longitude])
    .addTo(map)
    .bindPopup(`<b>${location.name}</b>`)
    .openPopup();

  markers.push(marker);
  map.setView([location.latitude, location.longitude], 18);
}

// Clear existing markers
function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
}
