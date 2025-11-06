import React, { useState, useRef, useEffect } from 'react';
// FIX: Import MessageAuthor to use the enum value.
import { Message, MessageAuthor } from '../types';
import MessageComponent from './Message';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isLoading }) => {
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onSendMessage(userInput);
      setUserInput('');
    }
  };

  return (
    <div className="flex flex-col bg-slate-800/50 border-r border-slate-700">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-6">
          {messages.map((msg, index) => (
            <MessageComponent key={index} message={msg} />
          ))}
          {/* FIX: Use MessageAuthor.MODEL enum instead of string literal 'model' to fix type error. */}
          {isLoading && <MessageComponent message={{ author: MessageAuthor.MODEL, content: '...' }} isLoading={true} />}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700 bg-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 text-gray-200 placeholder-gray-400"
            rows={1}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !userInput.trim()}
            className="p-3 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-indigo-500"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel;