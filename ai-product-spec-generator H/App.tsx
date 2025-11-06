import React, { useState, useRef, useEffect } from 'react';
import { Message, MessageAuthor } from './types';
import { continueChat, generateSpecFromChat } from './services/geminiService';
import ChatPanel from './components/ChatPanel';
import SpecPanel from './components/SpecPanel';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      author: MessageAuthor.MODEL,
      content: "Olá! Eu sou seu Gerente de Produto de IA. Em qual ideia de produto vamos trabalhar hoje? Por favor, descreva-a em algumas frases.",
    },
  ]);
  const [spec, setSpec] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingSpec, setIsGeneratingSpec] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading || isGeneratingSpec) return;

    setIsLoading(true);
    setError(null);

    const userMessage: Message = { author: MessageAuthor.USER, content: userInput };
    const newChatHistory = [...chatHistory, userMessage];
    setChatHistory(newChatHistory);

    try {
      const modelResponse = await continueChat(newChatHistory);
      let finalModelResponse = modelResponse;

      if (modelResponse.includes('[GENERATE_SPEC]')) {
        finalModelResponse = modelResponse.replace('[GENERATE_SPEC]', '').trim();
        
        const updatedHistoryWithModelResponse = [...newChatHistory, { author: MessageAuthor.MODEL, content: finalModelResponse }];
        setChatHistory(updatedHistoryWithModelResponse);

        setIsGeneratingSpec(true);
        setChatHistory(prev => [...prev, {
            author: MessageAuthor.SYSTEM,
            content: "Great! I have enough information now. Generating the product specification..."
        }]);

        const generatedSpec = await generateSpecFromChat(updatedHistoryWithModelResponse);
        setSpec(generatedSpec);
        setIsGeneratingSpec(false);

      } else {
        setChatHistory(prev => [...prev, { author: MessageAuthor.MODEL, content: finalModelResponse }]);
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      setChatHistory(prev => [...prev, {
        author: MessageAuthor.SYSTEM,
        content: `Error: ${errorMessage}`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-200 font-sans">
      <header className="flex items-center justify-center p-4 border-b border-slate-700 shadow-md">
        <SparklesIcon className="w-8 h-8 text-indigo-400 mr-3" />
        <h1 className="text-2xl font-bold tracking-tight text-white">AI Product Specification Generator</h1>
      </header>
      <main className="flex-1 grid md:grid-cols-2 overflow-hidden">
        <ChatPanel
          messages={chatHistory}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
        <SpecPanel
          specContent={spec}
          isGenerating={isGeneratingSpec}
        />
      </main>
    </div>
  );
};

export default App;