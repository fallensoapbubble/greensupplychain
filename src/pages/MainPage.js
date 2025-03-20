import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import "./MainPage.css"; 

function MainPage() {
  const navigate = useNavigate();
  const navigateTo = (path) => navigate(path);

  const cards = [
    {
      title: "Analytics",
      description: "View detailed analytics and insights.",
      path: "/analytics",
    },
    {
      title: "Dashboard",
      description: "Access your dashboard and manage data.",
      path: "/dashboard",
    },
    {
      title: "Inventory",
      description: "Access your Inventory.",
      path: "/inventory",
    },
    {
        title: "Optimize Routes",
        description: "Greener Routes Right now!",
        path: "/routemanager",
      }
  ];

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {cards.map((card, index) => (
        <Card key={index} style={{ width: "300px" }}>
          <CardContent>
            <Typography variant="h5">{card.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {card.description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => navigateTo(card.path)}
            >
              Go to {card.title}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default MainPage;
