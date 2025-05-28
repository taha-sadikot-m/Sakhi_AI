
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QnASection } from './components/qna/QnASection';
import { SchemeFinderSection } from './components/schemes/SchemeFinderSection';
import { Feature } from './types';
import { Icons } from './constants';

const App: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<Feature>(Feature.QnA);

  const handleFeatureChange = useCallback((feature: Feature) => {
    setActiveFeature(feature);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header onFeatureChange={handleFeatureChange} activeFeature={activeFeature} />
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeFeature === Feature.QnA && (
          <div className="animate-fadeIn">
            <h2 className="text-3xl font-bold text-center text-purple-700 mb-8 flex items-center justify-center space-x-2">
              {Icons.QuestionMark}
              <span>Financial Questions & Answers</span>
            </h2>
            <QnASection />
          </div>
        )}
        {activeFeature === Feature.SchemeFinder && (
          <div className="animate-fadeIn">
             <h2 className="text-3xl font-bold text-center text-teal-700 mb-8 flex items-center justify-center space-x-2">
              {Icons.Briefcase}
              <span>Discover Relevant Schemes</span>
            </h2>
            <SchemeFinderSection />
          </div>
        )}
      </main>
      <Footer />
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;