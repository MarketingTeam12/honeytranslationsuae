import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languages = ['EN', 'AR'] as const;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBasePath = () => {
    if (location.pathname === '/ar') return '/';
    if (location.pathname.startsWith('/ar/')) return location.pathname.slice(3) || '/';
    return location.pathname || '/';
  };

  const handleLanguageSelect = (lang: typeof languages[number]) => {
    const basePath = getBasePath();
    const localizedPath = lang === 'AR'
      ? basePath === '/' ? '/ar/' : `/ar${basePath}`
      : basePath;

    setLanguage(lang);
    localStorage.setItem('language', lang);
    navigate(`${localizedPath}${location.search}${location.hash}`);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef} data-allow-latin>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 text-sm font-medium text-gray-700 shadow-sm hover:shadow-md"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Language selector"
      >
        <span className="text-yellow-700 font-semibold">{language}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-1 min-w-full bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
          style={{ animation: 'slideDown 0.2s ease-out' }}
          role="listbox"
        >
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => handleLanguageSelect(lang)}
              className={`w-full px-4 py-2 text-sm text-left transition-all duration-150 ${
                language === lang
                  ? 'bg-yellow-50 text-yellow-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-600'
              }`}
              role="option"
              aria-selected={language === lang}
            >
              {lang}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
