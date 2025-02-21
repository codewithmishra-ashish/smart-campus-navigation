let map;
let markers = [];
let routingControl;

const myLocation = [23.211236, 77.39374]; // Your Location Coordinates

document.addEventListener("DOMContentLoaded", function () {
  const manitCoordinates = [23.2149, 77.3919]; // Center of MANIT
  const defaultZoom = 16;

  // Initialize Map
  map = L.map("map", {
    center: manitCoordinates,
    zoom: defaultZoom,
  });

  // OSM Tile Layer
  const osmLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  ).addTo(map);

  // Satellite Tile Layer
  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles © Esri" }
  );

  // Layer Control
  const baseMaps = {
    "Normal View": osmLayer,
    "Satellite View": satelliteLayer,
  };
  L.control.layers(baseMaps).addTo(map);

  // 🔵 Add My Location (Blue Dot)
  L.circleMarker(myLocation, {
    radius: 8,
    color: "#0000FF", // Blue outline
    fillColor: "#0000FF", // Blue fill
    fillOpacity: 1,
  })
    .addTo(map)
    .bindPopup("You are here")
    .openPopup();

  // Search Elements
  const searchInput = document.getElementById("search-input");
  const suggestionsList = document.getElementById("search-suggestions");

  // 📍 Search Functionality
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
              addRedCircle(location);
              searchInput.value = location.name;
              showFindPathButton(location);
            });
            suggestionsList.appendChild(li);
          });
        });
    } else {
      suggestionsList.innerHTML = "";
    }
  });

  // Close Suggestions on Click Outside
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && e.target.id !== "find-path-btn") {
      suggestionsList.innerHTML = "";
    }
  });
});

// 🔴 Add Red Circle for Destination
function addRedCircle(location) {
  clearMarkers();

  const redCircle = L.circleMarker([location.latitude, location.longitude], {
    radius: 8,
    color: "#FF0000", // Red outline
    fillColor: "#FF0000", // Red fill
    fillOpacity: 1,
  })
    .addTo(map)
    .bindPopup(`<b>${location.name}</b>`)
    .openPopup();

  markers.push(redCircle);

  // Center on Destination
  map.setView([location.latitude, location.longitude], 18);
}

// ❌ Clear Previous Markers and Routes
function clearMarkers() {
  markers.forEach((marker) => map.removeLayer(marker));
  markers = [];
  if (routingControl) {
    map.removeControl(routingControl);
  }
}

// 🛣️ Show "Find Path" Button After Search
function showFindPathButton(location) {
  const existingButton = document.getElementById("find-path-btn");
  if (existingButton) existingButton.remove();

  const findPathBtn = document.createElement("button");
  findPathBtn.id = "find-path-btn";
  findPathBtn.textContent = "Find Path";
  findPathBtn.style.position = "absolute";
  findPathBtn.style.top = "70px";
  findPathBtn.style.right = "20px";
  findPathBtn.style.padding = "10px 15px";
  findPathBtn.style.backgroundColor = "#007bff";
  findPathBtn.style.color = "#fff";
  findPathBtn.style.border = "none";
  findPathBtn.style.borderRadius = "5px";
  findPathBtn.style.cursor = "pointer";
  findPathBtn.style.zIndex = 1002;

  document.body.appendChild(findPathBtn);

  findPathBtn.addEventListener("click", () => {
    findPath(myLocation, [location.latitude, location.longitude]);
    findPathBtn.remove(); // Remove button after use
  });
}

// 🗺️ Find Shortest Path Using OSRM (Road-Based)
function findPath(start, end) {
  if (routingControl) {
    map.removeControl(routingControl);
  }

  routingControl = L.Routing.control({
    waypoints: [L.latLng(start[0], start[1]), L.latLng(end[0], end[1])],
    lineOptions: {
      styles: [{ color: "red", weight: 5 }],
    },
    createMarker: function (i, waypoint) {
      return L.circleMarker(waypoint.latLng, {
        radius: 8,
        color: i === 0 ? "#0000FF" : "#FF0000", // Blue for start, Red for end
        fillColor: i === 0 ? "#0000FF" : "#FF0000",
        fillOpacity: 1,
      }).bindPopup(i === 0 ? "You are here" : "Destination");
    },
    router: new L.Routing.osrmv1({
      serviceUrl: "https://router.project-osrm.org/route/v1", // OSRM API
    }),
    fitSelectedRoutes: true, // Auto zoom to fit route
    show: false,
  })
    .on("routesfound", function (e) {
