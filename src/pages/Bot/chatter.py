import json
from flask import Flask, jsonify

app = Flask(__name__)

# Mock data for AQI of top 10 places
def get_top_10_aqi():
    return [
        {"place": "City A", "AQI": 45},
        {"place": "City B", "AQI": 50},
        {"place": "City C", "AQI": 55},
        {"place": "City D", "AQI": 60},
        {"place": "City E", "AQI": 65},
        {"place": "City F", "AQI": 70},
        {"place": "City G", "AQI": 75},
        {"place": "City H", "AQI": 80},
        {"place": "City I", "AQI": 85},
        {"place": "City J", "AQI": 90},
    ]

@app.route('/api/aqi', methods=['GET'])
def send_aqi_data():
    data = get_top_10_aqi()
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)