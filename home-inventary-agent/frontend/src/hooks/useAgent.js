import { useState, useEffect, useCallback } from 'react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const AGENT_NAME = 'enterprise_inventory_agent';

export const useAgent = () => {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  // Create agent session
  const createSession = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/apps/${AGENT_NAME}/users/user/sessions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        }
      );

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setSessionId(data.id);
      setMessages([
        {
          role: 'system',
          content: 'New session started. Ask me anything about inventory management!',
          id: 'init',
        },
      ]);
    } catch (error) {
      console.error('Session creation failed:', error);
      setMessages([
        {
          role: 'system',
          content: `Session error: ${error.message}`,
          id: Date.now().toString(),
        },
      ]);
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) createSession();
  }, [sessionId, createSession]);

  // Extract content from various response formats
  const extractContent = (parsed) => {
    if (!parsed) return '';

    // ADK v2 format
    if (parsed?.content?.parts) {
      return parsed.content.parts.map((p) => p.text || '').join('');
    }

    // Gemini raw format
    if (parsed?.candidates?.[0]?.content?.parts) {
      return parsed.candidates[0].content.parts
        .map((p) => p.text || '')
        .join('');
    }

    // OpenAI delta format
    if (parsed?.choices?.[0]?.delta?.content) {
      return parsed.choices[0].delta.content;
    }

    // Tool result
    if (parsed?.response && typeof parsed.response === 'object') {
      return JSON.stringify(parsed.response, null, 2);
    }

    // Plain string
    if (typeof parsed === 'string') {
      return parsed;
    }

    return '';
  };

  // Send message to agent
  const sendMessage = async (text) => {
    if (!text?.trim()) return;
    if (!sessionId) return;

    setIsStreaming(true);

    const userMsgId = Date.now().toString();
    const assistantMsgId = (Date.now() + 1).toString();

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: text, id: userMsgId },
      { role: 'assistant', content: '', id: assistantMsgId },
    ]);

    try {
      const payload = {
        appName: AGENT_NAME,
        userId: 'user',
        sessionId,
        newMessage: {
          role: 'user',
          parts: [{ text: text.trim() }],
        },
        stateDelta: null,
        streaming: false,
      };

      const response = await fetch(`${BASE_URL}/run_sse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server ${response.status}: ${errText}`);
      }

      if (!response.body) {
        throw new Error('Streaming not supported in this browser.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          line = line.trim();
          if (!line) continue;

          const jsonPart = line.startsWith('data:')
            ? line.slice(5).trim()
            : line;

          if (jsonPart === '[DONE]') continue;

          try {
            const parsed = JSON.parse(jsonPart);
            const content = extractContent(parsed);

            if (content) {
              accumulatedText += content;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMsgId
                    ? { ...msg, content: accumulatedText }
                    : msg
                )
              );
            }
          } catch (err) {
            console.warn('SSE parse error:', err);
          }
        }
      }
    } catch (err) {
      console.error('❌ Agent Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'system',
          content: `Error: ${err.message}`,
          id: Date.now().toString(),
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  return {
    messages,
    sendMessage,
    isStreaming,
    sessionId,
    createSession,
  };
};
