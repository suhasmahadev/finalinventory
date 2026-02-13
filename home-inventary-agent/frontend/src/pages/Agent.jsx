import { useAgent } from '../hooks/useAgent';
import { useVoice } from '../hooks/useVoice';
import ChatWindow from '../components/ChatWindow';
import { useEffect } from 'react';

const Agent = () => {
    const { messages, sendMessage, isStreaming, createSession, sessionId } = useAgent();
    const { isListening, transcript, startListening, stopListening, speak, setTranscript } = useVoice();

    // Auto-send transcript when listening stops and transcript exists
    useEffect(() => {
        if (!isListening && transcript) {
            sendMessage(transcript);
            setTranscript('');
        }
    }, [isListening, transcript, sendMessage, setTranscript]);

    const handleSend = (e) => {
        e.preventDefault();
        const input = e.target.message.value;
        if (!input.trim()) return;
        sendMessage(input);
        e.target.reset();
    };

    return (
        <div className="flex-col h-full gap-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-bold">AI Agent Interaction</h1>
                    <span className="text-xs text-secondary">Session: {sessionId}</span>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        className="btn btn-secondary text-sm"
                        onClick={createSession}
                        disabled={isStreaming}
                    >
                        + New Session
                    </button>
                    <div className={`text-sm ${isListening ? 'text-green-500' : 'text-secondary'}`}>
                        {isListening ? '🎤 Listening...' : 'Use voice commands'}
                    </div>
                </div>
            </div>

            <ChatWindow messages={messages} isStreaming={isStreaming} />

            <div className="card" style={{ padding: '1rem' }}>
                <form onSubmit={handleSend} className="flex gap-2">
                    <button
                        type="button"
                        className={`btn ${isListening ? 'btn-danger' : 'btn-secondary'}`}
                        onClick={isListening ? stopListening : startListening}
                        title="Toggle Voice"
                    >
                        {isListening ? '🛑' : '🎤'}
                    </button>

                    <input
                        name="message"
                        className="input"
                        placeholder="Asking AI agent..."
                        autoComplete="off"
                    />

                    <button type="submit" className="btn btn-primary" disabled={isStreaming}>
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Agent;
