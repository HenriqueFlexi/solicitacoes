import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface SpecPanelProps {
  specContent: string;
  isGenerating: boolean;
}

const SpecPanel: React.FC<SpecPanelProps> = ({ specContent, isGenerating }) => {
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
        <SparklesIcon className="w-16 h-16 text-indigo-500 animate-pulse mb-4" />
        <h3 className="text-xl font-semibold mb-2">Generating Specification</h3>
        <p>The AI is analyzing the conversation and crafting your document...</p>
    </div>
  );

  const EmptyState = () => (
     <div className="flex flex-col items-center justify-center h-full text-center text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">Your Product Specification Will Appear Here</h3>
        <p>Answer the AI's questions in the chat to build up the details needed for your spec.</p>
    </div>
  );

  return (
    <div className="flex flex-col bg-slate-900 overflow-hidden">
        <div className="flex-1 p-8 overflow-y-auto">
            {isGenerating ? (
                <LoadingState />
            ) : specContent ? (
                <article className="prose prose-invert prose-lg max-w-none prose-headings:text-indigo-400 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-strong:text-white prose-code:text-emerald-400 prose-pre:bg-slate-800">
                  {/* FIX: Render raw HTML directly as the model now provides HTML. */}
                  <div dangerouslySetInnerHTML={{__html: specContent }}/>
                </article>
            ) : (
                <EmptyState />
            )}
        </div>
    </div>
  );
};

export default SpecPanel;