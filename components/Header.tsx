
import React from 'react';
import { Feature } from '../types';
import { APP_TITLE, Icons } from '../constants';

interface HeaderProps {
  activeFeature: Feature;
  onFeatureChange: (feature: Feature) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeFeature, onFeatureChange }) => {
  const navButtonClasses = (feature: Feature) =>
    `flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
      activeFeature === feature
        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105'
        : 'bg-white text-gray-700 hover:bg-purple-100 hover:text-purple-700'
    }`;

  return (
    <header className="bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-4 sm:mb-0">
          {Icons.Lightbulb}
          <h1 className="text-2xl font-bold tracking-tight">{APP_TITLE}</h1>
        </div>
        <nav className="flex space-x-2 sm:space-x-4 bg-white/20 backdrop-blur-sm p-2 rounded-xl">
          <button
            onClick={() => onFeatureChange(Feature.QnA)}
            className={`${navButtonClasses(Feature.QnA)} focus:ring-purple-500`}
          >
            {Icons.QuestionMark}
            <span>Q&A</span>
          </button>
          <button
            onClick={() => onFeatureChange(Feature.SchemeFinder)}
            className={`${navButtonClasses(Feature.SchemeFinder)} focus:ring-teal-500`}
          >
            {Icons.Briefcase}
            <span>Schemes</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
