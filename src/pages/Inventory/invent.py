from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

# Configuration for data file (update this if needed)
DATA_FILE = 'sample_demand_data.csv'  # Or 'your_demand_data.csv'

# Initialize model and label encoders
model = None
label_encoders = {}
accuracy_metrics = {}

# Load and Preprocess Data
try:
    data = pd.read_csv(DATA_FILE)

    # Preprocessing
    data['Order Date'] = pd.to_datetime(data['Order Date'])
    data['Order Date'] = data['Order Date'].map(datetime.toordinal)
    data = data.dropna()

    # Encode categorical features
    categorical_cols = ['Product ID', 'Plant Code', 'Customer']
    for col in categorical_cols:
        le = LabelEncoder()
        data[col] = le.fit_transform(data[col])
        label_encoders[col] = le

    # Define features (X) and target (y)
    features = ['Product ID', 'Plant Code', 'Customer', 'Order Date', 'Rolling_7day_demand', 'Rolling_30day_demand']
    target = 'Demand'

    if target not in data.columns or not all(col in data.columns for col in features):
        raise KeyError("Target or feature columns not found in the data.")

    X = data[features]
    y = data[target]

    # Split data for training and testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the Random Forest Regressor model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Evaluate the model
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    accuracy_metrics = {
        'mean_squared_error': mse,
        'r_squared': r2
    }

    print("Model trained and accuracy metrics calculated successfully.")
    print(f"Mean Squared Error (MSE): {mse:.2f}")
    print(f"R-squared (R2): {r2:.2f}")

except FileNotFoundError:
    print(f"Error: Data file '{DATA_FILE}' not found. Please provide the correct file path.")
except KeyError as e:
    print(f"Error: Column '{e}' not found in the data. Please check the column names in '{DATA_FILE}'.")
except Exception as e:
    print(f"An error occurred during data loading, preprocessing, or model training: {e}")

@app.route('/predict_demand', methods=['POST'])
def predict_demand():
    if model is None:
        return jsonify({'error': 'Model not loaded due to an error during startup.'}), 500

    try:
        data = request.get_json()
        input_data = {
            'Product ID': data.get('Product ID', ''),
            'Plant Code': data.get('Plant Code', ''),
            'Customer': data.get('Customer', ''),
            'Order Date': data.get('Order Date', ''),
            'Rolling_7day_demand': float(data.get('Rolling_7day_demand', 0)),
            'Rolling_30day_demand': float(data.get('Rolling_30day_demand', 0))
        }

        if not all(input_data.get(key) is not None for key in input_data):
            return jsonify({'error': 'Missing required input fields.'}), 400

        encoded_data = {}
        for col in ['Product ID', 'Plant Code', 'Customer']:
            if col in label_encoders and input_data[col] is not None:
                try:
                    encoded_data[col] = label_encoders[col].transform([input_data[col]])[0]
                except ValueError:
                    return jsonify({'error': f'Invalid value for {col}.'}), 400
            else:
                return jsonify({'error': f'Missing or invalid LabelEncoder for {col}.'}), 500

        try:
            order_date_str = input_data.get('Order Date')
            if order_date_str:
                order_date = datetime.strptime(order_date_str, '%Y-%m-%d')
                encoded_data['Order Date'] = order_date.toordinal()
            else:
                return jsonify({'error': 'Invalid or missing Order Date.'}), 400
        except ValueError:
            return jsonify({'error': 'Invalid Order Date format. Please use YYYY-MM-DD.'}), 400

        features_for_prediction = [
            encoded_data.get('Product ID'),
            encoded_data.get('Plant Code'),
            encoded_data.get('Customer'),
            encoded_data.get('Order Date'),
            input_data.get('Rolling_7day_demand'),
            input_data.get('Rolling_30day_demand')
        ]

        if None in features_for_prediction:
            return jsonify({'error': 'Error preparing input data for prediction.'}), 400

        prediction = model.predict([features_for_prediction])[0]
        return jsonify({'predicted_demand': prediction}), 200

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/accuracy', methods=['GET'])
def get_accuracy():
    if not accuracy_metrics:
        return jsonify({'error': 'Accuracy metrics not available as the model could not be trained successfully.'}), 500
    return jsonify(accuracy_metrics), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)