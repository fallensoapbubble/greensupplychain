import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPinIcon } from "lucide-react";

export default function Route({ routes }) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [optimalRoute, setOptimalRoute] = useState(null);
  const [status, setStatus] = useState("");

  const handleFindRoute = async () => {
    if (!origin || !destination) {
      setStatus("❌ Please enter both origin and destination.");
      return;
    }

    setStatus("Fetching routes...");

    try {
      const response = await fetch("http://127.0.0.1:5000/get-alternative-routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          origin: { latitude: 0, longitude: 0 }, // Replace with geocoded values
          destination: { latitude: 0, longitude: 0 }, // Replace with geocoded values
        }),
      });

      const data = await response.json();

      if (data.success && data.routes.length > 0) {
        const best = processRoutes(data.routes);
        setOptimalRoute(best);
        setStatus("✅ Optimal route retrieved.");
      } else {
        setStatus("❌ No alternative routes available.");
      }
    } catch (error) {
      setStatus("❌ Error fetching routes.");
      console.error(error);
    }
  };

  const getAQIMessage = (aqi) => {
    if (aqi <= 50) return { text: "Good", color: "text-green-600" };
    if (aqi <= 100) return { text: "Moderate", color: "text-yellow-500" };
    if (aqi <= 150) return { text: "Unhealthy for Sensitive Groups", color: "text-orange-500" };
    if (aqi <= 200) return { text: "Unhealthy", color: "text-red-600" };
    return { text: "Very Unhealthy", color: "text-purple-700" };
  };

  const getLegDescription = (leg) => {
    const start = leg.start_address || "Unknown Start";
    const end = leg.end_address || "Unknown End";
    const distance = leg.distanceMeters || leg.distance?.value || 0;
    const duration = leg.staticDuration
      ? parseInt(leg.staticDuration.match(/\d+/)?.[0] || "0", 10)
      : leg.duration?.value || 0;

    const aqi = leg.aqi || Math.floor(Math.random() * 200);
    const aqiMsg = getAQIMessage(aqi);

    return `
      Leg: ${start} to ${end} - Distance: ${distance} meters, Duration: ${duration} seconds.
      AQI: <span class="${aqiMsg.color} font-semibold">${aqi} (${aqiMsg.text})</span>
    `;
  };

  const getStepInstructions = (step, index) => {
    if (step.navigationInstruction) {
      const maneuver = step.navigationInstruction.maneuver;
      let instructions = step.navigationInstruction.instructions.replace(/[^a-zA-Z0-9\s-]/g, "");
      const match = instructions.match(/([A-Za-z]+)\s(.+)/);
      const formatted = match
        ? `<span class="maneuver">${match[1]}</span>: <span class="instructions">${match[2]}</span>`
        : instructions;

      return `Step ${index + 1}: Maneuver: ${maneuver}, Instruction: ${formatted}`;
    }
    return "";
  };

  const getSustainabilityMetrics = (distance) => {
    const carbonFootprint = (distance / 1000) * 0.2;
    return {
      carbonFootprint: carbonFootprint.toFixed(2),
    };
  };

  const calculateRouteScore = (distance, duration, carbon) => {
    return distance * 0.3 + duration * 0.4 + carbon * 0.3;
  };

  const processRoutes = (routes) => {
    let bestScore = Infinity;
    let best = null;

    routes.forEach((route, i) => {
      let totalDistance = 0;
      let totalDuration = 0;
      let summary = "";

      route.legs.forEach((leg) => {
        const dist = leg.distanceMeters || leg.distance?.value || 0;
        const dur = leg.staticDuration
          ? parseInt(leg.staticDuration.match(/\d+/)?.[0] || "0", 10)
          : leg.duration?.value || 0;

        totalDistance += dist;
        totalDuration += dur;

        summary += getLegDescription(leg) + "\n";

        leg.steps?.forEach((step, index) => {
          const instruction = getStepInstructions(step, index);
          if (instruction) summary += instruction + "\n";
        });
      });

      const sustainability = getSustainabilityMetrics(totalDistance);
      const score = calculateRouteScore(totalDistance, totalDuration, parseFloat(sustainability.carbonFootprint));

      if (score < bestScore) {
        bestScore = score;
        best = {
          index: i + 1,
          summary,
          distance: totalDistance,
          duration: totalDuration,
          sustainability,
        };
      }
    });

    return best;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Sustainable Route Optimizer</h1>
      <Input value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Enter origin location" />
      <Input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Enter destination location" />
      <Button onClick={handleFindRoute} className="mt-2">Find Route</Button>

      {status && <p className="mt-2 text-sm text-gray-600">{status}</p>}
      <p className="text-xs text-yellow-700 mt-1">* AQI of routes are changing just for the simulation part.</p>

      {optimalRoute && (
        <Card className="mt-4">
          <CardContent className="space-y-2">
            <h2 className="text-lg font-semibold">Optimal Route</h2>
            <p><strong>Total Distance:</strong> {optimalRoute.distance} meters</p>
            <p><strong>Total Duration:</strong> {optimalRoute.duration} seconds</p>
            <p><strong>Carbon Footprint:</strong> {optimalRoute.sustainability.carbonFootprint} kg CO2</p>
            <div className="bg-gray-100 p-2 rounded text-sm">
              <pre dangerouslySetInnerHTML={{ __html: optimalRoute.summary }}></pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}