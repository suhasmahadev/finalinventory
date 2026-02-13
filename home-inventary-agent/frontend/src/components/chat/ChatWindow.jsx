import React, { useRef, useEffect } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ messages, isStreaming }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isStreaming]);

    return (
        <div className="chat-window">
            {messages.map((msg, index) => (
                <div
                    key={msg.id || index}
                    className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}
                >
                    <div className="message-role">
                        {msg.role === 'user' ? 'You' : msg.role === 'system' ? 'System' : 'Inventory Agent'}
                    </div>
                    <div className="message-content">{msg.content}</div>
                </div>
            ))}

            {isStreaming && (
                <div className="message message-assistant">
                    <div className="message-role">Inventory Agent</div>
                    <div className="message-content typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;
