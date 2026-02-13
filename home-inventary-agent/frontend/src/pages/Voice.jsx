import { useState, useRef } from 'react';
import * as voiceApi from '../api/voiceApi';

const Voice = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [agentReply, setAgentReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(',')[1];
                    await processVoice(base64Audio);
                };
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setError(null);
        } catch (err) {
            setError('Microphone access denied');
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const processVoice = async (audioBase64) => {
        try {
            setLoading(true);
            setError(null);
            const result = await voiceApi.voiceInteraction(audioBase64);

            if (result.success) {
                setTranscript(result.transcript);
                setAgentReply(result.agent_reply);
                
                if (result.audio_base64) {
                    const audio = new Audio(`data:audio/wav;base64,${result.audio_base64}`);
                    audio.play();
                }
            } else {
                setError('Voice processing failed');
            }
        } catch (err) {
            setError(err.message || 'Failed to process voice');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-col gap-4">
            <h1 className="text-lg font-bold">Voice Assistant</h1>

            {error && (
                <div style={{ padding: '1rem', background: 'var(--danger-color)', borderRadius: '4px' }}>
                    {error}
                </div>
            )}

            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <button
                    className={`btn ${isRecording ? 'btn-danger' : 'btn-primary'}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={loading}
                    style={{ fontSize: '1.5rem', padding: '1rem 2rem' }}
                >
                    {isRecording ? '🔴 Stop Recording' : '🎤 Start Recording'}
                </button>
                {loading && <div style={{ marginTop: '1rem' }}>Processing...</div>}
            </div>

            {transcript && (
                <div className="card">
                    <h3 className="font-bold mb-2">You said:</h3>
                    <p>{transcript}</p>
                </div>
            )}

            {agentReply && (
                <div className="card">
                    <h3 className="font-bold mb-2">Agent replied:</h3>
                    <p>{agentReply}</p>
                </div>
            )}
        </div>
    );
};

export default Voice;
