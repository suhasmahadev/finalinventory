import { useRef, useEffect } from 'react';
import { Bot, User, Sparkles } from 'lucide-react';

const ChatWindow = ({ messages, isStreaming }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isStreaming]);

    // INTERCEPT ERRORS & UPDATE WELCOME TEXT
    const displayMessages = messages.map(msg => {
        if (msg.content && msg.content.includes('Failed to fetch')) {
            // UPDATED TEXT HERE:
            return { ...msg, content: 'AI Assistant Online — Awaiting Command' };
        }
        return msg;
    });

    return (
        <div className="flex-1 overflow-y-auto p-6 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-inner mb-4 flex flex-col gap-8 h-[500px] transition-all duration-300">
            
            {/* EMPTY STATE */}
            {displayMessages.length === 0 && !isStreaming && (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-70 animate-in fade-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-emerald-400/10 flex items-center justify-center mb-4 border border-emerald-500/20">
                        <Sparkles className="w-8 h-8 text-emerald-500" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-[700] text-slate-800 dark:text-white mb-2 tracking-tight">InventAI Assistant</h3>
                    <p className="text-sm font-[500] text-slate-500 dark:text-slate-400 max-w-sm">
                        I can help you analyze stock levels, generate reports, or locate items across your warehouses.
                    </p>
                </div>
            )}

            {displayMessages.map((msg, index) => {
                const isUser = msg.role === 'user';
                
                return (
                    <div key={msg.id || index} className={`flex gap-4 max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300 ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-colors duration-300 ${isUser ? 'bg-gradient-to-tr from-emerald-600 to-emerald-400' : 'bg-slate-800 dark:bg-slate-900 border border-slate-700'}`}>
                            {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-emerald-400" />}
                        </div>
                        
                        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                            <span className="text-xs font-[600] text-slate-500 dark:text-slate-400 mb-1.5 px-1 tracking-wide uppercase transition-colors duration-300">
                                {isUser ? 'You' : 'Inventory Agent'}
                            </span>
                            
                            <div className={`px-5 py-3.5 text-[15px] leading-relaxed transition-all duration-300 ${
                                isUser 
                                ? 'bg-emerald-600 text-white rounded-3xl rounded-tr-sm shadow-md shadow-emerald-600/20' 
                                : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-3xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-600'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    </div>
                );
            })}

            {isStreaming && (
                <div className="flex gap-4 self-start max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 transition-colors duration-300">
                        <Bot className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-xs font-[600] text-slate-500 dark:text-slate-400 mb-1.5 px-1 tracking-wide uppercase">
                            Inventory Agent
                        </span>
                        <div className="px-5 py-4 rounded-3xl rounded-tl-sm bg-white dark:bg-slate-700 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;