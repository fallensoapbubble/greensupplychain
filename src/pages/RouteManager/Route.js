import React, { useEffect, useRef, useState } from "react";

const Route = () => {
  const mapRef = useRef(null);
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [routeSummaries, setRouteSummaries] = useState([]);
  const backendURL = "https://demand-production.up.railway.app"; // Your existing backend URL

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrTX-gRHbf-ZQ_k5Ji61IqrQENwJ7RUfA&libraries=places,geometry&callback=initMap";
    script.async = true;
    script.defer = true;
    window.initMap = initMap;
    document.head.appendChild(script);

    return () => {
      // Clean up the global initMap function when component unmounts
      window.initMap = undefined;
    };
  }, []);

  const initMap = () => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 19.076, lng: 72.8777 },
      zoom: 10,
    });

    // Setup autocomplete for origin and destination
    if (originInputRef.current && destinationInputRef.current) {
      const originAutocomplete = new window.google.maps.places.Autocomplete(originInputRef.current);
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(destinationInputRef.current);
      
      // Listen for place selection and update state
      originAutocomplete.addListener("place_changed", () => {
        const place = originAutocomplete.getPlace();
        setOrigin(place.formatted_address || place.name);
      });
      
      destinationAutocomplete.addListener("place_changed", () => {
        const place = destinationAutocomplete.getPlace();
        setDestination(place.formatted_address || place.name);
      });
    }
  };

  const findRoute = () => {
    if (!origin || !destination) {
      setStatusMessage("❌ Please enter both origin and destination.");
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
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        callback(results[0].geometry.location);
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
      .catch((err) => {
        console.error("❌ Error fetching routes:", err);
        setStatusMessage("❌ Failed to fetch routes.");
      });
  };

  const processRoutes = (routes) => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 19.076, lng: 72.8777 },
      zoom: 11,
    });

    let bestRoute = null;
    let bestScore = Infinity;
    const summaries = [];

    routes.forEach((routeData, index) => {
      const polyline = routeData.polyline.encodedPolyline;
      const path = window.google.maps.geometry.encoding.decodePath(polyline);

      let totalDistance = 0;
      let totalDuration = 0;
      let legSummary = "";

      if (routeData.legs && routeData.legs.length > 0) {
        routeData.legs.forEach((leg, i) => {
          const distance = leg.distanceMeters || 0;
          const duration = leg.staticDuration
            ? parseInt(leg.staticDuration.match(/\d+/)[0]) || 0
            : leg.duration?.value || 0;

          totalDistance += distance;
          totalDuration += duration;
          legSummary += `-> ${leg.start_address || 'Start'} to ${leg.end_address || 'End'} | Distance: ${distance}m | Duration: ${duration}s\n`;
        });
      }

      const carbon = ((totalDistance / 1000) * 0.2).toFixed(2); // in kg CO2
      const score = totalDistance * 0.3 + totalDuration * 0.4 + carbon * 0.3;
      const isBest = score < bestScore;

      if (isBest) {
        bestScore = score;
        bestRoute = { path };
      }

      summaries.push({
        index: index + 1,
        totalDistance,
        totalDuration,
        carbon,
        summary: legSummary,
        polyline,
        simulatedAQI: Math.floor(Math.random() * 100) + 50, // Just for simulation
      });

      new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: isBest ? "#FF0000" : "#888",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map,
      });
    });

    setRouteSummaries(summaries);
    setStatusMessage("✅ All routes displayed with directions. Optimal one highlighted in red.");
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", padding: 20, backgroundColor: "#f4f4f9" }}>
      <h1 style={{ textAlign: "center" }}>Sustainable Route Optimizer</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          id="origin"
          ref={originInputRef}
          type="text"
          placeholder="Enter origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          style={{ padding: 10, width: "100%", fontSize: 16, marginBottom: 10 }}
        />
        <input
          id="destination"
          ref={destinationInputRef}
          type="text"
          placeholder="Enter destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ padding: 10, width: "100%", fontSize: 16, marginBottom: 10 }}
        />
        <button
          onClick={findRoute}
          style={{
            padding: 10,
            width: "100%",
            fontSize: 16,
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Find Route
        </button>
        <p style={{ color: "#444", marginTop: 10 }}>{statusMessage}</p>
      </div>

      {routeSummaries.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>Available Routes:</h3>
          <p style={{ fontStyle: "italic", color: "#999" }}>
            * AQI values are randomly changing for simulation purposes.
          </p>
          {routeSummaries.map((route) => (
            <div
              key={route.index}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: 10,
                marginBottom: 10,
                borderRadius: 8,
              }}
            >
              <strong>Route {route.index}</strong>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: 14 }}>
                {route.summary}
                🚗 Distance: {route.totalDistance}m | ⏱ Duration: {route.totalDuration}s | 🌿 Carbon: {route.carbon} kg CO₂ | 🌀 Simulated AQI: {route.simulatedAQI}
              </pre>
            </div>
          ))}
        </div>
      )}

      <div ref={mapRef} style={{ height: 500, width: "100%", border: "1px solid #ccc" }}></div>
    </div>
  );
};

export default Route;
