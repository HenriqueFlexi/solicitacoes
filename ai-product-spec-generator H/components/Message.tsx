import React from 'react';
import { Message, MessageAuthor } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface MessageProps {
  message: Message;
  isLoading?: boolean;
}

const UserAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-slate-200 flex-shrink-0">
    U
  </div>
);

const ModelAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0">
    <SparklesIcon className="w-6 h-6" />
  </div>
);

const MessageComponent: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.author === MessageAuthor.USER;
  const isSystem = message.author === MessageAuthor.SYSTEM;

  if (isSystem) {
    return (
      <div className="text-center text-sm text-slate-400 italic py-2">
        {message.content}
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && <ModelAvatar />}
      <div className={`max-w-xl p-4 rounded-2xl ${isUser ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-700 text-gray-200 rounded-bl-none'}`}>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
};

export default MessageComponent;
