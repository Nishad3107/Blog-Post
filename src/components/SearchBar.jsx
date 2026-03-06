import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ compact = false, onSearched }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    navigate(`/explore/${encodeURIComponent(value)}`);
    setQuery('');
    if (onSearched) onSearched();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2 ${compact ? 'w-full' : 'w-full max-w-md'}`}
    >
      <div className="relative flex-1">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search any destination (example: Goa, Paris, Manali)"
          className="w-full rounded-full bg-white/10 text-white placeholder:text-white/70 border border-white/20 focus:border-base-green focus:ring-2 focus:ring-base-green/30 px-4 py-2 text-sm sm:text-base font-body"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-full bg-base-green text-primary-dark w-10 h-10 sm:w-11 sm:h-11 hover:bg-accent-green transition-colors duration-300"
        aria-label="Search destination"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  );
}
