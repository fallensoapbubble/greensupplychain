import React, { useEffect, useRef, useState } from "react";

const Route = () => {
  const mapRef = useRef(null);
  const originInputRef = useRef(null);
  const destinationInputRef = useRef(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [routeSummaries, setRouteSummaries] = useState([]);
  const [optimalRoute, setOptimalRoute] = useState(null);
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
    setStatusMessage("🔍 Fetching routes...");
    
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
        if (data.success && data.routes && data.routes.length > 0) {
          processRoutes(data.routes);
          setStatusMessage("✅ Routes retrieved successfully!");
        } else {
          setStatusMessage("❌ No alternative routes available.");
        }
      })
      .catch((err) => {
        console.error("❌ Error fetching routes:", err);
        setStatusMessage("❌ Failed to fetch routes.");
      });
  };

  const getSustainabilityMetrics = (distance) => {
    // Simplified carbon footprint calculation
    const carbonFootprint = (distance / 1000) * 0.2;
    return {
      carbonFootprint: carbonFootprint.toFixed(2)
    };
  };

  const calculateRouteScore = (distance, duration, carbonFootprint) => {
    const distanceWeight = 0.3;
    const durationWeight = 0.4;
    const carbonFootprintWeight = 0.3;

    return (distance * distanceWeight) + (duration * durationWeight) + (parseFloat(carbonFootprint) * carbonFootprintWeight);
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
      if (!routeData.polyline || !routeData.polyline.encodedPolyline) {
        console.error(`⚠ Route ${index + 1} has no polyline.`);
        return;
      }

      const polyline = routeData.polyline.encodedPolyline;
      const path = window.google.maps.geometry.encoding.decodePath(polyline);

      let totalDistance = 0;
      let totalDuration = 0;
      let routeSummary = "";

      if (routeData.legs && routeData.legs.length > 0) {
        routeData.legs.forEach((leg, legIndex) => {
          const distance = leg.distanceMeters || (leg.distance && leg.distance.value) || 0;
          const duration = leg.staticDuration 
            ? parseInt(leg.staticDuration.match(/\d+/)[0]) || 0 
            : (leg.duration && leg.duration.value) || 0;

          totalDistance += distance;
          totalDuration += duration;

          routeSummary += `Leg: ${leg.start_address || 'Start'} to ${leg.end_address || 'End'} - Distance: ${distance} meters, Duration: ${duration} seconds.\n`;
          
          // Add step-by-step instructions if available
          if (leg.steps && leg.steps.length > 0) {
            leg.steps.forEach((step, stepIndex) => {
              if (step.navigationInstruction) {
                const maneuver = step.navigationInstruction.maneuver || '';
                let instructions = step.navigationInstruction.instructions || '';
                instructions = instructions.replace(/[^a-zA-Z0-9\s-]/g, '');
                
                routeSummary += `Step ${stepIndex + 1}: Maneuver: ${maneuver}, Instruction: ${instructions}\n`;
              }
            });
          }
        });
      }

      const sustainabilityMetrics = getSustainabilityMetrics(totalDistance);
      const routeScore = calculateRouteScore(totalDistance, totalDuration, sustainabilityMetrics.carbonFootprint);
      const isBest = routeScore < bestScore;

      if (isBest) {
        bestScore = routeScore;
        bestRoute = {
          index: index + 1,
          totalDistance,
          totalDuration,
          carbonFootprint: sustainabilityMetrics.carbonFootprint,
          polyline
        };
      }

      summaries.push({
        index: index + 1,
        totalDistance,
        totalDuration,
        carbonFootprint: sustainabilityMetrics.carbonFootprint,
        summary: routeSummary,
        polyline,
        simulatedAQI: Math.floor(Math.random() * 100) + 50, // Just for simulation
      });

      new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: isBest ? "#FF0000" : "#888",
        strokeOpacity: 1.0,
        strokeWeight: isBest ? 4 : 2,
        map,
      });
    });

    setRouteSummaries(summaries);
    setOptimalRoute(bestRoute);
    setStatusMessage("✅ All routes displayed with directions. Optimal route highlighted in red.");
  };

  return (
    <div style={{ fontFamily: "Roboto, sans-serif", padding: 20, backgroundColor: "#f4f4f9" }}>
      <h1 style={{ textAlign: "center" }}>Sustainable Route Optimizer</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          id="origin"
          ref={originInputRef}
          type="text"
          placeholder="Enter origin location"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          style={{ padding: 10, width: "100%", fontSize: 16, marginBottom: 10 }}
        />
        <input
          id="destination"
          ref={destinationInputRef}
          type="text"
          placeholder="Enter destination location"
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

      {optimalRoute && (
        <div style={{ marginBottom: 20, padding: 15, backgroundColor: "#e8f5e9", borderRadius: 8, border: "1px solid #c8e6c9" }}>
          <h3 style={{ color: "#2e7d32", marginTop: 0 }}>Optimal Route Metrics</h3>
          <p><strong>Total Distance:</strong> {optimalRoute.totalDistance} meters</p>
          <p><strong>Total Duration:</strong> {optimalRoute.totalDuration} seconds</p>
          <p><strong>Carbon Footprint:</strong> {optimalRoute.carbonFootprint} kg CO₂</p>
        </div>
      )}

      {routeSummaries.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>Route Summaries:</h3>
          <p style={{ fontStyle: "italic", color: "#666" }}>
            * AQI values are randomly generated for simulation purposes.
          </p>
          {routeSummaries.map((route) => (
            <div
              key={route.index}
              style={{
                backgroundColor: route.index === optimalRoute?.index ? "#e8f5e9" : "#fff",
                border: `1px solid ${route.index === optimalRoute?.index ? "#c8e6c9" : "#ddd"}`,
                borderRadius: 8,
                padding: 15,
                marginBottom: 15,
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: route.index === optimalRoute?.index ? "#2e7d32" : "#333" }}>
                {route.index === optimalRoute?.index ? "Optimal Route" : `Route ${route.index}`}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: 10 }}>
                <span>🚗 Distance: {route.totalDistance}m</span>
                <span>⏱ Duration: {route.totalDuration}s</span>
                <span>🌿 Carbon: {route.carbonFootprint} kg CO₂</span>
                <span>🌀 Simulated AQI: {route.simulatedAQI}</span>
              </div>
              <div className="route-summary">
                <pre style={{ 
                  whiteSpace: "pre-wrap", 
                  fontFamily: "Courier New, monospace", 
                  fontSize: 14, 
                  backgroundColor: "#f5f5f5", 
                  padding: 10, 
                  borderRadius: 4, 
                  border: "1px solid #eee", 
                  overflow: "auto",
                  maxHeight: "250px"
                }}>
                  {route.summary}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={mapRef} style={{ height: 500, width: "100%", border: "1px solid #ccc", borderRadius: 4 }}></div>
    </div>
  );
};

export default Route;