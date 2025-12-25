import React, { useState, useEffect, useRef } from 'react';

interface SearchResult {
  title: string;
  url: string;
  type: string;
  tags: string[];
  date: string;
}

const SearchCmdK: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch data on open
  useEffect(() => {
    if (isOpen && data.length === 0) {
      fetch('/search.json')
        .then((res) => res.json())
        .then((json) => setData(json))
        .catch((err) => console.error('Failed to load search index', err));
    }
  }, [isOpen]);

  // Filter logic
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const lowerQuery = query.toLowerCase();
    const filtered = data
      .filter((item) => 
        item.title.toLowerCase().includes(lowerQuery) || 
        item.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .slice(0, 10); // Limit to 10 results
    setResults(filtered);
    setSelectedIndex(0);
  }, [query, data]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation for list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        window.location.href = results[selectedIndex].url;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div 
        className="w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-border px-4">
          <svg className="w-5 h-5 text-muted mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input
            ref={inputRef}
            type="text"
            className="w-full h-14 bg-transparent text-lg text-foreground placeholder-muted focus:outline-none font-mono"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <div className="text-xs text-muted border border-border px-2 py-1 rounded">ESC</div>
        </div>

        {results.length > 0 && (
          <div className="py-2 max-h-[60vh] overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={result.url}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between ${index === selectedIndex ? 'bg-accent/10' : 'hover:bg-accent/5'}`}
                onClick={() => window.location.href = result.url}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div>
                  <div className={`text-sm font-medium ${index === selectedIndex ? 'text-accent' : 'text-foreground'}`}>
                    {result.title}
                  </div>
                  <div className="text-xs text-muted mt-0.5 flex items-center gap-2">
                    <span className="uppercase tracking-wider opacity-70">{result.type}</span>
                    {result.tags?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{result.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
                {index === selectedIndex && (
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                )}
              </div>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="p-8 text-center text-muted text-sm">
            No results found for "{query}"
          </div>
        )}
        
        {!query && (
           <div className="p-4 text-xs text-muted text-center border-t border-border bg-bg/50">
             Type to search • <span className="text-foreground">↑↓</span> to navigate • <span className="text-foreground">↵</span> to select
           </div>
        )}
      </div>
    </div>
  );
};

export default SearchCmdK;
