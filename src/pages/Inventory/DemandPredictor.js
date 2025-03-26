import React, { useState } from 'react';
import axios from 'axios';

const DemandPredictor = () => {
    const [formData, setFormData] = useState({
        'Product ID': '',
        'Plant Code': '',
        'Customer': '',
        'Order Date': '',
        'Rolling_7day_demand': 0,
        'Rolling_30day_demand': 0
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Generate options for dropdowns
    const productIdOptions = Array.from({length: 5}, (_, i) => `P${101 + i}`);
    const plantCodeOptions = Array.from({length: 5}, (_, i) => `PL${i + 1}`);
    const customerOptions = Array.from({length: 5}, (_, i) => `CUST${String(i + 1).padStart(3, '0')}`);

    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
        },
        card: {
            width: '100%',
            maxWidth: '28rem',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(4px)',
            borderRadius: '0.75rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
        },
        title: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#1f2937',
            marginBottom: '1.5rem'
        },
        formGroup: {
            marginBottom: '1rem'
        },
        label: {
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#374151',
            marginBottom: '0.25rem'
        },
        select: {
            width: '100%',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'rgba(249, 250, 251, 0.5)',
            border: '1px solid rgba(209, 213, 219, 0.5)',
            borderRadius: '0.375rem'
        },
        button: {
            width: '100%',
            padding: '0.5rem',
            marginTop: '1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            color: 'white',
            borderRadius: '0.375rem',
            transition: 'background-color 0.3s',
            border: 'none'
        },
        buttonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed'
        },
        errorMessage: {
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(254, 202, 202, 0.8)',
            border: '1px solid rgba(248, 113, 113, 0.5)',
            color: '#7f1d1d',
            borderRadius: '0.375rem'
        },
        resultContainer: {
            marginTop: '1rem',
            padding: '1rem',
            borderRadius: '0.375rem',
            textAlign: 'center',
            background: 'linear-gradient(to right, rgba(191, 219, 254, 0.5), rgba(147, 197, 253, 0.5))'
        },
        resultTitle: {
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#1f2937'
        },
        resultValue: {
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginTop: '0.5rem',
            color: '#1f2937'
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('https://flaskbackk-production.up.railway.app/predict_demand', formData);
            setPrediction(response.data.predicted_demand);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to make prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Demand Prediction</h2>
                <form onSubmit={handleSubmit}>
                    {/* Dropdown for Product ID */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Product ID</label>
                        <select
                            name="Product ID"
                            value={formData['Product ID']}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            <option value="">Select Product ID</option>
                            {productIdOptions.map(id => (
                                <option key={id} value={id}>{id}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown for Plant Code */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Plant Code</label>
                        <select
                            name="Plant Code"
                            value={formData['Plant Code']}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            <option value="">Select Plant Code</option>
                            {plantCodeOptions.map(code => (
                                <option key={code} value={code}>{code}</option>
                            ))}
                        </select>
                    </div>

                    {/* Dropdown for Customer */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Customer</label>
                        <select
                            name="Customer"
                            value={formData['Customer']}
                            onChange={handleChange}
                            required
                            style={styles.select}
                        >
                            <option value="">Select Customer</option>
                            {customerOptions.map(custId => (
                                <option key={custId} value={custId}>{custId}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date input */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Order Date</label>
                        <input
                            type="date"
                            name="Order Date"
                            value={formData['Order Date']}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                backgroundColor: 'rgba(249, 250, 251, 0.5)',
                                border: '1px solid rgba(209, 213, 219, 0.5)',
                                borderRadius: '0.375rem'
                            }}
                        />
                    </div>

                    {/* Number inputs for Rolling demands */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Rolling 7-day Demand</label>
                        <input
                            type="number"
                            name="Rolling_7day_demand"
                            value={formData['Rolling_7day_demand']}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                backgroundColor: 'rgba(249, 250, 251, 0.5)',
                                border: '1px solid rgba(209, 213, 219, 0.5)',
                                borderRadius: '0.375rem'
                            }}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Rolling 30-day Demand</label>
                        <input
                            type="number"
                            name="Rolling_30day_demand"
                            value={formData['Rolling_30day_demand']}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem',
                                backgroundColor: 'rgba(249, 250, 251, 0.5)',
                                border: '1px solid rgba(209, 213, 219, 0.5)',
                                borderRadius: '0.375rem'
                            }}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                    >
                        {loading ? 'Predicting...' : 'Predict Demand'}
                    </button>
                </form>
                
                {error && (
                    <div style={styles.errorMessage}>
                        {error}
                    </div>
                )}
                
                {prediction !== null && (
                    <div style={styles.resultContainer}>
                        <h3 style={styles.resultTitle}>Predicted Demand:</h3>
                        <p style={styles.resultValue}>
                            {Math.round(prediction)} units
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DemandPredictor;