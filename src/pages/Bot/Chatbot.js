import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSend = async () => {
        if (!query.trim()) {
            setError('Query is required');
            return;
        }

        setError('');
        setIsLoading(true);
        
        // Add user message to chat history
        const userMessage = query;
        setChatHistory(prev => [...prev, { type: 'user', content: userMessage }]);
        setQuery('');

        try {
            const res = await axios.post('http://127.0.0.1:5000/chat', { query: userMessage });
            const botResponse = res.data.response || 'No response from server';
            setResponse(botResponse);
            
            // Add bot response to chat history
            setChatHistory(prev => [...prev, { type: 'bot', content: botResponse }]);
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'An error occurred';
            setError(errorMessage);
            
            // Add error to chat history
            setChatHistory(prev => [...prev, { type: 'error', content: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div style={{ 
            fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                padding: '15px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}>
                <h1 style={{ 
                    margin: '0',
                    color: '#2d3748',
                    fontSize: '28px',
                    fontWeight: '600',
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    AI Chatbot
                </h1>
                <p style={{ 
                    color: '#4a5568', 
                    margin: '8px 0 0 0',
                    fontSize: '14px'
                }}>
                    Ask me anything...
                </p>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                marginBottom: '20px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
            }}>
                {chatHistory.length === 0 ? (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#a0aec0',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            fontSize: '40px',
                            marginBottom: '20px'
                        }}>
                            💬
                        </div>
                        <p>Type a message to start chatting</p>
                    </div>
                ) : (
                    chatHistory.map((message, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            marginBottom: '15px',
                            justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                        }}>
                            <div style={{
                                maxWidth: '70%',
                                padding: '12px 18px',
                                borderRadius: message.type === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
                                backgroundColor: message.type === 'user' 
                                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                                    : message.type === 'error' 
                                        ? '#FED7D7' 
                                        : '#F0FFF4',
                                background: message.type === 'user' 
                                    ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
                                    : message.type === 'error' 
                                        ? '#FED7D7' 
                                        : 'white',
                                color: message.type === 'user' ? 'white' : message.type === 'error' ? '#C53030' : '#2D3748',
                                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                                wordBreak: 'break-word'
                            }}>
                                {message.content}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{
                display: 'flex',
                position: 'relative',
                borderRadius: '10px',
                backgroundColor: 'white',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                padding: '10px'
            }}>
                <textarea
                    value={query}
                    onChange={handleQueryChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    rows="3"
                    style={{ 
                        width: '100%',
                        border: 'none',
                        outline: 'none',
                        resize: 'none',
                        fontFamily: 'inherit',
                        fontSize: '16px',
                        padding: '10px 15px',
                        borderRadius: '10px',
                    }}
                />
                <button 
                    onClick={handleSend} 
                    disabled={isLoading}
                    style={{ 
                        minWidth: '50px',
                        height: '50px',
                        border: 'none',
                        background: isLoading 
                            ? '#A0AEC0' 
                            : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        marginLeft: '10px',
                        boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)'
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>
            
            {isLoading && (
                <div style={{ 
                    textAlign: 'center', 
                    margin: '10px 0',
                    color: '#4a5568',
                    fontSize: '14px'
                }}>
                    <p>Thinking...</p>
                </div>
            )}
        </div>
    );
};

export default Chatbot;