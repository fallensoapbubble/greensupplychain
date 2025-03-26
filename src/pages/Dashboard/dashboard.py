import os
from flask import Flask, jsonify
import pandas as pd
import numpy as np
from google.cloud import aiplatform
from vertexai.language_models import TextGenerationModel
from vertexai.preview import ml

class EmissionsRecommendationEngine:
    def __init__(self, project_id, location='us-central1'):
        """
        Initialize Vertex AI Recommendation Engine
        
        Args:
            project_id (str): Google Cloud Project ID
            location (str): GCP region
        """
        # Initialize Vertex AI
        aiplatform.init(project=project_id, location=location)
        
        # Load emissions data
        self.emissions_data = pd.read_csv('emissions_data.csv')
        
        # Initialize text generation model
        self.text_model = TextGenerationModel.from_pretrained("text-bison@001")
    
    def analyze_emissions_patterns(self):
        """
        Analyze emissions data to identify key insights
        
        Returns:
            dict: Key insights about emissions
        """
        insights = {
            'total_emissions': self.emissions_data['emissions'].sum(),
            'avg_monthly_emissions': self.emissions_data.groupby('month')['emissions'].mean(),
            'top_emission_sources': self.emissions_data.groupby('source')['emissions'].sum().nlargest(3),
            'scope_breakdown': self.emissions_data.groupby('scope')['emissions'].sum()
        }
        return insights
    
    def generate_vertex_recommendations(self, insights):
        """
        Use Vertex AI to generate contextual recommendations
        
        Args:
            insights (dict): Emissions insights
        
        Returns:
            list: AI-generated recommendations
        """
        # Prepare prompt with emissions insights
        prompt = f"""
        Based on the following emissions data insights:
        - Total Emissions: {insights['total_emissions']} metric tons
        - Top Emission Sources: {', '.join(insights['top_emission_sources'].index)}
        - Scope Emissions: {insights['scope_breakdown']}

        Generate 5 specific, data-driven recommendations to reduce greenhouse gas emissions 
        across different scopes and sources. Each recommendation should include:
        1. Specific action
        2. Potential emission reduction
        3. Estimated implementation cost
        4. Potential long-term benefits
        """
        
        try:
            # Generate recommendations using Vertex AI
            response = self.text_model.predict(
                prompt,
                max_output_tokens=1024,
                temperature=0.2,
                top_p=0.8,
                top_k=40
            )
            
            # Parse and clean recommendations
            recommendations = response.text.strip().split('\n')
            return [rec.strip() for rec in recommendations if rec.strip()]
        
        except Exception as e:
            print(f"Error generating recommendations: {e}")
            return [
                "Optimize energy efficiency in manufacturing processes",
                "Transition to renewable energy sources",
                "Implement more sustainable transportation methods"
            ]
    
    def predict_future_emissions(self):
        """
        Use Vertex AI for emissions forecasting
        
        Returns:
            pd.DataFrame: Predicted future emissions
        """
        try:
            # Load a pre-trained time series forecasting model
            forecasting_model = ml.TimeSeriesModel.get(
                f"projects/{os.environ['GCP_PROJECT_ID']}/locations/us-central1/models/emissions-forecast"
            )
            
            # Predict future emissions
            predictions = forecasting_model.predict(self.emissions_data)
            return predictions
        
        except Exception as e:
            print(f"Forecasting error: {e}")
            # Fallback simple forecasting
            return self._simple_forecast()
    
    def _simple_forecast(self):
        """
        Simple time series forecasting as a fallback
        
        Returns:
            list: Forecasted emissions for next 6 months
        """
        last_6_months = self.emissions_data.tail(6)
        avg_monthly_change = last_6_months['emissions'].pct_change().mean()
        
        forecasted_emissions = []
        last_emission = last_6_months['emissions'].iloc[-1]
        
        for _ in range(6):
            last_emission *= (1 + avg_monthly_change)
            forecasted_emissions.append(last_emission)
        
        return forecasted_emissions

def create_emissions_report(project_id):
    """
    Generate comprehensive emissions report
    
    Args:
        project_id (str): Google Cloud Project ID
    
    Returns:
        dict: Comprehensive emissions analysis and recommendations
    """
    engine = EmissionsRecommendationEngine(project_id)
    
    # Analyze emissions
    insights = engine.analyze_emissions_patterns()
    
    # Generate AI recommendations
    recommendations = engine.generate_vertex_recommendations(insights)
    
    # Forecast future emissions
    forecast = engine.predict_future_emissions()
    
    return {
        'insights': insights,
        'recommendations': recommendations,
        'forecast': forecast
    }

# Flask API Endpoint
app = Flask(__name__)

@app.route('/api/emissions-report')
def emissions_report():
    project_id = os.environ.get('GCP_PROJECT_ID', 'your-project-id')
    report = create_emissions_report(project_id)
    return jsonify(report)

if __name__ == '__main__':
    app.run(debug=True)