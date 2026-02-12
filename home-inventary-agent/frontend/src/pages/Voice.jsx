import { useState, useRef } from 'react';
import * as voiceApi from '../api/voiceApi';
import { Mic, Radio, Terminal, Cpu } from 'lucide-react';

const Voice = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [agentReply, setAgentReply] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
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
        } catch (err) { setError('Microphone access denied'); }
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
                if (result.audio_base64) { new Audio(`data:audio/wav;base64,${result.audio_base64}`).play(); }
            } else { setError('Voice processing failed'); }
        } catch (err) { setError(err.message || 'Failed to process voice'); } finally { setLoading(false); }
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-white flex items-center justify-center gap-2">
                    <Cpu className="w-6 h-6 text-emerald-500" /> Neural Voice Core
                </h1>
                <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1">Direct voice-to-text processing debug console.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl flex flex-col items-center justify-center gap-6 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                
                <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 relative ${isRecording ? 'scale-110' : ''}`}>
                     {isRecording && (<><div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping"></div><div className="absolute -inset-4 rounded-full bg-red-500/10 animate-pulse"></div></>)}
                    <button onClick={isRecording ? stopRecording : startRecording} disabled={loading} className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 z-10 ${isRecording ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'bg-slate-800 text-white shadow-lg shadow-slate-800/40'}`}>
                        {isRecording ? <Radio className="w-10 h-10 animate-pulse" /> : <Mic className="w-10 h-10" />}
                    </button>
                </div>
                
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 z-10">
                    {loading ? 'Processing audio stream...' : isRecording ? 'Listening... Tap to stop' : 'Tap to activate voice core'}
                </div>
            </div>

            {error && <div className="p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center font-medium">{error}</div>}

            {(transcript || agentReply) && (
                <div className="bg-slate-950 text-emerald-400 p-6 rounded-xl font-mono text-sm border border-slate-800 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20"></div>
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800 text-slate-500 uppercase text-xs font-bold tracking-wider"><Terminal className="w-4 h-4" /> Neural Logs</div>
                    {transcript && <div className="mb-4"><span className="text-slate-500">{'>'} User_Audio_In:</span> <span className="text-white block pl-4 mt-1 border-l-2 border-slate-700">{transcript}</span></div>}
                    {agentReply && <div><span className="text-slate-500">{'>'} Agent_Response:</span> <span className="text-emerald-400 block pl-4 mt-1 border-l-2 border-emerald-900">{agentReply}</span></div>}
                </div>
            )}
        </div>
    );
};

export default Voice;