import React from 'react';
import { AIResponse, GroundingChunkWeb } from '../../types';
import RichTextRenderer from '../common/RichTextRenderer'; // Import the new renderer

interface QnAResponseDisplayProps {
  response: AIResponse;
}

export const QnAResponseDisplay: React.FC<QnAResponseDisplayProps> = ({ response }) => {
  const webSources = response.sources?.filter(s => s.web).map(s => s.web as GroundingChunkWeb) || [];

  return (
    <div className="mt-6 p-6 bg-white/80 backdrop-blur-sm rounded-lg shadow-inner border border-purple-200">
      <h3 className="text-xl font-semibold text-purple-700 mb-3">AI's Answer:</h3>
      <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed">
        <RichTextRenderer text={response.text} />
      </div>

      {webSources.length > 0 && (
        <div className="mt-6 pt-4 border-t border-purple-200">
          <h4 className="text-md font-semibold text-purple-600 mb-2">Sources:</h4>
          <ul className="list-disc list-inside space-y-1">
            {webSources.map((source, index) => (
              <li key={index} className="text-sm">
                <a
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 hover:underline break-all"
                  title={source.title || source.uri}
                >
                  {source.title || source.uri}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};