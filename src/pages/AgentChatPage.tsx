import { useState, useRef, useEffect } from 'react';
import { useStore } from '../state/store';
import { sendChatMessage } from '../api/mockApi';
import { Send, User2, Shield, Bot, User } from 'lucide-react';
import type { ChatMessage } from '../types';
import type { KeyboardEvent } from 'react';


export function AgentChatPage() {
  const { activePersona, identity } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'agent',
      content: 'Hello! I\'m your Life Agent. I reason over your private memory while respecting your active persona to protect your identity. How can I help you today?',
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [storeInMemory, setStoreInMemory] = useState(true);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const agentReply = await sendChatMessage(input, activePersona);
      setMessages((prev) => [...prev, agentReply]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

const handleKeyPress = (e: KeyboardEvent) => {
  // or: KeyboardEvent<HTMLInputElement> if you want more specific
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
};

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Chat with Your Life Agent</h1>
        <p className="text-sm text-gray-600 mb-3">
          Your agent reasons over private memory and Persona rules to protect your identity.
        </p>
        <div className="flex items-center space-x-4">
          {activePersona && (
            <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
              <User2 className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">
                {activePersona.type}
                {activePersona.riskLevel && ` (${activePersona.riskLevel})`}
              </span>
            </div>
          )}
          {identity.did && (
            <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-mono text-blue-900">
                {identity.did.substring(0, 25)}...
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex items-start space-x-3 max-w-2xl ${
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-blue-600'
                      : 'bg-gradient-to-br from-purple-600 to-blue-600'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                  <p
                    className={`text-xs text-gray-500 mt-1 ${
                      message.role === 'user' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-2xl">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-purple-600 to-blue-600">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 border border-gray-200">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="checkbox"
              id="storeMemory"
              checked={storeInMemory}
              onChange={(e) => setStoreInMemory(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <label htmlFor="storeMemory" className="text-sm text-gray-700">
              Store this conversation in private memory
            </label>
          </div>
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your Life Agent anything..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
