// frontend/src/components/VoiceAssistant.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [error, setError] = useState('');

    const recognitionRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        // Initialize Web Speech API
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = async (event) => {
                const speechResult = event.results[0][0].transcript;
                setTranscript(speechResult);
                setIsListening(false);

                // Send to agent
                await sendToAgent(speechResult);
            };

            recognitionRef.current.onerror = (event) => {
                setError(`Speech recognition error: ${event.error}`);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {
            setError('Speech recognition not supported in this browser');
        }
    }, []);

    const startListening = () => {
        if (recognitionRef.current) {
            setError('');
            setTranscript('');
            setResponse('');
            setIsListening(true);
            recognitionRef.current.start();
        }
    };

    const sendToAgent = async (text) => {
        try {
            // Send to ADK agent via SSE
            const response = await axios.post('http://localhost:8000/run_sse', {
                sessionId: `voice-${Date.now()}`,
                parts: [{ text }]
            });

            // Extract text from response
            const agentResponse = response.data.text || 'No response';
            setResponse(agentResponse);

            // Convert to speech
            await speakResponse(agentResponse);
        } catch (err) {
            setError(`Agent error: ${err.message}`);
        }
    };

    const speakResponse = async (text) => {
        try {
            const response = await axios.post('http://localhost:8000/voice/synthesize', {
                text,
                voice: 'en-US-AriaNeural'
            });

            if (response.data.audio_file) {
                const audioUrl = `http://localhost:8000${response.data.audio_file}`;
                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    audioRef.current.play();
                }
            }
        } catch (err) {
            console.error('TTS error:', err);
        }
    };

    return (
        <div style={styles.container}>
            <button
                onClick={startListening}
                disabled={isListening}
                style={{
                    ...styles.button,
                    backgroundColor: isListening ? '#4CAF50' : '#2196F3',
                    cursor: isListening ? 'not-allowed' : 'pointer'
                }}
            >
                {isListening ? '🎤 Listening...' : '🎤 Hey Siri'}
            </button>

            {transcript && (
                <div style={styles.transcript}>
                    <strong>You said:</strong> {transcript}
                </div>
            )}

            {response && (
                <div style={styles.response}>
                    <strong>Agent:</strong> {response}
                </div>
            )}

            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            <audio ref={audioRef} style={{ display: 'none' }} />
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '300px'
    },
    button: {
        padding: '15px 25px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        border: 'none',
        borderRadius: '50px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease'
    },
    transcript: {
        backgroundColor: '#f0f0f0',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px'
    },
    response: {
        backgroundColor: '#e3f2fd',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px'
    },
    error: {
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '10px',
        borderRadius: '8px',
        fontSize: '14px'
    }
};

export default VoiceAssistant;
