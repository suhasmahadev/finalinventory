import { useRef, useEffect } from 'react';

const ChatWindow = ({ messages, isStreaming }) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isStreaming]);

    return (
        <div className="flex-col" style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            gap: '1rem',
            backgroundColor: 'var(--bg-tertiary)',
            borderRadius: 'var(--radius-md)',
            height: '500px', // Fixed height for scroll
            border: '1px solid var(--border-color)',
            marginBottom: '1rem'
        }}>
            {messages.map((msg, index) => (
                <div
                    key={msg.id || index}
                    style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        backgroundColor: msg.role === 'user' ? 'var(--accent-color)' : 'var(--bg-secondary)',
                        color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        borderTopRightRadius: msg.role === 'user' ? 0 : 'var(--radius-md)',
                        borderTopLeftRadius: msg.role === 'assistant' ? 0 : 'var(--radius-md)',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                >
                    <div style={{ fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '0.25rem', opacity: 0.8 }}>
                        {msg.role === 'user' ? 'You' : 'Inventory Agent'}
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {msg.content}
                    </div>
                </div>
            ))}

            {isStreaming && (
                <div style={{
                    alignSelf: 'flex-start',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                    padding: '0.5rem'
                }}>
                    Agent is typing...
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatWindow;
