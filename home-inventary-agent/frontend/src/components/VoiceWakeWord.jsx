import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const VoiceWakeWord = () => {
    const [state, setState] = useState('idle'); // idle, activated, processing, speaking
    const [transcript, setTranscript] = useState('');
    const [lastCommand, setLastCommand] = useState('');
    const [agentResponse, setAgentResponse] = useState('');
    const [error, setError] = useState('');
    const [isMinimized, setIsMinimized] = useState(false);

    const recognitionRef = useRef(null);
    const audioRef = useRef(null);
    const commandTimeoutRef = useRef(null);
    const isProcessingRef = useRef(false);

    useEffect(() => {
        initializeSpeechRecognition();
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            if (commandTimeoutRef.current) {
                clearTimeout(commandTimeoutRef.current);
            }
        };
    }, []);

    const initializeSpeechRecognition = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = handleSpeechResult;
        recognitionRef.current.onerror = handleSpeechError;
        recognitionRef.current.onend = handleSpeechEnd;

        startListening();
    };

    const startListening = () => {
        try {
            if (recognitionRef.current && state !== 'processing' && state !== 'speaking') {
                recognitionRef.current.start();
                setState('idle');
                setError('');
            }
        } catch (err) {
            console.error('Failed to start recognition:', err);
        }
    };

    const handleSpeechResult = (event) => {
        const current = event.results[event.results.length - 1];
        const transcriptText = current[0].transcript.toLowerCase().trim();
        setTranscript(transcriptText);

        // Check for wake word
        if (state === 'idle' && detectWakeWord(transcriptText)) {
            activateListening();
        }
        // Process command after wake word
        else if (state === 'activated' && current.isFinal && !isProcessingRef.current) {
            processCommand(transcriptText);
        }
    };

    const detectWakeWord = (text) => {
        const wakeWords = ['hey donna', 'hey, donna', 'hey danna', 'hay donna'];
        return wakeWords.some(word => text.includes(word));
    };

    const activateListening = () => {
        setState('activated');
        setTranscript('');
        setError('');

        // Clear any existing timeout
        if (commandTimeoutRef.current) {
            clearTimeout(commandTimeoutRef.current);
        }

        // Timeout after 5 seconds if no command given
        commandTimeoutRef.current = setTimeout(() => {
            if (state === 'activated') {
                setState('idle');
                setTranscript('');
            }
        }, 5000);
    };

    const processCommand = async (command) => {
        if (isProcessingRef.current) return;

        isProcessingRef.current = true;
        setState('processing');

        // Clear timeout
        if (commandTimeoutRef.current) {
            clearTimeout(commandTimeoutRef.current);
        }

        // Remove wake word from command
        const cleanCommand = command
            .replace(/hey donna,?/gi, '')
            .replace(/hey danna,?/gi, '')
            .trim();

        if (!cleanCommand) {
            setState('idle');
            isProcessingRef.current = false;
            return;
        }

        setLastCommand(cleanCommand);

        try {
            // Send to agent
            const response = await axios.post('http://localhost:8000/run_sse', {
                sessionId: `voice-wake-${Date.now()}`,
                parts: [{ text: cleanCommand }]
            });

            const agentText = response.data.text || response.data.message || 'No response from agent';
            setAgentResponse(agentText);

            // Convert to speech
            await speakResponse(agentText);
        } catch (err) {
            console.error('Agent error:', err);
            setError(`Error: ${err.message}`);
            setState('idle');
            isProcessingRef.current = false;
        }
    };

    const speakResponse = async (text) => {
        try {
            setState('speaking');

            const response = await axios.post('http://localhost:8000/voice/synthesize', {
                text,
                voice: 'en-US-AriaNeural'
            });

            if (response.data.audio_file) {
                const audioUrl = `http://localhost:8000${response.data.audio_file}`;

                if (audioRef.current) {
                    audioRef.current.src = audioUrl;
                    audioRef.current.onended = () => {
                        setState('idle');
                        isProcessingRef.current = false;
                        setTranscript('');
                    };
                    await audioRef.current.play();
                }
            } else {
                setState('idle');
                isProcessingRef.current = false;
            }
        } catch (err) {
            console.error('TTS error:', err);
            setError('Failed to generate speech');
            setState('idle');
            isProcessingRef.current = false;
        }
    };

    const handleSpeechError = (event) => {
        console.error('Speech recognition error:', event.error);

        if (event.error === 'no-speech') {
            // Ignore no-speech errors, just restart
            return;
        }

        if (event.error !== 'aborted') {
            setError(`Recognition error: ${event.error}`);
        }
    };

    const handleSpeechEnd = () => {
        // Auto-restart listening if not processing or speaking
        if (state !== 'processing' && state !== 'speaking') {
            setTimeout(() => startListening(), 100);
        }
    };

    const getStateDisplay = () => {
        switch (state) {
            case 'idle':
                return { icon: '🎤', text: 'Listening for "Hey Donna"', color: '#2196F3' };
            case 'activated':
                return { icon: '🟢', text: 'Listening...', color: '#4CAF50' };
            case 'processing':
                return { icon: '⚙️', text: 'Processing...', color: '#FF9800' };
            case 'speaking':
                return { icon: '🔊', text: 'Speaking...', color: '#9C27B0' };
            default:
                return { icon: '🎤', text: 'Ready', color: '#2196F3' };
        }
    };

    const stateDisplay = getStateDisplay();

    if (isMinimized) {
        return (
            <div style={styles.minimized} onClick={() => setIsMinimized(false)}>
                <span style={{ fontSize: '24px' }}>{stateDisplay.icon}</span>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div
                style={{
                    ...styles.indicator,
                    backgroundColor: stateDisplay.color,
                    animation: state === 'idle' ? 'pulse 2s infinite' :
                        state === 'processing' ? 'spin 1s linear infinite' : 'none'
                }}
            >
                <span style={styles.icon}>{stateDisplay.icon}</span>
            </div>

            <div style={styles.statusCard}>
                <div style={styles.statusHeader}>
                    <strong>{stateDisplay.text}</strong>
                    <button
                        onClick={() => setIsMinimized(true)}
                        style={styles.minimizeBtn}
                    >
                        ─
                    </button>
                </div>

                {transcript && state === 'activated' && (
                    <div style={styles.transcript}>
                        <small>Hearing: {transcript}</small>
                    </div>
                )}

                {lastCommand && (
                    <div style={styles.command}>
                        <strong>You:</strong> {lastCommand}
                    </div>
                )}

                {agentResponse && (
                    <div style={styles.response}>
                        <strong>Donna:</strong> {agentResponse}
                    </div>
                )}

                {error && (
                    <div style={styles.error}>
                        {error}
                    </div>
                )}
            </div>

            <audio ref={audioRef} style={{ display: 'none' }} />

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '10px',
        maxWidth: '350px'
    },
    indicator: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    icon: {
        fontSize: '28px'
    },
    statusCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        padding: '15px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        minWidth: '280px',
        maxWidth: '350px'
    },
    statusHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
        fontSize: '14px'
    },
    minimizeBtn: {
        background: 'none',
        border: 'none',
        fontSize: '18px',
        cursor: 'pointer',
        padding: '0 5px',
        color: '#666'
    },
    transcript: {
        fontSize: '12px',
        color: '#666',
        fontStyle: 'italic',
        marginTop: '5px',
        padding: '5px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
    },
    command: {
        fontSize: '13px',
        marginTop: '8px',
        padding: '8px',
        backgroundColor: '#E3F2FD',
        borderRadius: '6px',
        borderLeft: '3px solid #2196F3'
    },
    response: {
        fontSize: '13px',
        marginTop: '8px',
        padding: '8px',
        backgroundColor: '#F3E5F5',
        borderRadius: '6px',
        borderLeft: '3px solid #9C27B0'
    },
    error: {
        fontSize: '12px',
        marginTop: '8px',
        padding: '8px',
        backgroundColor: '#FFEBEE',
        color: '#C62828',
        borderRadius: '6px',
        borderLeft: '3px solid #C62828'
    },
    minimized: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#2196F3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    }
};

export default VoiceWakeWord;
