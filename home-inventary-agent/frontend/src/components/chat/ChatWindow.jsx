import React, { useRef, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatWindow = ({ messages, isStreaming }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isStreaming]);

    return (
        <div className="space-y-6">
            {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                    <div
                        key={msg.id || index}
                        className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${isUser
                            ? 'bg-brown-600 text-white'
                            : 'bg-white border border-beige-200 text-brown-600'
                            }`}>
                            {isUser ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                        </div>

                        {/* Message Bubble */}
                        <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${isUser
                            ? 'bg-brown-600 text-white rounded-tr-sm'
                            : 'bg-white border border-beige-200 text-brown-800 rounded-tl-sm'
                            }`}>
                            <div className={`text-xs font-bold mb-1 ${isUser ? 'text-brown-200' : 'text-brown-500'}`}>
                                {isUser ? 'You' : 'Inventory Agent'}
                            </div>
                            <div className={`prose prose-sm max-w-none ${isUser ? 'text-white [&_p]:text-white [&_li]:text-white [&_h1]:text-white [&_h2]:text-white [&_strong]:text-white' : 'prose-brown'}`}>
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                );
            })}

            {isStreaming && (
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-white border border-beige-200 text-brown-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div className="bg-white border border-beige-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 bg-brown-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-brown-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-brown-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;
