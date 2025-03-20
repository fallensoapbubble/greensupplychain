
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import Analytics from "./Analytics/Analytics";
import Dashboard from "./Dashboard/Dashboard";



function MainPage() {
    const navigate = useNavigate();
  
    const navigateTo = (path) => {
      navigate(path);
    };
  
    return (
      <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
        <Card style={{ width: "300px" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View detailed analytics and insights.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => navigateTo(<Analytics)}
            >
              Go to Analytics
            </Button>
          </CardContent>
        </Card>
  
        <Card style={{ width: "300px" }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access your dashboard and manage data.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "10px" }}
              onClick={() => navigateTo(<Dashboard/>)}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  export default MainPage;