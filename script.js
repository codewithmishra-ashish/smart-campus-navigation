let map;
let directionsService;
let directionsRenderer;
let sourceMarker, destinationMarker;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 23.213, lng: 77.4325 }, // MANIT Bhopal Center
    zoom: 16,
  });

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({ map });

  // Example: Click on the map to set source/destination
  map.addListener("click", (e) => {
    if (!sourceMarker) {
      sourceMarker = new google.maps.Marker({
        position: e.latLng,
        map: map,
        label: "S",
      });
    } else if (!destinationMarker) {
      destinationMarker = new google.maps.Marker({
        position: e.latLng,
        map: map,
        label: "D",
      });
    } else {
      alert("Path already set! Clear to start again.");
    }
  });

  // Event listener for Find Path button
  document.getElementById("findPathButton").addEventListener("click", () => {
    if (sourceMarker && destinationMarker) {
      findPath(sourceMarker.getPosition(), destinationMarker.getPosition());
    } else {
      alert("Please set both Source and Destination points.");
    }
  });
}

// Function to calculate and display the route
function findPath(source, destination) {
  const request = {
    origin: source,
    destination: destination,
    travelMode: google.maps.TravelMode.WALKING, // Can change to DRIVING or BICYCLING
  };

  directionsService.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsRenderer.setDirections(result);
    } else {
      alert("Could not find a path. Try again.");
      console.error("Directions request failed due to " + status);
    }
  });
}
