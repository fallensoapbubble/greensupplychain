import React, { useEffect, useRef, useState } from "react";

const Route = () => {
  const mapRef = useRef(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const backendURL = "https://demand-production.up.railway.app";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCrTX-gRHbf-ZQ_k5Ji61IqrQENwJ7RUfA&libraries=places,geometry&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initMap;
    document.head.appendChild(script);
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 19.0760, lng: 72.8777 },
      zoom: 10,
    });

    const autocompleteOrigin = new window.google.maps.places.Autocomplete(
      document.getElementById("origin")
    );
    const autocompleteDestination = new window.google.maps.places.Autocomplete(
      document.getElementById("destination")
    );
  };

  const findRoute = () => {
    if (!origin || !destination) {
      setStatusMessage("❌ Please enter both origin and destinations.");
      return;
    }

    getCoordinates(origin, (originCoords) => {
      getCoordinates(destination, (destinationCoords) => {
        fetchRoutes(originCoords, destinationCoords);
      });
    });
  };

  const getCoordinates = (address, callback) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, function (results, status) {
      if (status === "OK" && results.length > 0) {
        const location = results[0].geometry.location;
        callback(location);
      } else {
        alert(`❌ Geocode failed for ${address}: ${status}`);
      }
    });
  };

  const fetchRoutes = (originCoords, destinationCoords) => {
    const requestBody = {
      origin: {
        latitude: originCoords.lat(),
        longitude: originCoords.lng(),
      },
      destination: {
        latitude: destinationCoords.lat(),
        longitude: destinationCoords.lng(),
      },
    };

    fetch(`${backendURL}/get-alternative-routes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.routes.length > 0) {
          processRoutes(data.routes);
        } else {
          setStatusMessage("❌ No alternative routes available.");
        }
      })
      .catch((err) => console.error("❌ Error fetching routes:", err));
  };

  const processRoutes = (routes) => {
    setStatusMessage("✅ Routes retrieved successfully!");
    let bestRoute = null;
    let bestScore = Infinity;

    routes.forEach((routeData, index) => {
      let totalDistance = 0;
      let totalDuration = 0;
      let summary = "";
      const polyline = routeData.polyline.encodedPolyline;

      routeData.legs.forEach((leg) => {
        const distance = leg.distanceMeters || 0;
        const duration =
          leg.staticDuration
            ? parseInt(leg.staticDuration.match(/\d+/)[0]) || 0
            : leg.duration?.value || 0;
        totalDistance += distance;
        totalDuration += duration;
        summary += `Leg: ${leg.start_address} to ${leg.end_address} - Distance: ${distance}, Duration: ${duration}\n`;
      });

      const carbon = ((totalDistance / 1000) * 0.2).toFixed(2);
      const score = totalDistance * 0.3 + totalDuration * 0.4 + carbon * 0.3;

      if (score < bestScore) {
        bestScore = score;
        bestRoute = {
          routeIndex: index + 1,
          totalDistance,
          totalDuration,
          polyline,
          carbon,
          summary,
        };
      }
    });

    if (bestRoute) {
      const path = window.google.maps.geometry.encoding.decodePath(bestRoute.polyline);
      const map = new window.google.maps.Map(mapRef.current, {
        center: path[0],
        zoom: 13,
      });
      new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map,
      });

      setStatusMessage(`✅ Optimal Route Found!\nDistance: ${bestRoute.totalDistance}m, Duration: ${bestRoute.totalDuration}s, Carbon: ${bestRoute.carbon}kg CO2`);
    }
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", padding: 20, backgroundColor: "#f4f4f9" }}>
      <h1 style={{ textAlign: "center" }}>Sustainable Route Optimizer</h1>
      <div style={{ marginBottom: 20 }}>
        <input
          id="origin"
          type="text"
          placeholder="Enter origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          style={{ padding: 10, width: "100%", fontSize: 16, marginBottom: 10 }}
        />
        <input
          id="destination"
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ padding: 10, width: "100%", fontSize: 16, marginBottom: 10 }}
        />
        <button
          onClick={findRoute}
          style={{ padding: 10, width: "100%", fontSize: 16, backgroundColor: "#4CAF50", color: "white", border: "none", cursor: "pointer" }}
        >
          Find Route
        </button>
        <p style={{ color: "#444", marginTop: 10 }}>{statusMessage}</p>
      </div>
      <div ref={mapRef} style={{ height: 500, width: "100%", border: "1px solid #ccc" }}></div>
    </div>
  );
};

export default Route;