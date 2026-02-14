import React, { useEffect, useState, useRef } from 'react';
import { useAgent } from '../hooks/useAgent.js';
import { useVoice } from '../hooks/useVoice.js';
import ChatWindow from '../components/chat/ChatWindow';
import { Mic, Send, StopCircle, RefreshCw, Sparkles, Plus, Info } from 'lucide-react';

const AgentPage = () => {
    const { messages, sendMessage, isStreaming, createSession, sessionId } = useAgent();
    const { isListening, transcript, startListening, stopListening, setTranscript } = useVoice();
    const [inputValue, setInputValue] = useState('');
    const bottomRef = useRef(null);

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
        <div className="h-[calc(100vh-6rem)] flex flex-col max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brown-900 flex items-center gap-2">
                        <Sparkles className="w-8 h-8 text-brown-600" />
                        AI Inventory Agent
                    </h1>
                    <p className="text-brown-500 text-sm mt-1 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${sessionId ? 'bg-green-500' : 'bg-brown-300'}`}></span>
                        Session: <span className="font-mono bg-beige-100 px-2 py-0.5 rounded text-brown-700">{sessionId || 'Initializing...'}</span>
                        {sessionId && (
                            <span className="ml-2 flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Context Active
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${isListening
                        ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                        : 'bg-beige-100 text-brown-600 border border-beige-200'
                        }`}>
                        <Mic className="w-4 h-4" />
                        {isListening ? 'Listening...' : 'Voice Ready'}
                    </div>

                    <button
                        onClick={createSession}
                        disabled={isStreaming}
                        className="flex items-center gap-2 px-4 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" /> New Session
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 glass-panel rounded-xl overflow-hidden flex flex-col shadow-lg border border-beige-300 relative">

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 bg-white/50 backdrop-blur-sm">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-80">
                            <div className="w-16 h-16 bg-brown-100 rounded-full flex items-center justify-center mb-4 text-brown-600">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-brown-800 mb-2">How can I help you today?</h3>
                            <p className="text-brown-600 max-w-md mb-8">
                                I can help you verify stock levels, analyze sales trends, or manage warehouse operations.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                {[
                                    { text: "Stock levels for laptops", icon: "📦" },
                                    { text: "Top selling products", icon: "📈" },
                                    { text: "Warehouse valid capacity", icon: "🏭" },
                                    { text: "Show expiring items", icon: "⚠️" }
                                ].map((item) => (
                                    <button
                                        key={item.text}
                                        onClick={() => setInputValue(item.text)}
                                        className="text-left p-3 rounded-lg bg-white border border-beige-200 hover:border-brown-400 hover:shadow-md transition-all text-brown-700 text-sm flex items-center gap-3 group"
                                    >
                                        <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
                                        <span>{item.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <ChatWindow messages={messages} isStreaming={isStreaming} />
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-beige-200">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <button
                            type="button"
                            onClick={isListening ? stopListening : startListening}
                            className={`p-3 rounded-lg transition-all ${isListening
                                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                                : 'bg-beige-100 hover:bg-beige-200 text-brown-600'
                                }`}
                            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
                        >
                            {isListening ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about inventory, sales, or warehouses..."
                                className="w-full pl-4 pr-4 py-3 bg-white border border-beige-300 rounded-lg focus:ring-2 focus:ring-brown-500/20 focus:border-brown-500 text-gray-900 placeholder-gray-500 shadow-sm"
                                disabled={isStreaming}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isStreaming || !inputValue.trim()}
                            className="px-6 py-2 bg-brown-600 hover:bg-brown-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm font-medium flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">{isStreaming ? 'Thinking...' : 'Send'}</span>
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-xs text-brown-400 flex items-center justify-center gap-1">
                            <Info className="w-3 h-3" /> AI can make mistakes. Please verify important data.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentPage;
