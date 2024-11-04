document.addEventListener("DOMContentLoaded", function () {
  // Get reference to the search input element
  const searchInput = document.getElementById("search");
  // Initialize the map
  var map = L.map("map", {
    attributionControl: false,
    center: [12.8797, 121.774],
    zoom: 5,
  });
  // Add a tile layer (OpenStreetMap)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
  // Disable double-click zoom
  map.doubleClickZoom.disable();
  // Custom Marker Icon and styles
  var customIcon = L.icon({
    iconUrl: "loc.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    className: "custom-marker-icon",
  });
  // Add a marker with custom icon
  function onLocationFound(e) {
    L.marker(e.latlng, { icon: customIcon })
      .addTo(map)
      .bindPopup("You are here.")
      .openPopup();
  }
  // If user declines location access of device
  function onLocationError(e) {
    alert(e.message);
  }
  map.on("locationfound", onLocationFound);
  map.on("locationerror", onLocationError);
  map.locate({ setView: true, maxZoom: 16 });
  // Polygon display functionality
  let geojsonLayers = [null, null, null, null, null, null];
  let selectedFeature = null;
  const polygonStyle = {
    fillColor: "#0000",
    weight: 2,
    opacity: 1,
    color: "red",
    fillOpacity: 0.7,
  };
  const onEachFeature = function (feature, layer) {
    // Bind popup (if Name property exists)
    if (feature.properties && feature.properties.Title) {
      layer.bindPopup(`<b>${feature.properties.Title}</b>`);
    }
    // Hover effect
    layer.on({
      mouseover: function () {
        this.setStyle({
          fillOpacity: 0.9,
          fillColor: "yellow",
          weight: 5,
        });
        this.openPopup();
      },
      mouseout: function () {
        this.setStyle({
          fillOpacity: 0.7,
          weight: 2,
          fillColor: "#0000",
        });
        this.closePopup();
      },
      // Click event to show/hide polygon info container
      click: function () {
        // Only show the container if the Name property is not null or undefined
        if (feature.properties && feature.properties.Name) {
          const infoContainer = document.getElementById(
            "polygon-info-container"
          );

          if (selectedFeature === feature) {
            infoContainer.style.display = "none";
            selectedFeature = null;
          } else {
            // Conditionally display properties in a table format
            let contentHTML = `<h3>${feature.properties.Name}</h3> <br>
                               <table>`;
            if (feature.properties.Loc) {
              contentHTML += `<tr><td></td><td><img src="${feature.properties.Loc}" alt="" width="250"></td></tr>`;
            }
            if (feature.properties.Title) {
              contentHTML += `<tr><td>Project Title:</td><td>${feature.properties.Target}</td></tr>`;
            }
            if (feature.properties.Proponents) {
              contentHTML += `<tr><td>Leaders:</td><td>${feature.properties.Proponents}</td></tr>`;
            }
            if (feature.properties.Leaders) {
              contentHTML += `<tr><td>Assistant:</td><td>${feature.properties.Leaders}</td></tr>`;
            }
            if (feature.properties.Assistant) {
              contentHTML += `<tr><td>Duration:</td><td>${feature.properties.Assistant}</td></tr>`;
            }
            if (feature.properties.Duration) {
              contentHTML += `<tr><td>Fund Source:</td><td>${feature.properties.Duration}</td></tr>`;
            }
            contentHTML += `</table><button id="close-polygon-info">Close</button>`;
            infoContainer.innerHTML = contentHTML;
            infoContainer.style.display = "block";
            selectedFeature = feature;
            document
              .getElementById("close-polygon-info")
              .addEventListener("click", function () {
                document.getElementById(
                  "polygon-info-container"
                ).style.display = "none";
              });
          }
        }
      },
    });
  };

  function displayPoints(fileName) {
    fetch(fileName)
      .then((response) => response.json())
      .then((data) => {
        const geojsonLayer = L.geoJSON(data, {
          pointToLayer: function (feature, latlng) {
            const marker = L.marker(latlng).bindPopup(
              `<b>${feature.properties.Title}</b>`
            );

            marker.on({
              mouseover: function () {
                this.openPopup();
              },
              mouseout: function () {
                this.closePopup();
              },
              click: function () {
                window.open(feature.properties.Link, "_blank");
              },
            });

            return marker;
          },
        }).addTo(map);

        map.fitBounds(geojsonLayer.getBounds());
      });
  }
  // Generalized function to display/remove a GeoJSON layer
  function displayPolygon(fileName, layerIndex, color = "red") {
    if (geojsonLayers[layerIndex]) {
      map.removeLayer(geojsonLayers[layerIndex]);
      geojsonLayers[layerIndex] = null;
      document.getElementById("polygon-info-container").style.display = "none";
    } else {
      fetch(fileName)
        .then((response) => response.json())
        .then((data) => {
          geojsonLayers[layerIndex] = L.geoJSON(data, {
            style: function (feature) {
              if (
                feature.properties.Name === null ||
                feature.properties.Name === undefined
              ) {
                return { ...polygonStyle, color: "green" };
              } else {
                return { ...polygonStyle, color };
              }
            },
            onEachFeature: onEachFeature,
          }).addTo(map);
          map.fitBounds(geojsonLayers[layerIndex].getBounds());
        });
    }
  }
  // Get all buttons in the table container
  const buttons = document.querySelectorAll("#table-container button");

  // Attach click event listeners to buttons dynamically
  buttons.forEach((button, index) => {
    const fileName = `Brgy/Polygon${index + 1}.geojson`; // Adjust file names as needed
    button.addEventListener("click", () => {
      displayPoints(fileName);
    });
  });
  // Function to filter buttons
  function filterButtons() {
    const searchTerm = searchInput.value.toLowerCase();
    buttons.forEach((button) => {
      const buttonText = button.textContent.toLowerCase();
      button.style.display = buttonText.includes(searchTerm) ? "block" : "none";
    });
  }
  // Event listener for search input changes
  searchInput.addEventListener("input", filterButtons);
  // Logout button functionality
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", () => {
    window.location.href = "../../index.html";
  });
  // Toggle the table container

  // Function for your button (replace with your actual logic)
  function yourFunction() {
    alert("Button clicked!");
    // Add your desired map functionality here
  }
});
let userLocation = null;
let currentLocationMarker = null;
const newButton = document.getElementById("logout-button2");
// Add a click event listener to the new button
newButton.addEventListener("click", () => {
  // Check if userLocation is available and has valid coordinates
  if (userLocation && userLocation.lat && userLocation.lng) {
    // Center the map on the user's location and open the popup
    onLocationFound({ latlng: userLocation });
  } else {
    // Handle the case where location is not available
    alert(
      "Location access is not available or not yet determined. Please enable location services in your browser settings."
    );
  }
});
