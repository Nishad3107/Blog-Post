import { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Trips', path: '/trips' },
    { name: 'Add Story', path: '/add-story' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-gradient-to-r from-primary-dark to-dark-green shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link 
            to="/" 
            className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2 font-nav hover:opacity-90 transition-opacity duration-300"
          >
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-base-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden xs:inline">TravelBlog</span>
          </Link>
          
          <div className="hidden md:flex space-x-4 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-base-green hover:text-white px-2 lg:px-3 py-2 transition-all duration-300 font-nav text-sm lg:text-base nav-link-underline"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex w-[360px]">
            <SearchBar />
          </div>

          <button
            className="md:hidden text-base-green p-2 hover:bg-white/10 rounded-md transition-colors duration-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pb-4 space-y-4">
            <div className="px-3">
              <SearchBar compact onSearched={() => setIsOpen(false)} />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block text-base-green hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-all duration-300 font-nav"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
