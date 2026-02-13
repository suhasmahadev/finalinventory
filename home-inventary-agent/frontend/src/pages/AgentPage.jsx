import React, { useEffect, useState } from 'react';
import { useAgent } from '../hooks/useAgent.js';
import { useVoice } from '../hooks/useVoice.js';
import ChatWindow from '../components/chat/ChatWindow';
import './AgentPage.css';

const AgentPage = () => {
    const { messages, sendMessage, isStreaming, createSession, sessionId } = useAgent();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useVoice();
    const [inputValue, setInputValue] = useState('');

    // Auto-send transcript when listening stops and transcript exists
    useEffect(() => {
        if (!isListening && transcript) {
            sendMessage(transcript);
            setTranscript('');
        }
    }, [isListening, transcript, sendMessage, setTranscript]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="agent-page-container">
            <div className="agent-header">
                <div>
                    <h1>AI Inventory Agent</h1>
                    <p className="session-info">Session: {sessionId || 'Initializing...'}</p>
                </div>

                <div className="header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={createSession}
                        disabled={isStreaming}
                    >
                        + New Session
                    </button>
                    <div className={`voice-status ${isListening ? 'listening' : ''}`}>
                        {isListening ? '🎤 Listening...' : '🎤 Voice Ready'}
                    </div>
                </div>
            </div>

            <div className="agent-description">
                <p>
                    <strong>Welcome to the AI Inventory Agent!</strong> Ask me anything about:
                </p>
                <ul>
                    <li>📦 Product inventory and stock levels</li>
                    <li>📊 Sales analytics and forecasting</li>
                    <li>🏭 Warehouse and room management</li>
                    <li>🧾 Billing and invoicing</li>
                    <li>🔄 Stock movements and transfers</li>
                    <li>📈 Demand forecasting and reorder suggestions</li>
                </ul>
            </div>

            <ChatWindow messages={messages} isStreaming={isStreaming} />

            <div className="input-container">
                <form onSubmit={handleSend} className="input-form">
                    <button
                        type="button"
                        className={`btn voice-btn ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={isListening ? stopListening : startListening}
                        title={isListening ? 'Stop Listening' : 'Start Voice Input'}
                    >
                        {isListening ? '🛑' : '🎤'}
                    </button>

                    <input
                        type="text"
                        className="message-input"
                        placeholder="Ask the AI agent about inventory..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        disabled={isStreaming}
                        autoComplete="off"
                    />

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isStreaming || !inputValue.trim()}
                    >
                        {isStreaming ? 'Sending...' : 'Send'}
                    </button>
                </form>
            </div>

            <div className="agent-tips">
                <h4>💡 Try asking:</h4>
                <div className="tip-buttons">
                    <button
                        className="tip-btn"
                        onClick={() => setInputValue('What are the top selling products today?')}
                    >
                        Top selling products
                    </button>
                    <button
                        className="tip-btn"
                        onClick={() => setInputValue('Show me items that are expiring soon')}
                    >
                        Expiring items
                    </button>
                    <button
                        className="tip-btn"
                        onClick={() => setInputValue('What is the total revenue today?')}
                    >
                        Today's revenue
                    </button>
                    <button
                        className="tip-btn"
                        onClick={() => setInputValue('List all warehouses')}
                    >
                        List warehouses
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentPage;
