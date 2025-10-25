
import React, { useState, FormEvent } from 'react';
import { MagnifyingGlassIcon } from './Icons';

interface HeaderProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-800">
            HNET <span className="font-light">Suporte</span>
          </h1>
        </div>
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Descreva o problema aqui (ex: 'luz LOS vermelha')..."
              className="w-full py-2 pl-4 pr-12 text-gray-700 bg-gray-100 border-2 border-gray-200 rounded-full focus:outline-none focus:bg-white focus:border-blue-500 transition-colors"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-gray-500 hover:text-blue-600 disabled:opacity-50"
              disabled={isLoading}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
