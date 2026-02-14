import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, ShieldCheck, Command } from 'lucide-react';

const SEARCHABLE_FEATURES = [
    { name: 'Command Center', path: '/dashboard', keywords: ['home', 'dashboard', 'main'] },
    { name: 'AI Agent', path: '/agent', keywords: ['ai', 'chat', 'ask', 'help'] },
    { name: 'Predictive Analytics', path: '/analytics', keywords: ['charts', 'graphs', 'trends', 'forecast'] },
    { name: 'Inventory Management', path: '/inventory', keywords: ['stock', 'items', 'products', 'list'] },
    { name: 'Product Categories', path: '/categories', keywords: ['groups', 'types', 'organization'] },
    { name: 'Warehouse Management', path: '/warehouse', keywords: ['locations', 'zones', 'storage'] },
    { name: 'Stock Movement', path: '/movement', keywords: ['transfer', 'history', 'logs', 'sync'] },
    { name: 'Billing & Invoices', path: '/billing', keywords: ['finance', 'money', 'cost'] },
];

const Header = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.trim() === '') {
            setResults([]);
            return;
        }

        const filtered = SEARCHABLE_FEATURES.filter(feature =>
            feature.name.toLowerCase().includes(value.toLowerCase()) ||
            feature.keywords.some(k => k.toLowerCase().includes(value.toLowerCase()))
        );
        setResults(filtered);
    };

    const handleSelect = (path) => {
        navigate(path);
        setQuery('');
        setResults([]);
        setIsFocused(false);
    };

    return (
        <header className="glass-header h-20 px-8 flex items-center justify-between transition-colors duration-300 border-b border-beige-200">
            {/* Search Bar - Expanded */}
            <div className="flex-1 max-w-5xl flex items-center" ref={searchRef}>
                <div className="relative group w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brown-400 group-focus-within:text-brown-600 transition-colors w-5 h-5" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Search features (e.g., 'Analytics', 'Stock')..."
                        className="w-full pl-10 pr-4 py-2 bg-white/50 border border-beige-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-brown-400/20 focus:border-brown-400 transition-all text-brown-800 placeholder-brown-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-brown-400 pointer-events-none">
                        <Command className="w-3 h-3" />
                        <span className="text-xs">K</span>
                    </div>

                    {/* Search Dropdown */}
                    {isFocused && (query || results.length > 0) && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-beige-200 overflow-hidden z-50 animate-fade-in-up">
                            {results.length > 0 ? (
                                <div className="py-2">
                                    <div className="px-4 py-2 text-xs font-bold text-brown-400 uppercase tracking-wider">
                                        Features
                                    </div>
                                    {results.map((feature) => (
                                        <button
                                            key={feature.path}
                                            onClick={() => handleSelect(feature.path)}
                                            className="w-full px-4 py-3 text-left hover:bg-beige-50 flex items-center justify-between group transition-colors"
                                        >
                                            <span className="font-medium text-brown-900 group-hover:text-brown-700">
                                                {feature.name}
                                            </span>
                                            <span className="text-xs text-brown-400 bg-brown-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                                Jump to
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ) : query ? (
                                <div className="p-4 text-center text-brown-500 text-sm">
                                    No features found for "{query}"
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-8 ml-auto pl-8">
                <button className="p-2 text-brown-400 hover:text-brown-700 hover:bg-brown-50 rounded-lg transition-all relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="w-px h-8 bg-beige-200 hidden sm:block"></div>

                <div className="flex items-center gap-3 pl-2">
                    <div className="text-right hidden sm:flex flex-col justify-center h-10 mr-1 pt-2">
                        <p className="text-sm font-bold text-brown-900 leading-none mb-0">Admin User</p>
                        <p className="text-xs text-brown-500 leading-tight">Inventory Manager</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brown-100 to-beige-200 border border-beige-300 flex items-center justify-center shadow-inner">
                        <span className="font-bold text-brown-700">AD</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
