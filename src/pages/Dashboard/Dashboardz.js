import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress 
} from '@mui/material';
import axios from 'axios';

const Dashboard = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmissionsReport = async () => {
      try {
        const response = await axios.get('/api/emissions-report');
        setReport(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching emissions report:', error);
        setLoading(false);
      }
    };

    fetchEmissionsReport();
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Emissions Insights & Recommendations
        </Typography>

        {/* Insights Section */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Total Emissions Insights</Typography>
            <Typography>
              Total Emissions: {report.insights.total_emissions.toFixed(2)} metric tons
            </Typography>
            <Typography>
              Top Emission Sources: {Object.keys(report.insights.top_emission_sources).join(', ')}
            </Typography>
          </Grid>

          {/* Scope Emissions Breakdown */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">Emissions by Scope</Typography>
            {Object.entries(report.insights.scope_breakdown).map(([scope, emissions]) => (
              <Typography key={scope}>
                {scope}: {emissions.toFixed(2)} metric tons
              </Typography>
            ))}
          </Grid>
        </Grid>

        {/* AI-Generated Recommendations */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          AI-Powered Optimization Recommendations
        </Typography>
        {report.recommendations.map((rec, index) => (
          <Card 
            key={index} 
            variant="outlined" 
            sx={{ mb: 2, p: 2, backgroundColor: 'rgba(0,128,0,0.05)' }}
          >
            <Typography>{rec}</Typography>
          </Card>
        ))}

        {/* Emissions Forecast */}
        <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
          Emissions Forecast
        </Typography>
        <Grid container spacing={2}>
          {report.forecast.map((forecastValue, index) => (
            <Grid item xs={2} key={index}>
              <Typography>
                Month {index + 1}: {forecastValue.toFixed(2)} tons
              </Typography>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Dashboard;