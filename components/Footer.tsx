
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 text-center p-6 shadow-inner mt-auto">
      <p>&copy; {new Date().getFullYear()} Saksham Nari AI. Empowering Women Financially.</p>
      <p className="text-sm mt-1">Built with ❤️ for India.</p>
    </footer>
  );
};
