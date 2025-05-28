
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl p-6 sm:p-8 ${className}`}>
      {children}
    </div>
  );
};
