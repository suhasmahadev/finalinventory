import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Warehouse,
    Receipt,
    ArrowLeftRight,
    BarChart3,
    Mic,
    Bot,
    Sparkles,
    Home
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const links = [
        { path: '/dashboard', label: 'Home', icon: Home },
        { path: '/agent', label: 'AI Agent', icon: Sparkles, highlight: true },
        { path: '/products', label: 'Product', icon: Package },
        { path: '/categories', label: 'Category', icon: LayoutDashboard }, // Assuming Category route exists
        { path: '/inventory', label: 'Inventory', icon: Package },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/warehouse', label: 'Warehouse', icon: Warehouse },
        { path: '/billing', label: 'Billing', icon: Receipt },
        { path: '/movement', label: 'Movement', icon: ArrowLeftRight },
        { path: '/ml-status', label: 'ML Status', icon: BarChart3 }, // Assuming ML Status route exists
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-beige-200 border-r border-beige-300 flex flex-col z-50 shadow-2xl shadow-brown-900/10 transition-colors duration-300">
            {/* Logo Area */}
            <Link to="/" className="block p-6 flex items-center gap-3 border-b border-beige-300 hover:bg-white/50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brown-600 to-brown-800 flex items-center justify-center shadow-lg shadow-brown-600/20">
                    <Sparkles className="w-5 h-5 text-beige-100" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brown-900 to-brown-700 font-display">
                    AIVENTORY
                </span>
            </Link>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-brown-500 uppercase tracking-wider">
                    Main Menu
                </div>
                {links.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.path);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={clsx(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative overflow-hidden",
                                active
                                    ? "bg-white text-brown-900 shadow-sm border border-beige-200"
                                    : "text-brown-600 hover:text-brown-900 hover:bg-white/50 hover:-translate-y-px"
                            )}
                        >
                            {active && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brown-600 rounded-r-full" />
                            )}
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${active
                                ? "bg-brown-100 text-brown-700"
                                : "bg-beige-100/50 text-brown-400 group-hover:bg-beige-100 group-hover:text-brown-600"
                                }`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className={clsx("font-medium", active ? "text-brown-900" : "")}>
                                {link.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-beige-300 bg-beige-100/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-beige-300 flex items-center justify-center">
                        <span className="text-xs font-bold text-brown-600">EP</span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-brown-900">Enterprise</div>
                        <div className="text-xs text-brown-500">v2.4.0 • Online</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
