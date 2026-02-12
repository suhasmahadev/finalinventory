import { useAgent } from '../hooks/useAgent';
import { useVoice } from '../hooks/useVoice';
import ChatWindow from '../components/ChatWindow';
import { useEffect } from 'react';
import { Mic, MicOff, Send, Plus, Sparkles } from 'lucide-react';

const Agent = () => {
    const { messages, sendMessage, isStreaming, createSession, sessionId } = useAgent();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useVoice();

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
        <div className="flex flex-col h-[calc(100vh-8rem)] gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* ALIGNMENT FIXED */}
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h1 className="text-2xl font-[700] tracking-tight text-slate-800 dark:text-white transition-colors duration-300 flex items-center gap-2">
                        AI Agent Interaction <Sparkles className="w-5 h-5 text-emerald-500" />
                    </h1>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        System Online — Awaiting Command
                    </p>
                </div>

                <div className="flex gap-4 items-center">
                    <div className={`text-xs font-[700] uppercase tracking-wide flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors duration-300 shadow-sm border ${isListening ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800' : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'}`}>
                        {isListening ? <><Mic className="w-3 h-3 animate-pulse" /> Listening...</> : <><MicOff className="w-3 h-3" /> Neural Voice Active</>}
                    </div>
                    <button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center gap-2 text-xs uppercase tracking-wide" onClick={createSession} disabled={isStreaming}>
                        <Plus className="w-3 h-3" /> New Session
                    </button>
                </div>
            </div>

            <ChatWindow messages={messages} isStreaming={isStreaming} />

            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-2.5 rounded-2xl shadow-lg shadow-emerald-900/5 border border-slate-200/60 dark:border-slate-700/60 mt-auto shrink-0 transition-all duration-300">
                <form onSubmit={handleSend} className="flex gap-3 items-center">
                    <button type="button" className={`p-3.5 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${isListening ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-red-500/30 hover:shadow-md hover:-translate-y-0.5' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-700'}`} onClick={isListening ? stopListening : startListening} title={isListening ? "Stop Voice" : "Use Voice"}>
                        {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <input name="message" className="flex-1 bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-white dark:placeholder-slate-500 shadow-inner transition-all duration-300 text-[15px]" placeholder="Ask the Inventory Agent anything..." autoComplete="off" />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none" disabled={isStreaming}>
                        <Send className="w-4 h-4" /> Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Agent;