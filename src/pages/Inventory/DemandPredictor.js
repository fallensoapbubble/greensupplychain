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
        input: {
            width: '100%',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'rgba(249, 250, 251, 0.5)',
            border: '1px solid rgba(209, 213, 219, 0.5)',
            borderRadius: '0.375rem',
            transition: 'all 0.3s ease-in-out',
            outline: 'none'
        },
        inputFocus: {
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 0.5)'
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
        buttonHover: {
            backgroundColor: 'rgba(37, 99, 235, 0.8)'
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
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
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
                    {Object.keys(formData).map((key) => (
                        <div key={key} style={styles.formGroup}>
                            <label style={styles.label}>{key.replace('_', ' ')}</label>
                            <input
                                type={
                                    key === 'Rolling_7day_demand' || key === 'Rolling_30day_demand' ? 'number' :
                                    key === 'Order Date' ? 'date' : 'text'
                                }
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                required
                                style={{
                                    ...styles.input,
                                    ':focus': styles.inputFocus
                                }}
                                min={key.includes('Rolling') ? "0" : undefined}
                                step={key.includes('Rolling') ? "0.01" : undefined}
                            />
                        </div>
                    ))}
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {}),
                            ':hover': styles.buttonHover
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